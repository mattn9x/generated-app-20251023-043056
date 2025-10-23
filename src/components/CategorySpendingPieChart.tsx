import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Category, Expense } from '@shared/types';
interface CategorySpendingPieChartProps {
  expenses: Expense[];
  categories: Category[];
}
export function CategorySpendingPieChart({ expenses, categories }: CategorySpendingPieChartProps) {
  const categoryMap = new Map(categories.map(c => [c.id, c]));
  const data = expenses.reduce((acc, expense) => {
    const category = categoryMap.get(expense.categoryId);
    const categoryName = category?.name || 'Uncategorized';
    const categoryColor = category?.color || '#8884d8';
    if (!acc[categoryName]) {
      acc[categoryName] = { name: categoryName, value: 0, color: categoryColor };
    }
    acc[categoryName].value += expense.amount / 100;
    return acc;
  }, {} as Record<string, { name: string; value: number; color: string }>);
  const chartData = Object.values(data);
  return (
    <Card>
      <CardHeader>
        <CardTitle>Spending by Category</CardTitle>
        <CardDescription>Breakdown of all your expenses by category.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-80 w-full">
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  nameKey="name"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value)}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-full text-muted-foreground">
              No expense data available.
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}