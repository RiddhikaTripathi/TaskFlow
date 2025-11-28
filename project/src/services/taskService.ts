import { supabase } from '../lib/supabase';
import type { Task, TaskWithCategory } from '../types/database';

export const taskService = {
  async getAll(): Promise<TaskWithCategory[]> {
    const { data, error } = await supabase
      .from('tasks')
      .select('*, categories(*)')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  async getById(id: string): Promise<TaskWithCategory | null> {
    const { data, error } = await supabase
      .from('tasks')
      .select('*, categories(*)')
      .eq('id', id)
      .maybeSingle();

    if (error) throw error;
    return data;
  },

  async getByStatus(status: Task['status']): Promise<TaskWithCategory[]> {
    const { data, error } = await supabase
      .from('tasks')
      .select('*, categories(*)')
      .eq('status', status)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  async getByCategory(categoryId: string): Promise<TaskWithCategory[]> {
    const { data, error } = await supabase
      .from('tasks')
      .select('*, categories(*)')
      .eq('category_id', categoryId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  async create(task: Omit<Task, 'id' | 'created_at' | 'updated_at'>): Promise<Task> {
    const { data, error } = await supabase
      .from('tasks')
      .insert(task)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async update(id: string, task: Partial<Omit<Task, 'id' | 'created_at' | 'updated_at'>>): Promise<Task> {
    const { data, error } = await supabase
      .from('tasks')
      .update({ ...task, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('tasks')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },

  async updateStatus(id: string, status: Task['status']): Promise<Task> {
    return this.update(id, { status });
  },
};
