import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Category, Expense } from '@shared/types';
import { format } from 'date-fns';
interface RecentExpensesProps {
  expenses: Expense[];
  categories: Category[];
}
export function RecentExpenses({ expenses, categories }: RecentExpensesProps) {
  const categoryMap = new Map(categories.map(c => [c.id, c]));
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(value / 100);
  };
  return (
    <Card className="col-span-1 lg:col-span-3">
      <CardHeader>
        <CardTitle>Recent Transactions</CardTitle>
      </CardHeader>
      <CardContent>
        {expenses.length > 0 ? (
          <ul className="space-y-4">
            {expenses.slice(0, 5).map((expense) => {
              const category = categoryMap.get(expense.categoryId);
              return (
                <li key={expense.id} className="flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="font-medium">{expense.description}</span>
                    <div className="flex items-center gap-2">
                      <span
                        className="h-2 w-2 rounded-full"
                        style={{ backgroundColor: category?.color || '#cccccc' }}
                      />
                      <span className="text-sm text-muted-foreground">
                        {category?.name || 'Uncategorized'}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="font-semibold">{formatCurrency(expense.amount)}</span>
                    <p className="text-sm text-muted-foreground">{format(new Date(expense.date), 'MMM d, yyyy')}</p>
                  </div>
                </li>
              );
            })}
          </ul>
        ) : (
          <div className="text-center text-muted-foreground py-8">
            You haven't added any expenses this month.
          </div>
        )}
      </CardContent>
    </Card>
  );
}