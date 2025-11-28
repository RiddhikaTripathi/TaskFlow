import { useState, useEffect } from 'react';
import { Plus, Filter } from 'lucide-react';
import { TaskCard } from '../components/TaskCard';
import { TaskForm } from '../components/TaskForm';
import { Modal } from '../components/Modal';
import { Button } from '../components/Button';
import { taskService } from '../services/taskService';
import { categoryService } from '../services/categoryService';
import type { Task, TaskWithCategory, Category } from '../types/database';

export function TasksPage() {
  const [tasks, setTasks] = useState<TaskWithCategory[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | undefined>(undefined);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [tasksData, categoriesData] = await Promise.all([
        taskService.getAll(),
        categoryService.getAll(),
      ]);
      setTasks(tasksData);
      setCategories(categoriesData);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTask = async (data: Partial<Task>) => {
    try {
      await taskService.create(data as Omit<Task, 'id' | 'created_at' | 'updated_at'>);
      await loadData();
      setIsModalOpen(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create task');
    }
  };

  const handleUpdateTask = async (data: Partial<Task>) => {
    if (!editingTask) return;

    try {
      await taskService.update(editingTask.id, data);
      await loadData();
      setIsModalOpen(false);
      setEditingTask(undefined);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update task');
    }
  };

  const handleDeleteTask = async (id: string) => {
    if (!confirm('Are you sure you want to delete this task?')) return;

    try {
      await taskService.delete(id);
      await loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete task');
    }
  };

  const handleStatusChange = async (id: string, status: Task['status']) => {
    try {
      await taskService.updateStatus(id, status);
      await loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update status');
    }
  };

  const openCreateModal = () => {
    setEditingTask(undefined);
    setIsModalOpen(true);
  };

  const openEditModal = (task: TaskWithCategory) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingTask(undefined);
  };

  const filteredTasks = tasks.filter((task) => {
    const statusMatch = filterStatus === 'all' || task.status === filterStatus;
    const categoryMatch = filterCategory === 'all' || task.category_id === filterCategory;
    return statusMatch && categoryMatch;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">My Tasks</h1>
          <p className="text-gray-600">Organize and track your tasks efficiently</p>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        <div className="mb-6 flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
          <div className="flex flex-wrap gap-3">
            <div className="flex items-center gap-2">
              <Filter size={20} className="text-gray-600" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Status</option>
                <option value="todo">To Do</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>

            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Categories</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <Button onClick={openCreateModal} className="flex items-center gap-2">
            <Plus size={20} />
            New Task
          </Button>
        </div>

        {filteredTasks.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-lg shadow-md">
            <p className="text-gray-500 text-lg">No tasks found. Create your first task!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onEdit={openEditModal}
                onDelete={handleDeleteTask}
                onStatusChange={handleStatusChange}
              />
            ))}
          </div>
        )}

        <Modal
          isOpen={isModalOpen}
          onClose={closeModal}
          title={editingTask ? 'Edit Task' : 'Create New Task'}
        >
          <TaskForm
            task={editingTask}
            categories={categories}
            onSubmit={editingTask ? handleUpdateTask : handleCreateTask}
            onCancel={closeModal}
          />
        </Modal>
      </div>
    </div>
  );
}
