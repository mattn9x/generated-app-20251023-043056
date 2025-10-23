import { Hono } from "hono";
import type { Env } from './core-utils';
import { CategoryEntity, ExpenseEntity } from "./entities";
import { ok, bad, isStr, notFound } from './core-utils';
import { startOfMonth, endOfMonth, parseISO, subMonths, format } from 'date-fns';
import type { Category, Expense, HistoricalData } from "@shared/types";
export function userRoutes(app: Hono<{ Bindings: Env; }>) {
  // CATEGORY ROUTES
  app.get('/api/categories', async (c) => {
    await CategoryEntity.ensureSeed(c.env);
    const { items } = await CategoryEntity.list(c.env, null, 100);
    return ok(c, items);
  });
  app.post('/api/categories', async (c) => {
    const body = await c.req.json<Omit<Category, 'id'>>();
    if (!isStr(body.name)) {
      return bad(c, 'Invalid category data');
    }
    const newCategory: Omit<Category, 'id'> = {
      name: body.name,
      color: body.color || '#cccccc',
    };
    const created = await CategoryEntity.create(c.env, { id: crypto.randomUUID(), ...newCategory });
    return c.json({ success: true, data: created }, 201);
  });
  app.put('/api/categories/:id', async (c) => {
    const id = c.req.param('id');
    const body = await c.req.json<Category>();
    if (id !== body.id) {
      return bad(c, 'ID mismatch');
    }
    const entity = new CategoryEntity(c.env, id);
    if (!(await entity.exists())) {
      return notFound(c);
    }
    await entity.save(body);
    return ok(c, body);
  });
  app.delete('/api/categories/:id', async (c) => {
    const id = c.req.param('id');
    const deleted = await CategoryEntity.delete(c.env, id);
    if (!deleted) {
      return notFound(c);
    }
    return ok(c, { id });
  });
  // EXPENSE ROUTES
  app.get('/api/expenses', async (c) => {
    await ExpenseEntity.ensureSeed(c.env);
    const { items } = await ExpenseEntity.list(c.env, null, 1000);
    const sortedExpenses = [...items].sort((a, b) => parseISO(b.date).getTime() - parseISO(a.date).getTime());
    return ok(c, sortedExpenses);
  });
  app.post('/api/expenses', async (c) => {
    const body = await c.req.json();
    if (!isStr(body.description) || typeof body.amount !== 'number' || !isStr(body.categoryId) || !isStr(body.date)) {
      return bad(c, 'Invalid expense data');
    }
    const newExpense: Omit<Expense, 'id'> = {
      description: body.description,
      amount: body.amount,
      categoryId: body.categoryId,
      date: body.date
    };
    const created = await ExpenseEntity.create(c.env, { id: crypto.randomUUID(), ...newExpense });
    return ok(c, created);
  });
  app.put('/api/expenses/:id', async (c) => {
    const id = c.req.param('id');
    const body = await c.req.json<Expense>();
    if (id !== body.id) {
      return bad(c, 'ID mismatch');
    }
    const entity = new ExpenseEntity(c.env, id);
    if (!(await entity.exists())) {
      return notFound(c);
    }
    await entity.save(body);
    return ok(c, body);
  });
  app.delete('/api/expenses/:id', async (c) => {
    const id = c.req.param('id');
    const deleted = await ExpenseEntity.delete(c.env, id);
    if (!deleted) {
      return notFound(c);
    }
    return ok(c, { id });
  });
  // SUMMARY & ANALYTICS ROUTES
  app.get('/api/summary/monthly', async (c) => {
    await ExpenseEntity.ensureSeed(c.env);
    const { items } = await ExpenseEntity.list(c.env, null, 1000);
    const now = new Date();
    const start = startOfMonth(now);
    const end = endOfMonth(now);
    const monthlyExpenses = items.filter((e) => {
      const expenseDate = parseISO(e.date);
      return expenseDate >= start && expenseDate <= end;
    });
    const totalSpending = monthlyExpenses.reduce((sum, e) => sum + e.amount, 0);
    const expensesByCategoryMap = monthlyExpenses.reduce((acc, e) => {
      if (!acc[e.categoryId]) {
        acc[e.categoryId] = 0;
      }
      acc[e.categoryId] += e.amount;
      return acc;
    }, {} as Record<string, number>);
    const expensesByCategory = Object.entries(expensesByCategoryMap).map(([categoryId, total]) => ({
      categoryId,
      total
    }));
    return ok(c, { totalSpending, expensesByCategory });
  });
  app.get('/api/analytics/historical', async (c) => {
    await ExpenseEntity.ensureSeed(c.env);
    const { items } = await ExpenseEntity.list(c.env, null, 5000); // Fetch more for historical data
    const monthlyTotals: Record<string, number> = {};
    for (let i = 0; i < 6; i++) {
      const date = subMonths(new Date(), i);
      const monthKey = format(date, 'yyyy-MM');
      monthlyTotals[monthKey] = 0;
    }
    items.forEach(expense => {
      const monthKey = format(parseISO(expense.date), 'yyyy-MM');
      if (Object.prototype.hasOwnProperty.call(monthlyTotals, monthKey)) {
        monthlyTotals[monthKey] += expense.amount;
      }
    });
    const historicalData: HistoricalData[] = Object.entries(monthlyTotals)
      .map(([month, total]) => ({
        month: format(new Date(`${month}-02`), 'MMM yyyy'), // Use day 2 to avoid timezone issues
        total,
      }))
      .sort((a, b) => new Date(a.month).getTime() - new Date(b.month).getTime());
    return ok(c, historicalData);
  });
}