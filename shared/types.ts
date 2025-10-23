export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}
export interface Category {
  id: string;
  name: string;
  color?: string; // e.g., hex color code like '#ff0000'
}
export interface Expense {
  id: string;
  amount: number; // in cents
  description: string;
  categoryId: string;
  date: string; // ISO 8601 string
}
export interface MonthlySummary {
  totalSpending: number; // in cents
  expensesByCategory: { categoryId: string; total: number }[];
}
export interface HistoricalData {
  month: string; // e.g., "Jan 2024"
  total: number; // in cents
}