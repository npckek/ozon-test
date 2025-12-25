'use client';

import React, { useState, useRef, useEffect } from 'react';
import { CATEGORIES, CategoryId } from '@/constants/categories';
import { Expense } from '@/types/expense';

interface ExpenseFormProps {
  onAdd: (expense: Omit<Expense, 'id' | 'createdAt'>) => void;
  onUpdate: (expense: Expense) => void;
  editingExpense: Expense | null;
  onCancelEdit: () => void;
}

export default function ExpenseForm({ onAdd, onUpdate, editingExpense, onCancelEdit }: ExpenseFormProps) {
  const amountRef = useRef<HTMLInputElement>(null);
  
  const [formData, setFormData] = useState({
    amount: '',
    category: '' as CategoryId | '',
    description: '',
    date: ''
  });

  const [touched, setTouched] = useState({
    amount: false,
    category: false,
    description: false,
    date: false
  });

  const today = new Date().toISOString().split('T')[0];
  
  const errors = {
    amount: !formData.amount ? "Введите сумму" : Number(formData.amount) <= 0 ? "Сумма должна быть больше 0" : "",
    category: !formData.category ? "Выберите категорию" : "",
    description: !formData.description ? "Введите описание" : formData.description.length < 3 ? "Минимум 3 символа" : "",
    date: !formData.date ? "Выберите дату" : formData.date > today ? "Дата не может быть в будущем" : ""
  };

  const isFormValid = !errors.amount && !errors.category && !errors.description && !errors.date;

  useEffect(() => {
  if (editingExpense) {
    setFormData({
      amount: editingExpense.amount.toString(),
      category: editingExpense.category,
      description: editingExpense.description,
      date: editingExpense.date,
    });
    setTouched({
      amount: false,
      category: false,
      description: false,
      date: false,
    });
  }
  }, [editingExpense]);

  const resetForm = () => {
  setFormData({ amount: '', category: '', description: '', date: '' });
  setTouched({ amount: false, category: false, description: false, date: false });
  amountRef.current?.focus();
};




  const handleSubmit = (e: React.FormEvent) => {
  e.preventDefault();
  if (!isFormValid) return;

  if (editingExpense) {
    onUpdate({
      ...editingExpense,
      amount: Number(formData.amount),
      category: formData.category as CategoryId,
      description: formData.description,
      date: formData.date,
    });
  } else {
    onAdd({
      amount: Number(formData.amount),
      category: formData.category as CategoryId,
      description: formData.description,
      date: formData.date,
    });
  }

  resetForm();
};


  const handleBlur = (field: keyof typeof touched) => {
    setTouched(prev => ({ ...prev, [field]: true }));
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 border rounded-lg bg-white shadow-sm space-y-4">
      <div>
        <label className="block text-sm font-medium">Сумма</label>
        <input
          ref={amountRef}
          type="number"
          value={formData.amount}
          onChange={e => setFormData({ ...formData, amount: e.target.value })}
          onBlur={() => handleBlur('amount')}
          placeholder="Введите сумму"
          className="w-full p-2 border rounded"
        />
        {touched.amount && errors.amount && <p className="text-red-500 text-xs mt-1">{errors.amount}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium">Категория</label>
        <select
          value={formData.category}
          onChange={e => setFormData({ ...formData, category: e.target.value as CategoryId })}
          onBlur={() => handleBlur('category')}
          className="w-full p-2 border rounded"
        >
          <option value="">Выберите категорию</option>
          {CATEGORIES.map(cat => (
            <option key={cat.id} value={cat.id}>{cat.name}</option>
          ))}
        </select>
        {touched.category && errors.category && <p className="text-red-500 text-xs mt-1">{errors.category}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium">Описание</label>
        <input
          type="text"
          value={formData.description}
          onChange={e => setFormData({ ...formData, description: e.target.value })}
          onBlur={() => handleBlur('description')}
          placeholder="На что потратили?"
          className="w-full p-2 border rounded"
        />
        {touched.description && errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium">Дата</label>
        <input
          type="date"
          value={formData.date}
          onChange={e => setFormData({ ...formData, date: e.target.value })}
          onBlur={() => handleBlur('date')}
          className="w-full p-2 border rounded"
        />
        {touched.date && errors.date && <p className="text-red-500 text-xs mt-1">{errors.date}</p>}
      </div>

      <button
        type="submit"
        disabled={!isFormValid}
        className="w-full bg-blue-500 text-white p-2 rounded disabled:bg-gray-300 transition-colors"
      >
        <h2 className="text-lg font-bold">
            {editingExpense ? 'Редактировать трату' : 'Добавить трату'}
        </h2>
      </button>
      {editingExpense && (
        <button
            type="button"
            onClick={() => {
            resetForm();
            onCancelEdit();
            }}
            className="w-full border p-2 rounded"
        >
            Отменить редактирование
        </button>
      )}
    </form>
  );
}