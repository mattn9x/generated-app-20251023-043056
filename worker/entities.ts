import { IndexedEntity } from "./core-utils";
import type { Category, Expense } from "@shared/types";
import { MOCK_CATEGORIES, MOCK_EXPENSES } from "@shared/mock-data";
export class CategoryEntity extends IndexedEntity<Category> {
  static readonly entityName = "category";
  static readonly indexName = "categories";
  static readonly initialState: Category = { id: "", name: "", color: "#cccccc" };
  static seedData = MOCK_CATEGORIES;
}
export class ExpenseEntity extends IndexedEntity<Expense> {
  static readonly entityName = "expense";
  static readonly indexName = "expenses";
  static readonly initialState: Expense = { id: "", amount: 0, description: "", categoryId: "", date: "" };
  static seedData = MOCK_EXPENSES;
}