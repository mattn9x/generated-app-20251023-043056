import { AppHeader } from "@/components/AppHeader";
import { CategorySpendingPieChart } from "@/components/CategorySpendingPieChart";
import { MonthlyComparisonChart } from "@/components/MonthlyComparisonChart";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/lib/api-client";
import { Category, Expense, HistoricalData } from "@shared/types";
import { useQuery } from "@tanstack/react-query";
const fetchHistoricalData = async (): Promise<HistoricalData[]> => api('/api/analytics/historical');
const fetchAllExpenses = async (): Promise<Expense[]> => api('/api/expenses');
const fetchCategories = async (): Promise<Category[]> => api('/api/categories');
export function AnalyticsPage() {
  const historicalQuery = useQuery({ queryKey: ['historicalData'], queryFn: fetchHistoricalData });
  const expensesQuery = useQuery({ queryKey: ['expenses'], queryFn: fetchAllExpenses });
  const categoriesQuery = useQuery({ queryKey: ['categories'], queryFn: fetchCategories });
  const isLoading = historicalQuery.isLoading || expensesQuery.isLoading || categoriesQuery.isLoading;
  const isError = historicalQuery.isError || expensesQuery.isError || categoriesQuery.isError;
  return (
    <div className="min-h-screen bg-warm-gradient">
      <AppHeader />
      <main>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-8 md:py-10 lg:py-12">
            <div className="mb-8">
              <h1 className="text-4xl font-bold font-display text-foreground">Analytics</h1>
              <p className="text-muted-foreground mt-1">
                A deeper look into your spending habits over time.
              </p>
            </div>
            {isError && (
              <div className="bg-destructive/10 text-destructive p-4 rounded-lg text-center">
                Failed to load analytics data. Please try again later.
              </div>
            )}
            <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
              {isLoading ? (
                <>
                  <Skeleton className="h-96 rounded-lg" />
                  <Skeleton className="h-96 rounded-lg" />
                </>
              ) : (
                <>
                  <MonthlyComparisonChart data={historicalQuery.data ?? []} />
                  <CategorySpendingPieChart expenses={expensesQuery.data ?? []} categories={categoriesQuery.data ?? []} />
                </>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}