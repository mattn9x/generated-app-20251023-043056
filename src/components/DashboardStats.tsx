import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { ArrowDown, ArrowUp, Wallet } from 'lucide-react';
interface DashboardStatsProps {
  totalSpending: number;
  previousMonthSpending?: number;
}
export function DashboardStats({ totalSpending, previousMonthSpending = 0 }: DashboardStatsProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(value / 100);
  };
  const percentageChange = previousMonthSpending > 0
    ? ((totalSpending - previousMonthSpending) / previousMonthSpending) * 100
    : totalSpending > 0 ? 100 : 0;
  const isIncrease = percentageChange > 0;
  return (
    <Card className="col-span-1">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Total Spending (This Month)</CardTitle>
        <Wallet className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{formatCurrency(totalSpending)}</div>
        <div className="text-xs text-muted-foreground flex items-center">
          {percentageChange !== 0 && (
            <span className={cn("flex items-center mr-1", isIncrease ? "text-red-500" : "text-green-500")}>
              {isIncrease ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />}
              {Math.abs(percentageChange).toFixed(1)}%
            </span>
          )}
          from last month
        </div>
      </CardContent>
    </Card>
  );
}