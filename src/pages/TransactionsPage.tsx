import { AppHeader } from "@/components/AppHeader";
import { TransactionsDataTable } from "@/components/TransactionsDataTable";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/lib/api-client";
import { Category, Expense } from "@shared/types";
import { useQuery } from "@tanstack/react-query";
import { PlusCircle } from "lucide-react";
import { useState } from "react";
import { AddExpenseSheet, ExpenseFormValues } from "@/components/AddExpenseSheet";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
const fetchCategories = async (): Promise<Category[]> => api('/api/categories');
const fetchExpenses = async (): Promise<Expense[]> => api('/api/expenses');
const addExpense = async (expenseData: Omit<Expense, 'id'>): Promise<Expense> => {
  return api('/api/expenses', {
    method: 'POST',
    body: JSON.stringify(expenseData),
  });
};
const updateExpense = async (expenseData: Expense): Promise<Expense> => {
  return api(`/api/expenses/${expenseData.id}`, {
    method: 'PUT',
    body: JSON.stringify(expenseData),
  });
};
export function TransactionsPage() {
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | undefined>(undefined);
  const queryClient = useQueryClient();
  const categoriesQuery = useQuery({ queryKey: ['categories'], queryFn: fetchCategories });
  const expensesQuery = useQuery({ queryKey: ['expenses'], queryFn: fetchExpenses });
  const createMutation = useMutation({
    mutationFn: addExpense,
    onSuccess: () => {
      toast.success("Expense added successfully!");
      return queryClient.invalidateQueries({ queryKey: ['expenses'] });
    },
    onError: (error) => {
      toast.error("Failed to add expense: " + error.message);
    },
    onSettled: () => {
      setIsSheetOpen(false);
    }
  });
  const updateMutation = useMutation({
    mutationFn: updateExpense,
    onSuccess: () => {
      toast.success("Expense updated successfully!");
      return queryClient.invalidateQueries({ queryKey: ['expenses'] });
    },
    onError: (error) => {
      toast.error("Failed to update expense: " + error.message);
    },
    onSettled: () => {
      setIsSheetOpen(false);
      setEditingExpense(undefined);
    }
  });
  const handleSheetSubmit = async (values: ExpenseFormValues) => {
    if (editingExpense) {
      const updatedExpense: Expense = {
        ...editingExpense,
        ...values,
        amount: Math.round(values.amount * 100),
        date: values.date.toISOString(),
      };
      await updateMutation.mutateAsync(updatedExpense);
    } else {
      const newExpense = {
        description: values.description,
        amount: Math.round(values.amount * 100),
        categoryId: values.categoryId,
        date: values.date.toISOString(),
      };
      await createMutation.mutateAsync(newExpense);
    }
  };
  const handleOpenNew = () => {
    setEditingExpense(undefined);
    setIsSheetOpen(true);
  };
  const handleOpenEdit = (expense: Expense) => {
    setEditingExpense(expense);
    setIsSheetOpen(true);
  };
  const handleSheetClose = () => {
    setIsSheetOpen(false);
    // Delay clearing the form to prevent flash of empty state
    setTimeout(() => setEditingExpense(undefined), 150);
  };
  const isLoading = categoriesQuery.isLoading || expensesQuery.isLoading;
  const isError = categoriesQuery.isError || expensesQuery.isError;
  return (
    <div className="min-h-screen bg-warm-gradient">
      <AppHeader />
      <main>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-8 md:py-10 lg:py-12">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
              <div>
                <h1 className="text-4xl font-bold font-display text-foreground">All Transactions</h1>
                <p className="text-muted-foreground mt-1">
                  A complete history of your spending.
                </p>
              </div>
              <Button onClick={handleOpenNew} className="transition-transform hover:scale-105 active:scale-95">
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Expense
              </Button>
            </div>
            {isError && (
              <div className="bg-destructive/10 text-destructive p-4 rounded-lg text-center">
                Failed to load transaction data. Please try again later.
              </div>
            )}
            {isLoading ? (
              <div className="space-y-4">
                <Skeleton className="h-12 w-1/3 rounded-lg" />
                <Skeleton className="h-96 w-full rounded-lg" />
              </div>
            ) : (
              <TransactionsDataTable
                expenses={expensesQuery.data ?? []}
                categories={categoriesQuery.data ?? []}
                onEdit={handleOpenEdit}
              />
            )}
          </div>
        </div>
      </main>
      <AddExpenseSheet
        isOpen={isSheetOpen}
        onClose={handleSheetClose}
        onSubmit={handleSheetSubmit}
        categories={categoriesQuery.data ?? []}
        expense={editingExpense}
      />
    </div>
  );
}