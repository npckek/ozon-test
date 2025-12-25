'use client';

import { Expense } from '@/types/expense';
import { CATEGORIES } from '@/constants/categories';

interface SummaryProps {
  expenses: Expense[];
}

export default function Summary({ expenses }: SummaryProps) {
  const total = expenses.reduce((sum, item) => sum + item.amount, 0);

  // Группировка по категориям
  const categoryTotals = CATEGORIES.map(cat => {
    const sum = expenses
      .filter(e => e.category === cat.id)
      .reduce((s, e) => s + e.amount, 0);
    return { name: cat.name, sum };
  }).filter(c => c.sum > 0);

  // Ручное форматирование по ТЗ: разделитель тысяч + ₽
  const formatValue = (val: number) => 
    val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ") + " ₽";

  return (
    <div className="p-4 border rounded-lg bg-gray-50 space-y-4">
      <h2 className="text-xl font-bold">
        Всего потрачено: {formatValue(total)}
      </h2>
      
      {categoryTotals.length > 0 && (
        <div>
          <p className="font-semibold">По категориям:</p>
          <ul className="list-disc list-inside">
            {categoryTotals.map(ct => (
              <li key={ct.name}>
                {ct.name}: {formatValue(ct.sum)}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}