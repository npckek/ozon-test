'use client';

import { Expense } from '@/types/expense';
import { CATEGORIES } from '@/constants/categories';

interface ExpenseListProps {
  expenses: Expense[];
  onDelete: (id: string) => void;
}

export default function ExpenseList({ expenses, onDelete }: ExpenseListProps) {
  if (expenses.length === 0) {
    return <p className="text-center text-gray-500 py-10">Нет расходов</p>;
  }

  const sortedExpenses = [...expenses].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  const formatValue = (val: number) => 
    val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ") + " ₽";

  const formatDate = (dateStr: string) => {
    const [year, month, day] = dateStr.split('-');
    return `${day}.${month}.${year}`;
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b bg-gray-100">
            <th className="p-2">Дата</th>
            <th className="p-2">Категория</th>
            <th className="p-2">Описание</th>
            <th className="p-2 text-right">Сумма</th>
            <th className="p-2 text-center"></th>
          </tr>
        </thead>
        <tbody>
          {sortedExpenses.map(expense => (
            <tr key={expense.id} className="border-b hover:bg-gray-50">
              <td className="p-2 whitespace-nowrap">{formatDate(expense.date)}</td>
              <td className="p-2">
                {CATEGORIES.find(c => c.id === expense.category)?.name}
              </td>
              <td className="p-2">{expense.description}</td>
              <td className="p-2 text-right font-medium">{formatValue(expense.amount)}</td>
              <td className="p-2 text-center">
                <button 
                  onClick={() => onDelete(expense.id)}
                  className="text-red-500 hover:text-red-700 transition-colors"
                  title="Удалить"
                >
                  🗑️
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}