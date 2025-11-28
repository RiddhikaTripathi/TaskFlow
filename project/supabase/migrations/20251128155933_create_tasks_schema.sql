/*
  # Task Management Schema

  ## Overview
  Creates a complete task management system with categories and tasks.

  ## New Tables
  
  ### `categories`
  - `id` (uuid, primary key) - Unique identifier for each category
  - `name` (text, unique) - Category name
  - `color` (text) - Color code for visual distinction
  - `description` (text, nullable) - Optional category description
  - `created_at` (timestamptz) - Timestamp of creation
  
  ### `tasks`
  - `id` (uuid, primary key) - Unique identifier for each task
  - `title` (text) - Task title
  - `description` (text, nullable) - Detailed task description
  - `status` (text) - Task status: 'todo', 'in_progress', 'completed'
  - `priority` (text) - Priority level: 'low', 'medium', 'high'
  - `category_id` (uuid, nullable) - Foreign key to categories
  - `due_date` (date, nullable) - Optional due date
  - `created_at` (timestamptz) - Timestamp of creation
  - `updated_at` (timestamptz) - Timestamp of last update

  ## Security
  
  ### Row Level Security (RLS)
  - Enable RLS on both tables
  - Public read access for all users
  - Public write access for all users (suitable for demo/prototyping)
  
  ## Indexes
  - Index on category_id for faster task queries by category
  - Index on status for filtering tasks by status
*/

-- Create categories table
CREATE TABLE IF NOT EXISTS categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  color text NOT NULL DEFAULT '#6366f1',
  description text,
  created_at timestamptz DEFAULT now()
);

-- Create tasks table
CREATE TABLE IF NOT EXISTS tasks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  status text NOT NULL DEFAULT 'todo' CHECK (status IN ('todo', 'in_progress', 'completed')),
  priority text NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
  category_id uuid REFERENCES categories(id) ON DELETE SET NULL,
  due_date date,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_tasks_category_id ON tasks(category_id);
CREATE INDEX IF NOT EXISTS idx_tasks_status ON tasks(status);
CREATE INDEX IF NOT EXISTS idx_tasks_priority ON tasks(priority);

-- Enable Row Level Security
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;

-- Categories policies
CREATE POLICY "Allow public read access to categories"
  ON categories FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow public insert access to categories"
  ON categories FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Allow public update access to categories"
  ON categories FOR UPDATE
  TO public
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow public delete access to categories"
  ON categories FOR DELETE
  TO public
  USING (true);

-- Tasks policies
CREATE POLICY "Allow public read access to tasks"
  ON tasks FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow public insert access to tasks"
  ON tasks FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Allow public update access to tasks"
  ON tasks FOR UPDATE
  TO public
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow public delete access to tasks"
  ON tasks FOR DELETE
  TO public
  USING (true);

-- Insert sample categories
INSERT INTO categories (name, color, description)
VALUES 
  ('Work', '#3b82f6', 'Work-related tasks'),
  ('Personal', '#10b981', 'Personal tasks and errands'),
  ('Learning', '#f59e0b', 'Educational and learning activities'),
  ('Health', '#ef4444', 'Health and fitness activities')
ON CONFLICT (name) DO NOTHING;

-- Insert sample tasks
INSERT INTO tasks (title, description, status, priority, category_id, due_date)
SELECT 
  'Complete project documentation',
  'Write comprehensive documentation for the new feature',
  'todo',
  'high',
  c.id,
  CURRENT_DATE + INTERVAL '7 days'
FROM categories c WHERE c.name = 'Work'
LIMIT 1;

INSERT INTO tasks (title, description, status, priority, category_id, due_date)
SELECT 
  'Grocery shopping',
  'Buy groceries for the week',
  'todo',
  'medium',
  c.id,
  CURRENT_DATE + INTERVAL '2 days'
FROM categories c WHERE c.name = 'Personal'
LIMIT 1;

INSERT INTO tasks (title, description, status, priority, category_id)
SELECT 
  'Learn React hooks',
  'Study advanced React hooks patterns',
  'in_progress',
  'medium',
  c.id
FROM categories c WHERE c.name = 'Learning'
LIMIT 1;