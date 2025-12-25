'use client';

import { useState } from 'react';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { Expense } from '@/types/expense';
import ExpenseForm from '@/components/ExpenseForm';
import ExpenseList from '@/components/ExpenseList';
import Summary from '@/components/Summary';
import { CATEGORIES } from '@/constants/categories';

export default function Home() {
  const [expenses, setExpenses] = useLocalStorage<Expense[]>('expenses', []);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

const filteredExpenses = expenses.filter(e => {
  const categoryMatch =
    categoryFilter === 'all' || e.category === categoryFilter;

  const expenseDate = new Date(e.date).getTime();
  const fromDate = dateFrom ? new Date(dateFrom).getTime() : -Infinity;
  const toDate = dateTo ? new Date(dateTo).getTime() : Infinity;
  const dateMatch = expenseDate >= fromDate && expenseDate <= toDate;

  return categoryMatch && dateMatch;
});


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

  const handleUpdateExpense = (updated: Expense) => {
  setExpenses(expenses.map(e => (e.id === updated.id ? updated : e)));
  setEditingExpense(null);
};

  return (
    <main className="max-w-4xl mx-auto p-4 md:p-8 space-y-8 bg-gray-700 rounded-lg">
      <h1 className="text-3xl font-bold text-center">Трекер расходов</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1">
          <ExpenseForm onAdd={handleAddExpense}  
          onUpdate={handleUpdateExpense}
          editingExpense={editingExpense}
          onCancelEdit={() => setEditingExpense(null)}
          />
        </div>
        
        <div className="md:col-span-2 space-y-8">
          <select
            value={categoryFilter}
            onChange={e => setCategoryFilter(e.target.value)}
            className="border p-2 rounded bg-white"
          >
            <option value="all">Все категории</option>
            {CATEGORIES.map(cat => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
          <input type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)} className="border p-2 rounded bg-white mx-2"/>
          <input type="date" value={dateTo} onChange={e => setDateTo(e.target.value)} className="border p-2 rounded bg-white"/>
          <Summary expenses={filteredExpenses}/>
          <div className="border rounded-lg p-4 bg-white shadow-sm">
            <h3 className="text-lg font-bold mb-4">История трат</h3>
            <ExpenseList 
              expenses={filteredExpenses}
              onDelete={handleDeleteExpense}
              onEdit={setEditingExpense} 
            />
          </div>
        </div>
      </div>
    </main>
  );
}