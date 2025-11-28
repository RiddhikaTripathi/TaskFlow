import { CheckSquare, FolderKanban } from 'lucide-react';

interface NavigationProps {
  currentPage: 'tasks' | 'categories';
  onNavigate: (page: 'tasks' | 'categories') => void;
}

export function Navigation({ currentPage, onNavigate }: NavigationProps) {
  const navItems = [
    { id: 'tasks' as const, label: 'Tasks', icon: CheckSquare },
    { id: 'categories' as const, label: 'Categories', icon: FolderKanban },
  ];

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <CheckSquare size={32} className="text-blue-600" />
            <span className="text-2xl font-bold text-gray-900">TaskFlow</span>
          </div>

          <div className="flex gap-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentPage === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                    isActive
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Icon size={20} />
                  {item.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
}
