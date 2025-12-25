'use client';

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { Expense } from '@/types/expense';
import { CATEGORIES } from '@/constants/categories';

interface ExpenseChartProps {
  expenses: Expense[];
}

const COLORS = ['#3b82f6', '#22c55e', '#f97316', '#a855f7', '#ef4444'];

export default function ExpenseChart({ expenses }: ExpenseChartProps) {
  const data = CATEGORIES.map((cat) => {
    const sum = expenses
      .filter(e => e.category === cat.id)
      .reduce((acc, e) => acc + e.amount, 0);

    return { name: cat.name, value: sum };
  }).filter(item => item.value > 0);

  if (data.length === 0) {
    return (
      <p className="text-center text-gray-500">
        Нет данных для диаграммы
      </p>
    );
  }

  return (
    <div className="h-72 w-full">
      <ResponsiveContainer>
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            outerRadius={100}
            label
          >
            {data.map((_, index) => (
              <Cell
                key={index}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
          <Tooltip
            formatter={(value) => {
                if (typeof value !== 'number') return '0 ₽';
                return `${value.toLocaleString('ru-RU')} ₽`;
            }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
