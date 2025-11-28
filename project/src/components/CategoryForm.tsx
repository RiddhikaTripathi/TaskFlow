import { useState, useEffect } from 'react';
import { Input } from './Input';
import { Button } from './Button';
import type { Category } from '../types/database';

interface CategoryFormProps {
  category?: Category;
  onSubmit: (data: Partial<Category>) => void;
  onCancel: () => void;
}

const colorOptions = [
  { value: '#3b82f6', label: 'Blue' },
  { value: '#10b981', label: 'Green' },
  { value: '#f59e0b', label: 'Orange' },
  { value: '#ef4444', label: 'Red' },
  { value: '#8b5cf6', label: 'Purple' },
  { value: '#ec4899', label: 'Pink' },
  { value: '#14b8a6', label: 'Teal' },
  { value: '#f97316', label: 'Amber' },
];

export function CategoryForm({ category, onSubmit, onCancel }: CategoryFormProps) {
  const [formData, setFormData] = useState({
    name: category?.name || '',
    color: category?.color || '#3b82f6',
    description: category?.description || '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (category) {
      setFormData({
        name: category.name,
        color: category.color,
        description: category.description || '',
      });
    }
  }, [category]);

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    onSubmit({
      name: formData.name.trim(),
      color: formData.color,
      description: formData.description.trim() || null,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Name"
        value={formData.name}
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        error={errors.name}
        required
      />

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Color
        </label>
        <div className="grid grid-cols-4 gap-3">
          {colorOptions.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => setFormData({ ...formData, color: option.value })}
              className={`h-12 rounded-lg border-2 transition-all ${
                formData.color === option.value
                  ? 'border-gray-900 scale-105'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              style={{ backgroundColor: option.value }}
              title={option.label}
            />
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Description
        </label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          rows={3}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      <div className="flex gap-3 justify-end pt-4">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" variant="primary">
          {category ? 'Update' : 'Create'} Category
        </Button>
      </div>
    </form>
  );
}
