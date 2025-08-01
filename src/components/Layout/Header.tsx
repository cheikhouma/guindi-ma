import React from 'react';
import { Menu, User, LogOut, GraduationCap } from 'lucide-react';
import { Home, Map, Search, Heart, BarChart3, MessageCircle } from 'lucide-react';
import { useNavigation } from '../../hooks/useNavigation';

interface HeaderProps {
  user: any;
  onLogout: () => void;
  onMenuClick: () => void;
  isAdmin: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  user,
  onLogout,
  onMenuClick,
  isAdmin
}) => {
  const { currentPath, goToHome, goToMap, goToSearch, goToFavorites, goToChat, goToAdmin, goToLogin } = useNavigation();

  const menuItems = [
    { id: 'home', label: 'Accueil', icon: Home, path: '/', action: goToHome },
    { id: 'map', label: 'Carte', icon: Map, path: '/map', action: goToMap },
    { id: 'search', label: 'Recherche', icon: Search, path: '/search', action: goToSearch },
    { id: 'chat', label: 'Assistant', icon: MessageCircle, path: '/chat', action: goToChat },
    ...(isAdmin ? [{ id: 'admin', label: 'Tableau de bord', icon: BarChart3, path: '/admin', action: goToAdmin }] : [])
  ];

  return (
    <header className="bg-white shadow-sm  border-b border-gray-200 sticky top-0 z-30">
      <div className="px-4 sm:px-6 lg:px-8 container mx-auto ">
        <div className="flex items-center justify-between h-16">
          {/* Logo + Menu Mobile */}
          <div className="flex items-center space-x-3">
            <button
              onClick={onMenuClick}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <Menu className="w-6 h-6 text-gray-600" />
            </button>
            
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-blue-600 rounded-lg">
                <GraduationCap className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-xl font-bold text-gray-900">Guindi Ma</h1>
            </div>
          </div>

          {/* Navigation Desktop - visible seulement sur desktop */}
          <nav className="hidden lg:flex items-center space-x-1">
            {menuItems.map((item) => {
              // const Icon = item.icon;
              const isActive = currentPath === item.path;
              
              return (
                <button
                  key={item.id}
                  onClick={item.action}
                  className={`
                    flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium
                    transition-all duration-200
                    ${isActive 
                      ? 'bg-blue-50 text-blue-700 border border-blue-200' 
                      : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                    }
                  `}
                >
                  {/* <Icon className={`w-4 h-4 ${isActive ? 'text-blue-600' : 'text-gray-500'}`} /> */}
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Actions utilisateur */}
          <div className="flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-3">
                <div className="hidden sm:block text-right">
                  <p className="text-sm font-medium text-gray-900">{user.name}</p>
                  <p className="text-xs text-gray-500">{user.email}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="bg-blue-100 text-blue-700 p-2 rounded-full">
                    <User className="w-4 h-4" />
                  </div>
                  <button
                    onClick={onLogout}
                    className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Se déconnecter"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={goToLogin}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
              >
                Connexion
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};