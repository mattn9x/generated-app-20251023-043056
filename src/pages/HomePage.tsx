import { AppHeader } from "@/components/AppHeader";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { api } from "@/lib/api-client";
import { Category, Expense, MonthlySummary, HistoricalData } from "@shared/types";
import { DashboardStats } from "@/components/DashboardStats";
import { ExpenseChart } from "@/components/ExpenseChart";
import { RecentExpenses } from "@/components/RecentExpenses";
import { Skeleton } from "@/components/ui/skeleton";
import { useMemo, useState } from "react";
import { AddExpenseSheet, ExpenseFormValues } from "@/components/AddExpenseSheet";
import { toast } from "sonner";
import { startOfMonth, endOfMonth, parseISO } from 'date-fns';
const fetchSummary = async (): Promise<MonthlySummary> => api('/api/summary/monthly');
const fetchCategories = async (): Promise<Category[]> => api('/api/categories');
const fetchExpenses = async (): Promise<Expense[]> => api('/api/expenses');
const fetchHistoricalData = async (): Promise<HistoricalData[]> => api('/api/analytics/historical');
const addExpense = async (expenseData: Omit<Expense, 'id'>): Promise<Expense> => {
  return api('/api/expenses', {
    method: 'POST',
    body: JSON.stringify(expenseData),
  });
};
export function HomePage() {
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const queryClient = useQueryClient();
  const summaryQuery = useQuery({ queryKey: ['monthlySummary'], queryFn: fetchSummary });
  const categoriesQuery = useQuery({ queryKey: ['categories'], queryFn: fetchCategories });
  const expensesQuery = useQuery({ queryKey: ['expenses'], queryFn: fetchExpenses });
  const historicalQuery = useQuery({ queryKey: ['historicalData'], queryFn: fetchHistoricalData });
  const mutation = useMutation({
    mutationFn: addExpense,
    onSuccess: () => {
      toast.success("Expense added successfully!");
      return Promise.all([
        queryClient.invalidateQueries({ queryKey: ['monthlySummary'] }),
        queryClient.invalidateQueries({ queryKey: ['expenses'] }),
        queryClient.invalidateQueries({ queryKey: ['historicalData'] }),
      ]);
    },
    onError: (error) => {
      toast.error("Failed to add expense: " + error.message);
    },
    onSettled: () => {
      setIsSheetOpen(false);
    }
  });
  const handleAddExpense = async (values: ExpenseFormValues) => {
    const newExpense = {
      description: values.description,
      amount: Math.round(values.amount * 100), // convert to cents
      categoryId: values.categoryId,
      date: values.date.toISOString(),
    };
    await mutation.mutateAsync(newExpense);
  };
  const monthlyExpenses = useMemo(() => {
    const allExpenses = expensesQuery.data ?? [];
    const now = new Date();
    const start = startOfMonth(now);
    const end = endOfMonth(now);
    return allExpenses.filter(e => {
      const expenseDate = parseISO(e.date);
      return expenseDate >= start && expenseDate <= end;
    });
  }, [expensesQuery.data]);
  const previousMonthSpending = useMemo(() => {
    const data = historicalQuery.data ?? [];
    if (data.length < 2) return 0;
    return data[data.length - 2].total;
  }, [historicalQuery.data]);
  const isLoading = summaryQuery.isLoading || categoriesQuery.isLoading || expensesQuery.isLoading || historicalQuery.isLoading;
  const isError = summaryQuery.isError || categoriesQuery.isError || expensesQuery.isError || historicalQuery.isError;
  return (
    <div className="min-h-screen bg-warm-gradient">
      <AppHeader />
      <main>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-8 md:py-10 lg:py-12">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
              <div>
                <h1 className="text-4xl font-bold font-display text-foreground">Dashboard</h1>
                <p className="text-muted-foreground mt-1">
                  Here's a summary of your spending for this month.
                </p>
              </div>
              <Button onClick={() => setIsSheetOpen(true)} className="transition-transform hover:scale-105 active:scale-95">
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Expense
              </Button>
            </div>
            {isError && (
              <div className="bg-destructive/10 text-destructive p-4 rounded-lg text-center">
                Failed to load dashboard data. Please try again later.
              </div>
            )}
            <div className="grid gap-6 grid-cols-1 lg:grid-cols-3">
              {isLoading ? (
                <>
                  <Skeleton className="h-32 rounded-lg" />
                  <Skeleton className="h-96 rounded-lg lg:col-span-2" />
                  <Skeleton className="h-80 rounded-lg lg:col-span-3" />
                </>
              ) : (
                <>
                  <DashboardStats
                    totalSpending={summaryQuery.data?.totalSpending ?? 0}
                    previousMonthSpending={previousMonthSpending}
                  />
                  <ExpenseChart expenses={monthlyExpenses} categories={categoriesQuery.data ?? []} />
                  <RecentExpenses expenses={monthlyExpenses} categories={categoriesQuery.data ?? []} />
                </>
              )}
            </div>
          </div>
        </div>
      </main>
      <AddExpenseSheet
        isOpen={isSheetOpen}
        onClose={() => setIsSheetOpen(false)}
        onSubmit={handleAddExpense}
        categories={categoriesQuery.data ?? []}
      />
    </div>
  );
}