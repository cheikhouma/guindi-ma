import React from 'react';
import { useLocation } from 'react-router-dom';
import { useNavigation } from '../../../hooks/useNavigation';
import {
  BarChart3,
  School,
  PlusCircle,
  Users,
  Home
} from 'lucide-react';

interface NavItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  path: string;
  action: () => void;
}

export const AdminNav: React.FC = () => {
  const location = useLocation();
  const { goToAdmin, goToSchoolsList, goToAddSchoolAdmin, goToUsersList } = useNavigation();

  const navItems: NavItem[] = [
    {
      id: 'dashboard',
      label: 'Tableau de bord',
      icon: <BarChart3 className="w-4 h-4" />,
      path: '/admin',
      action: goToAdmin
    },
    {
      id: 'schools',
      label: 'Établissements',
      icon: <School className="w-4 h-4" />,
      path: '/admin/schools',
      action: goToSchoolsList
    },
    {
      id: 'add-school',
      label: 'Ajouter école',
      icon: <PlusCircle className="w-4 h-4" />,
      path: '/admin/add-school-admin',
      action: goToAddSchoolAdmin
    },
    {
      id: 'users',
      label: 'Utilisateurs',
      icon: <Users className="w-4 h-4" />,
      path: '/admin/users',
      action: goToUsersList
    }
  ];

  const isActive = (path: string) => {
    if (path === '/admin') {
      return location.pathname === '/admin';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
            <Home className="w-4 h-4 text-blue-600" />
          </div>
          <h2 className="text-lg font-semibold text-gray-900">Administration</h2>
        </div>
      </div>
      
      <nav className="flex flex-wrap gap-2">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={item.action}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              isActive(item.path)
                ? 'bg-blue-100 text-blue-700 border border-blue-200'
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 border border-transparent'
            }`}
          >
            {item.icon}
            <span>{item.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}; 