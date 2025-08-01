import React from 'react';
import { Home, Map, Search, Heart, BarChart3, MessageCircle, X } from 'lucide-react';
import { useNavigation } from '../../hooks/useNavigation';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  isAdmin: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  onClose,
  isAdmin
}) => {
  const { currentPath, goToHome, goToMap, goToSearch, goToFavorites, goToChat, goToAdmin } = useNavigation();

  const menuItems = [
    { id: 'home', label: 'Accueil', icon: Home, path: '/', action: goToHome },
    { id: 'map', label: 'Carte', icon: Map, path: '/map', action: goToMap },
    { id: 'search', label: 'Recherche', icon: Search, path: '/search', action: goToSearch },
    { id: 'favorites', label: 'Favoris', icon: Heart, path: '/favorites', action: goToFavorites },
    { id: 'chat', label: 'Assistant', icon: MessageCircle, path: '/chat', action: goToChat },
    ...(isAdmin ? [{ id: 'admin', label: 'Tableau de bord', icon: BarChart3, path: '/admin', action: goToAdmin }] : [])
  ];

  const handleItemClick = (action: () => void) => {
    action();
    onClose(); // Fermer le sidebar sur mobile après navigation
  };

  return (
    <>
      {/* Mobile backdrop - visible uniquement sur mobile */}
      <div className={`
        lg:hidden fixed inset-0 bg-black transition-opacity duration-300 z-40
        ${isOpen ? 'bg-opacity-50' : 'bg-opacity-0 pointer-events-none'}
      `} onClick={onClose} />

      {/* Sidebar - toujours visible sur desktop */}
      <aside className={`
        fixed top-0 left-0 h-full w-64 bg-white shadow-xl z-50 transition-transform duration-300
        lg:static lg:shadow-lg lg:z-auto lg:translate-x-0
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* Header mobile */}
        <div className="lg:hidden flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Menu</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-2 h-full overflow-y-auto">
          {menuItems.map((item) => {
            // const Icon = item.icon;
            const isActive = currentPath === item.path;

            return (
              <button
                key={item.id}
                onClick={() => handleItemClick(item.action)}
                className={`
                  w-full flex items-center space-x-3 px-4 py-3 rounded-lg 
                  transition-all duration-200 text-left group
                  ${isActive
                    ? 'bg-blue-50 text-blue-700 border border-blue-200'
                    : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                  }
                `}
              >
                {/* <Icon className={`w-5 h-5 ${isActive ? 'text-blue-600' : 'text-gray-500 group-hover:text-gray-700'}`} /> */}
                <span className="font-medium">{item.label}</span>
              </button>
            );
          })}
        </nav>
      </aside>
    </>
  );
};