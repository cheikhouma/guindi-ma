import React, { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  Plus,
  Edit,
  Trash2,
  MoreHorizontal,
  User,
  Mail,
  Phone,
  Shield,
  ChevronDown,
  ChevronUp,
  SortAsc,
  SortDesc,
  Download,
  FileText
} from 'lucide-react';
import { User as UserType } from '../../../types';
import { mockUsers } from '../../../data/mockData';
import { useNavigation } from '../../../hooks/useNavigation';
import { AdminNav } from './AdminNav';
import {  useNavigate } from 'react-router-dom';

interface SortConfig {
  key: keyof UserType;
  direction: 'asc' | 'desc';
}

export const UsersList: React.FC = () => {
  const { goToAddUser } = useNavigation();
  // const { user } = useAuth();
  
  const navigate = useNavigate();

  // États pour la gestion des données
  const [users, setUsers] = useState<UserType[]>(mockUsers);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilters, setSelectedFilters] = useState({
    role: [] as string[],
    status: [] as string[]
  });
  const [sortConfig, setSortConfig] = useState<SortConfig>({ key: 'name', direction: 'asc' });
  const [showFilters, setShowFilters] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState<UserType | null>(null);

  // Fonction de tri
  const handleSort = (key: keyof UserType) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  // Fonction de filtrage
  const toggleFilter = (category: 'role' | 'status', value: string) => {
    setSelectedFilters(prev => ({
      ...prev,
      [category]: prev[category].includes(value)
        ? prev[category].filter(item => item !== value)
        : [...prev[category], value]
    }));
  };

  // Fonction de suppression
  const handleDelete = (user: UserType) => {
    setUserToDelete(user);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    if (userToDelete) {
      setUsers(prev => prev.filter(u => u.id !== userToDelete.id));
      setShowDeleteModal(false);
      setUserToDelete(null);
    }
  };

  // Fonction de sélection multiple
  const toggleUserSelection = (userId: string) => {
    setSelectedUsers(prev =>
      prev.includes(userId)
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const selectAllUsers = () => {
    setSelectedUsers(filteredUsers.map(u => u.id));
  };

  const deselectAllUsers = () => {
    setSelectedUsers([]);
  };

  // Fonctions d'export
  const exportToCSV = (data: UserType[]) => {
    const headers = ['Nom', 'Email', 'Téléphone', 'Rôle', 'Statut', 'Date d\'inscription'];
    const csvContent = [
      headers.join(','),
      ...data.map(user => [
        `"${user.name}"`,
        `"${user.email}"`,
        `"${user.phone || ''}"`,
        `"${getRoleLabel(user.role)}"`,
        `"${getStatusLabel(user.status)}"`,
        `"${new Date(user.createdAt).toLocaleDateString()}"`
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `utilisateurs_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportSelectedUsers = () => {
    if (selectedUsers.length === 0) return;
    const selectedData = users.filter(user => selectedUsers.includes(user.id));
    exportToCSV(selectedData);
  };

  const exportFilteredUsers = () => {
    exportToCSV(filteredUsers);
  };

  const exportAllUsers = () => {
    exportToCSV(users);
  };

  // Utilisateurs filtrés et triés
  const filteredUsers = useMemo(() => {
    let filtered = users.filter(user => {
      const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           user.email.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesRole = selectedFilters.role.length === 0 || selectedFilters.role.includes(user.role);
      const matchesStatus = selectedFilters.status.length === 0 || selectedFilters.status.includes(user.status);
      
      return matchesSearch && matchesRole && matchesStatus;
    });

    // Tri
    filtered.sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];
      
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortConfig.direction === 'asc' 
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }
      
      return 0;
    });

    return filtered;
  }, [users, searchTerm, selectedFilters, sortConfig]);

  // Statistiques
  const stats = {
    total: users.length,
    filtered: filteredUsers.length,
    selected: selectedUsers.length
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'admin': return 'Administrateur';
      case 'user': return 'Utilisateur';
      default: return role;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'active': return 'Actif';
      case 'inactive': return 'Inactif';
      case 'pending': return 'En attente';
      default: return status;
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-red-100 text-red-800';
      case 'user': return 'bg-blue-100 text-blue-800';
      case 'representant': return 'bg-purple-100 text-purple-800';
      case 'ministere': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const roleOptions = [
    { value: 'admin', label: 'Administrateur' },
    { value: 'user', label: 'Utilisateur' },
    { value: 'representant', label: 'Représentant' },
    { value: 'ministere', label: 'Ministère' }
  ];

  const statusOptions = [
    { value: 'active', label: 'Actif' },
    { value: 'inactive', label: 'Inactif' },
    { value: 'pending', label: 'En attente' }
  ];

  return (
    <div className="space-y-6">
      {/* Navigation Admin */}
      <AdminNav />
      
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Gestion des Utilisateurs</h1>
            <p className="text-gray-600">Gérez tous les utilisateurs de la plateforme</p>
          </div>
          
          <div className="flex items-center space-x-3">
            <div className="relative group">
              <button className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                <Download className="w-4 h-4" />
                <span>Exporter</span>
              </button>
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
                <div className="py-1">
                  <button
                    onClick={exportAllUsers}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
                  >
                    <FileText className="w-4 h-4" />
                    <span>Tous les utilisateurs</span>
                  </button>
                  <button
                    onClick={exportFilteredUsers}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
                  >
                    <Filter className="w-4 h-4" />
                    <span>Utilisateurs filtrés</span>
                  </button>
                </div>
              </div>
            </div>
            <button
              onClick={goToAddUser}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Ajouter utilisateur</span>
            </button>
          </div>
        </div>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
            <User className="w-8 h-8 text-blue-600" />
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Affichés</p>
              <p className="text-2xl font-bold text-gray-900">{stats.filtered}</p>
            </div>
            <Filter className="w-8 h-8 text-green-600" />
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Sélectionnés</p>
              <p className="text-2xl font-bold text-gray-900">{stats.selected}</p>
            </div>
            <Shield className="w-8 h-8 text-purple-600" />
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Actions</p>
              <p className="text-2xl font-bold text-gray-900">
                {stats.selected > 0 ? `${stats.selected}` : '0'}
              </p>
            </div>
            <MoreHorizontal className="w-8 h-8 text-orange-600" />
          </div>
        </div>
      </div>

      {/* Filtres et Recherche */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Recherche */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Rechercher un utilisateur..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          
          {/* Bouton Filtres */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Filter className="w-4 h-4" />
            <span>Filtres</span>
            {showFilters ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>

        {/* Panneau de filtres */}
        {showFilters && (
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Rôle */}
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Rôle</h4>
              <div className="space-y-2">
                {roleOptions.map(role => (
                  <label key={role.value} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={selectedFilters.role.includes(role.value)}
                      onChange={() => toggleFilter('role', role.value)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">{role.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Statut */}
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Statut</h4>
              <div className="space-y-2">
                {statusOptions.map(status => (
                  <label key={status.value} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={selectedFilters.status.includes(status.value)}
                      onChange={() => toggleFilter('status', status.value)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">{status.label}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Actions en lot */}
      {stats.selected > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <span className="text-sm font-medium text-blue-900">
                {stats.selected} utilisateur(s) sélectionné(s)
              </span>
              <button
                onClick={deselectAllUsers}
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                Désélectionner tout
              </button>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={exportSelectedUsers}
                className="px-3 py-1 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-1"
              >
                <Download className="w-3 h-3" />
                <span>Exporter ({stats.selected})</span>
              </button>
              <button className="px-3 py-1 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
                Supprimer ({stats.selected})
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tableau des utilisateurs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={selectedUsers.length === filteredUsers.length && filteredUsers.length > 0}
                    onChange={selectedUsers.length === filteredUsers.length ? deselectAllUsers : selectAllUsers}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                </th>
                <th className="px-6 py-3 text-left">
                  <button
                    onClick={() => handleSort('name')}
                    className="flex items-center space-x-1 font-medium text-gray-900 hover:text-gray-700"
                  >
                    <span>Utilisateur</span>
                    {sortConfig.key === 'name' && (
                      sortConfig.direction === 'asc' ? <SortAsc className="w-4 h-4" /> : <SortDesc className="w-4 h-4" />
                    )}
                  </button>
                </th>
                <th className="px-6 py-3 text-left">
                  <button
                    onClick={() => handleSort('email')}
                    className="flex items-center space-x-1 font-medium text-gray-900 hover:text-gray-700"
                  >
                    <span>Email</span>
                    {sortConfig.key === 'email' && (
                      sortConfig.direction === 'asc' ? <SortAsc className="w-4 h-4" /> : <SortDesc className="w-4 h-4" />
                    )}
                  </button>
                </th>
                <th className="px-6 py-3 text-left">
                  <button
                    onClick={() => handleSort('role')}
                    className="flex items-center space-x-1 font-medium text-gray-900 hover:text-gray-700"
                  >
                    <span>Rôle</span>
                    {sortConfig.key === 'role' && (
                      sortConfig.direction === 'asc' ? <SortAsc className="w-4 h-4" /> : <SortDesc className="w-4 h-4" />
                    )}
                  </button>
                </th>
                <th className="px-6 py-3 text-left">
                  <button
                    onClick={() => handleSort('status')}
                    className="flex items-center space-x-1 font-medium text-gray-900 hover:text-gray-700"
                  >
                    <span>Statut</span>
                    {sortConfig.key === 'status' && (
                      sortConfig.direction === 'asc' ? <SortAsc className="w-4 h-4" /> : <SortDesc className="w-4 h-4" />
                    )}
                  </button>
                </th>
                <th className="px-6 py-3 text-left">
                  <span className="font-medium text-gray-900">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <input
                      type="checkbox"
                      checked={selectedUsers.includes(user.id)}
                      onChange={() => toggleUserSelection(user.id)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <User className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">{user.name}</div>
                        <div className="text-sm text-gray-500 flex items-center">
                          <Phone className="w-3 h-3 mr-1" />
                          {user.phone || 'Non renseigné'}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center text-sm text-gray-900">
                      <Mail className="w-4 h-4 mr-1" />
                      {user.email}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getRoleColor(user.role)}`}>
                      {getRoleLabel(user.role)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(user.status)}`}>
                      {getStatusLabel(user.status)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => navigate('/under-construction')}
                        className="p-1 text-green-600 hover:text-green-800 transition-colors"
                        title="Modifier"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(user)}
                        className="p-1 text-red-600 hover:text-red-800 transition-colors"
                        title="Supprimer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal de confirmation de suppression */}
      {showDeleteModal && userToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                <Trash2 className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Confirmer la suppression</h3>
                <p className="text-sm text-gray-600">Cette action est irréversible</p>
              </div>
            </div>
            
            <p className="text-gray-700 mb-6">
              Êtes-vous sûr de vouloir supprimer l'utilisateur <strong>{userToDelete.name}</strong> ?
            </p>
            
            <div className="flex space-x-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={confirmDelete}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}; 