import { CategoryId } from "@/constants/categories";

export interface Expense {
  id: string;
  amount: number;
  category: CategoryId;
  description: string;
  date: string;
  createdAt: string;
}