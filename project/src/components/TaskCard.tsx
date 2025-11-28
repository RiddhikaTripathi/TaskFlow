import { Pencil, Trash2, Calendar, Flag } from 'lucide-react';
import type { TaskWithCategory } from '../types/database';

interface TaskCardProps {
  task: TaskWithCategory;
  onEdit: (task: TaskWithCategory) => void;
  onDelete: (id: string) => void;
  onStatusChange: (id: string, status: TaskWithCategory['status']) => void;
}

export function TaskCard({ task, onEdit, onDelete, onStatusChange }: TaskCardProps) {
  const statusColors = {
    todo: 'bg-gray-100 text-gray-800',
    in_progress: 'bg-blue-100 text-blue-800',
    completed: 'bg-green-100 text-green-800',
  };

  const statusLabels = {
    todo: 'To Do',
    in_progress: 'In Progress',
    completed: 'Completed',
  };

  const priorityColors = {
    low: 'text-gray-500',
    medium: 'text-yellow-500',
    high: 'text-red-500',
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return null;
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6">
      <div className="flex items-start justify-between mb-3">
        <h3 className="text-xl font-semibold text-gray-900 flex-1">{task.title}</h3>
        <div className="flex gap-2 ml-4">
          <button
            onClick={() => onEdit(task)}
            className="text-blue-600 hover:text-blue-800 transition-colors"
          >
            <Pencil size={18} />
          </button>
          <button
            onClick={() => onDelete(task.id)}
            className="text-red-600 hover:text-red-800 transition-colors"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>

      {task.description && (
        <p className="text-gray-600 mb-4">{task.description}</p>
      )}

      <div className="flex flex-wrap items-center gap-3 mb-4">
        <select
          value={task.status}
          onChange={(e) => onStatusChange(task.id, e.target.value as TaskWithCategory['status'])}
          className={`px-3 py-1 rounded-full text-sm font-medium ${statusColors[task.status]}`}
        >
          <option value="todo">{statusLabels.todo}</option>
          <option value="in_progress">{statusLabels.in_progress}</option>
          <option value="completed">{statusLabels.completed}</option>
        </select>

        <div className={`flex items-center gap-1 ${priorityColors[task.priority]}`}>
          <Flag size={16} />
          <span className="text-sm font-medium capitalize">{task.priority}</span>
        </div>

        {task.due_date && (
          <div className="flex items-center gap-1 text-gray-600">
            <Calendar size={16} />
            <span className="text-sm">{formatDate(task.due_date)}</span>
          </div>
        )}

        {task.categories && (
          <span
            className="px-3 py-1 rounded-full text-sm font-medium text-white"
            style={{ backgroundColor: task.categories.color }}
          >
            {task.categories.name}
          </span>
        )}
      </div>
    </div>
  );
}
