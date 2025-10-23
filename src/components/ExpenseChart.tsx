import { useMemo } from 'react';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis, Cell } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Category, Expense } from '@shared/types';
interface ExpenseChartProps {
  expenses: Expense[];
  categories: Category[];
}
export function ExpenseChart({ expenses, categories }: ExpenseChartProps) {
  const chartData = useMemo(() => {
    const categoryMap = new Map(categories.map(c => [c.id, c]));
    const data = expenses.reduce((acc, expense) => {
      const category = categoryMap.get(expense.categoryId);
      const categoryName = category?.name || 'Uncategorized';
      const categoryColor = category?.color || '#8884d8';
      if (!acc[categoryName]) {
        acc[categoryName] = { total: 0, color: categoryColor };
      }
      acc[categoryName].total += expense.amount / 100;
      return acc;
    }, {} as Record<string, { total: number; color: string }>);
    return Object.entries(data).map(([name, { total, color }]) => ({ name, total, color }));
  }, [expenses, categories]);
  return (
    <Card className="col-span-1 lg:col-span-2">
      <CardHeader>
        <CardTitle>Spending by Category</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-80 w-full">
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value}`} />
                <Tooltip
                  cursor={{ fill: 'hsl(var(--muted))' }}
                  contentStyle={{
                    backgroundColor: 'hsl(var(--background))',
                    borderColor: 'hsl(var(--border))',
                    borderRadius: 'var(--radius)',
                  }}
                  formatter={(value: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value)}
                />
                <Bar dataKey="total" radius={[4, 4, 0, 0]}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-full text-muted-foreground">
              No expense data for this month yet.
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}