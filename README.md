# TaskFlow - Full-Stack Task Management Application

A modern, responsive task management application built with React, TypeScript, Tailwind CSS, and Supabase. Features a complete CRUD API, database integration, and a beautiful user interface.

## Features

- **Task Management**: Create, read, update, and delete tasks
- **Categories**: Organize tasks with custom color-coded categories
- **Status Tracking**: Track tasks through todo, in-progress, and completed states
- **Priority Levels**: Assign low, medium, or high priority to tasks
- **Filtering**: Filter tasks by status and category
- **Responsive Design**: Beautiful UI that works on all devices
- **Real-time Database**: Powered by Supabase PostgreSQL database
- **Type Safety**: Full TypeScript support throughout the application

## Tech Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS
- **Backend**: Supabase (PostgreSQL + REST API)
- **Icons**: Lucide React
- **Build Tool**: Vite
- **State Management**: React Hooks

## Project Structure

```
project/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Select.tsx
│   │   ├── Modal.tsx
│   │   ├── Navigation.tsx
│   │   ├── TaskCard.tsx
│   │   ├── TaskForm.tsx
│   │   └── CategoryForm.tsx
│   ├── pages/              # Application pages
│   │   ├── TasksPage.tsx
│   │   └── CategoriesPage.tsx
│   ├── services/           # API service layer
│   │   ├── taskService.ts
│   │   └── categoryService.ts
│   ├── lib/                # Configuration
│   │   └── supabase.ts
│   ├── types/              # TypeScript types
│   │   └── database.ts
│   ├── App.tsx             # Main application component
│   ├── main.tsx            # Application entry point
│   └── index.css           # Global styles
├── .env                    # Environment variables
└── package.json
```

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- A Supabase account and project

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd project
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**

   Copy the example environment file and update it with your Supabase credentials:
   ```bash
   cp .env.example .env
   ```
   Then fill your values inside .env:
   ```env
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Database Setup**

   The database schema has been automatically created with:
   - `categories` table for organizing tasks
   - `tasks` table for managing tasks
   - Row Level Security (RLS) policies
   - Sample data for testing

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Build for production**
   ```bash
   npm run build
   ```

7. **Preview production build**
   ```bash
   npm run preview
   ```

## Database Schema

### Categories Table

| Column      | Type      | Description                          |
|-------------|-----------|--------------------------------------|
| id          | uuid      | Primary key                          |
| name        | text      | Category name (unique)               |
| color       | text      | Hex color code for visual distinction|
| description | text      | Optional category description        |
| created_at  | timestamp | Timestamp of creation                |

### Tasks Table

| Column      | Type      | Description                          |
|-------------|-----------|--------------------------------------|
| id          | uuid      | Primary key                          |
| title       | text      | Task title                           |
| description | text      | Detailed task description (optional) |
| status      | text      | todo, in_progress, or completed      |
| priority    | text      | low, medium, or high                 |
| category_id | uuid      | Foreign key to categories (optional) |
| due_date    | date      | Optional due date                    |
| created_at  | timestamp | Timestamp of creation                |
| updated_at  | timestamp | Timestamp of last update             |

## API Documentation

The application uses Supabase's auto-generated REST API. All services are located in `src/services/`.

### Task Service (`taskService.ts`)

#### Get All Tasks
```typescript
const tasks = await taskService.getAll();
// Returns: TaskWithCategory[]
```

#### Get Task by ID
```typescript
const task = await taskService.getById(taskId);
// Returns: TaskWithCategory | null
```

#### Get Tasks by Status
```typescript
const tasks = await taskService.getByStatus('todo');
// Returns: TaskWithCategory[]
// Status options: 'todo' | 'in_progress' | 'completed'
```

#### Get Tasks by Category
```typescript
const tasks = await taskService.getByCategory(categoryId);
// Returns: TaskWithCategory[]
```

#### Create Task
```typescript
const newTask = await taskService.create({
  title: 'New Task',
  description: 'Task description',
  status: 'todo',
  priority: 'medium',
  category_id: 'category-uuid',
  due_date: '2024-12-31'
});
// Returns: Task
```

#### Update Task
```typescript
const updatedTask = await taskService.update(taskId, {
  title: 'Updated Title',
  status: 'in_progress'
});
// Returns: Task
```

#### Update Task Status
```typescript
const updatedTask = await taskService.updateStatus(taskId, 'completed');
// Returns: Task
```

#### Delete Task
```typescript
await taskService.delete(taskId);
// Returns: void
```

### Category Service (`categoryService.ts`)

#### Get All Categories
```typescript
const categories = await categoryService.getAll();
// Returns: Category[]
```

#### Get Category by ID
```typescript
const category = await categoryService.getById(categoryId);
// Returns: Category | null
```

#### Create Category
```typescript
const newCategory = await categoryService.create({
  name: 'Work',
  color: '#3b82f6',
  description: 'Work-related tasks'
});
// Returns: Category
```

#### Update Category
```typescript
const updatedCategory = await categoryService.update(categoryId, {
  name: 'Updated Name',
  color: '#10b981'
});
// Returns: Category
```

#### Delete Category
```typescript
await categoryService.delete(categoryId);
// Returns: void
```

## Type Definitions

### Task
```typescript
interface Task {
  id: string;
  title: string;
  description: string | null;
  status: 'todo' | 'in_progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
  category_id: string | null;
  due_date: string | null;
  created_at: string;
  updated_at: string;
}
```

### Category
```typescript
interface Category {
  id: string;
  name: string;
  color: string;
  description: string | null;
  created_at: string;
}
```

### TaskWithCategory
```typescript
interface TaskWithCategory extends Task {
  categories: Category | null;
}
```

## UI Components

### Button
Reusable button component with variants (primary, secondary, danger, success) and sizes (sm, md, lg).

### Input
Form input component with label and error message support.

### Select
Dropdown select component with label and error message support.

### Modal
Modal dialog component for forms and overlays.

### TaskCard
Card component displaying task information with inline status updates and action buttons.

### TaskForm
Form component for creating and editing tasks with validation.

### CategoryForm
Form component for creating and editing categories.

### Navigation
Top navigation bar with page switching.

## Error Handling

All API calls include proper error handling:
- Network errors are caught and displayed to users
- Form validation prevents invalid data submission
- User-friendly error messages for all operations
- Confirmation dialogs for destructive actions

## Security

- Row Level Security (RLS) enabled on all tables
- Public access policies (suitable for demo/prototyping)
- Environment variables for sensitive configuration
- Type-safe database queries

## Development Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linting
npm run lint

# Type checking
npm run typecheck
```
## Assumptions
- Single-user access (no authentication required)
- Public CRUD access for demo purposes
- Supabase policies configured for prototype usage

## Bonus Features
- Smooth animations with Tailwind transitions
- Color-coded category tags
- Real-time optimistic UI updates
- Responsive mobile-first design

## Screenshots
<img width="1310" height="741" alt="file_2025-11-28_16 59 28" src="https://github.com/user-attachments/assets/e7de3db3-dfff-4a59-ac11-63078154e067" />
<img width="1312" height="734" alt="file_2025-11-28_17 00 18" src="https://github.com/user-attachments/assets/423bcd06-417a-4206-9a16-e55bf99d22c9" />
<img width="958" height="796" alt="file_2025-11-28_17 01 37" src="https://github.com/user-attachments/assets/d38b7b33-3bfe-4b9d-9582-6d031355b7f0" />


# Author
Riddhika Tripathi
