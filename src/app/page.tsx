'use client';

import { useLocalStorage } from '@/hooks/useLocalStorage';
import { Expense } from '@/types/expense';
import ExpenseForm from '@/components/ExpenseForm';
import ExpenseList from '@/components/ExpenseList';
import Summary from '@/components/Summary';

export default function Home() {
  const [expenses, setExpenses] = useLocalStorage<Expense[]>('expenses', []);

  const handleAddExpense = (newExpenseData: Omit<Expense, 'id' | 'createdAt'>) => {
    const newExpense: Expense = {
      ...newExpenseData,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString(),
    };
    setExpenses([...expenses, newExpense]);
  };

  const handleDeleteExpense = (id: string) => {
    setExpenses(expenses.filter(e => e.id !== id));
  };

  return (
    <main className="max-w-4xl mx-auto p-4 md:p-8 space-y-8">
      <h1 className="text-3xl font-bold text-center">Трекер расходов</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1">
          <ExpenseForm onAdd={handleAddExpense} />
        </div>
        
        <div className="md:col-span-2 space-y-8">
          <Summary expenses={expenses} />
          <div className="border rounded-lg p-4 bg-white shadow-sm">
            <h3 className="text-lg font-bold mb-4">История трат</h3>
            <ExpenseList 
              expenses={expenses} 
              onDelete={handleDeleteExpense} 
            />
          </div>
        </div>
      </div>
    </main>
  );
}