import type { Category, Expense } from './types';
export const MOCK_CATEGORIES: Category[] = [
  { id: 'cat_1', name: 'Food & Dining', color: '#FF6384' },
  { id: 'cat_2', name: 'Transportation', color: '#36A2EB' },
  { id: 'cat_3', name: 'Housing', color: '#FFCE56' },
  { id: 'cat_4', name: 'Entertainment', color: '#4BC0C0' },
  { id: 'cat_5', name: 'Shopping', color: '#9966FF' },
  { id: 'cat_6', name: 'Utilities', color: '#FF9F40' },
];
export const MOCK_EXPENSES: Expense[] = [
  { id: 'exp_1', amount: 2550, description: 'Groceries from Whole Foods', categoryId: 'cat_1', date: new Date(new Date().setDate(new Date().getDate() - 1)).toISOString() },
  { id: 'exp_2', amount: 1200, description: 'Dinner at Italian restaurant', categoryId: 'cat_1', date: new Date(new Date().setDate(new Date().getDate() - 2)).toISOString() },
  { id: 'exp_3', amount: 3000, description: 'Monthly train pass', categoryId: 'cat_2', date: new Date(new Date().setDate(new Date().getDate() - 3)).toISOString() },
  { id: 'exp_4', amount: 150000, description: 'Rent payment', categoryId: 'cat_3', date: new Date(new Date().setDate(new Date().getDate() - 5)).toISOString() },
  { id: 'exp_5', amount: 4500, description: 'Movie tickets for two', categoryId: 'cat_4', date: new Date(new Date().setDate(new Date().getDate() - 6)).toISOString() },
];