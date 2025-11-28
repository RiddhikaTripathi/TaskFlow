import { useState } from 'react';
import { Navigation } from './components/Navigation';
import { TasksPage } from './pages/TasksPage';
import { CategoriesPage } from './pages/CategoriesPage';

function App() {
  const [currentPage, setCurrentPage] = useState<'tasks' | 'categories'>('tasks');

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation currentPage={currentPage} onNavigate={setCurrentPage} />
      {currentPage === 'tasks' ? <TasksPage /> : <CategoriesPage />}
    </div>
  );
}

export default App;
