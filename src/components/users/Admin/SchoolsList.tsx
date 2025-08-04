import React, { useState,  useMemo } from 'react';
import {
  Search,
  Filter,
  Plus,
  Edit,
  Trash2,
  Eye,
  MoreHorizontal,
  School,
  MapPin,
  Users,
  Star,
  Globe,
  ChevronDown,
  ChevronUp,
  SortAsc,
  SortDesc,
  Download,
  FileText
} from 'lucide-react';
import { School as SchoolType } from '../../../types';
import { mockSchools, regions, schoolLevels, schoolTypes } from '../../../data/mockData';
import { useNavigation } from '../../../hooks/useNavigation';
import { AdminNav } from './AdminNav';

interface SortConfig {
  key: keyof SchoolType;
  direction: 'asc' | 'desc';
}

export const SchoolsList: React.FC = () => {
  const { goToAddSchool, goToEditSchool, goToSchoolDetail } = useNavigation();
  
  // États pour la gestion des données
  const [schools, setSchools] = useState<SchoolType[]>(mockSchools);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilters, setSelectedFilters] = useState({
    type: [] as string[],
    level: [] as string[],
    region: [] as string[]
  });
  const [sortConfig, setSortConfig] = useState<SortConfig>({ key: 'name', direction: 'asc' });
  const [showFilters, setShowFilters] = useState(false);
  const [selectedSchools, setSelectedSchools] = useState<string[]>([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [schoolToDelete, setSchoolToDelete] = useState<SchoolType | null>(null);

  // Fonction de tri
  const handleSort = (key: keyof SchoolType) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  // Fonction de filtrage
  const toggleFilter = (category: 'type' | 'level' | 'region', value: string) => {
    setSelectedFilters(prev => ({
      ...prev,
      [category]: prev[category].includes(value)
        ? prev[category].filter(item => item !== value)
        : [...prev[category], value]
    }));
  };

  // Fonction de suppression
  const handleDelete = (school: SchoolType) => {
    setSchoolToDelete(school);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    if (schoolToDelete) {
      setSchools(prev => prev.filter(s => s.id !== schoolToDelete.id));
      setShowDeleteModal(false);
      setSchoolToDelete(null);
    }
  };

  // Fonction de sélection multiple
  const toggleSchoolSelection = (schoolId: string) => {
    setSelectedSchools(prev =>
      prev.includes(schoolId)
        ? prev.filter(id => id !== schoolId)
        : [...prev, schoolId]
    );
  };

  const selectAllSchools = () => {
    setSelectedSchools(filteredSchools.map(s => s.id));
  };

  const deselectAllSchools = () => {
    setSelectedSchools([]);
  };

  // Fonctions d'export
  const exportToCSV = (data: SchoolType[]) => {
    const headers = ['Nom', 'Type', 'Niveau', 'Région', 'Adresse', 'Téléphone', 'Email', 'Étudiants', 'Note'];
    const csvContent = [
      headers.join(','),
      ...data.map(school => [
        `"${school.name}"`,
        `"${getTypeLabel(school.type)}"`,
        `"${school.level.map(level => getLevelLabel(level)).join(', ')}"`,
        `"${school.region}"`,
        `"${school.address}"`,
        `"${school.phone}"`,
        `"${school.email}"`,
        school.students,
        school.rating
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `ecoles_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportToTXT = (data: SchoolType[]) => {
    const content = data.map(school => 
      `École: ${school.name}
Type: ${getTypeLabel(school.type)}
Niveau: ${school.level.map(level => getLevelLabel(level)).join(', ')}
Région: ${school.region}
Adresse: ${school.address}
Téléphone: ${school.phone}
Email: ${school.email}
Étudiants: ${school.students}
Note: ${school.rating}/5
${'='.repeat(50)}`
    ).join('\n\n');

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `ecoles_${new Date().toISOString().split('T')[0]}.txt`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportSelectedSchools = () => {
    if (selectedSchools.length === 0) return;
    const selectedData = schools.filter(school => selectedSchools.includes(school.id));
    exportToCSV(selectedData);
  };

  const exportFilteredSchools = () => {
    exportToCSV(filteredSchools);
  };

  const exportAllSchools = () => {
    exportToCSV(schools);
  };

  // Écoles filtrées et triées
  const filteredSchools = useMemo(() => {
    let filtered = schools.filter(school => {
      const matchesSearch = school.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           school.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           school.region.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesType = selectedFilters.type.length === 0 || selectedFilters.type.includes(school.type);
      const matchesLevel = selectedFilters.level.length === 0 || school.level.some(level => selectedFilters.level.includes(level));
      const matchesRegion = selectedFilters.region.length === 0 || selectedFilters.region.includes(school.region);
      
      return matchesSearch && matchesType && matchesLevel && matchesRegion;
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
      
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortConfig.direction === 'asc' 
          ? aValue - bValue
          : bValue - aValue;
      }
      
      return 0;
    });

    return filtered;
  }, [schools, searchTerm, selectedFilters, sortConfig]);

  // Statistiques
  const stats = {
    total: schools.length,
    filtered: filteredSchools.length,
    selected: selectedSchools.length
  };

  const getTypeLabel = (type: string) => {
    return type === 'public' ? 'Publique' : 'Privée';
  };

  const getLevelLabel = (level: string) => {
    switch (level) {
      case 'primary': return 'Primaire';
      case 'secondary': return 'Collège';
      case 'high_school': return 'Lycée';
      default: return level;
    }
  };

  const getTypeColor = (type: string) => {
    return type === 'public' ? 'bg-orange-100 text-orange-800' : 'bg-blue-100 text-blue-800';
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'primary': return 'bg-yellow-100 text-yellow-800';
      case 'secondary': return 'bg-red-100 text-red-800';
      case 'high_school': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Navigation Admin */}
      <AdminNav />
      
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Gestion des Établissements</h1>
            <p className="text-gray-600">Gérez tous les établissements scolaires</p>
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
                    onClick={exportAllSchools}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
                  >
                    <FileText className="w-4 h-4" />
                    <span>Toutes les écoles</span>
                  </button>
                  <button
                    onClick={exportFilteredSchools}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
                  >
                    <Filter className="w-4 h-4" />
                    <span>Écoles filtrées</span>
                  </button>
                </div>
              </div>
            </div>
            <button
              onClick={goToAddSchool}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Ajouter école</span>
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
            <School className="w-8 h-8 text-blue-600" />
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
            <Users className="w-8 h-8 text-purple-600" />
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
                placeholder="Rechercher une école..."
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
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Type */}
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Type</h4>
              <div className="space-y-2">
                {schoolTypes.map(type => (
                  <label key={type.value} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={selectedFilters.type.includes(type.value)}
                      onChange={() => toggleFilter('type', type.value)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">{type.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Niveau */}
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Niveau</h4>
              <div className="space-y-2">
                {schoolLevels.map(level => (
                  <label key={level.value} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={selectedFilters.level.includes(level.value)}
                      onChange={() => toggleFilter('level', level.value)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">{level.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Région */}
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Région</h4>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {regions.map(region => (
                  <label key={region} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={selectedFilters.region.includes(region)}
                      onChange={() => toggleFilter('region', region)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">{region}</span>
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
                {stats.selected} école(s) sélectionnée(s)
              </span>
              <button
                onClick={deselectAllSchools}
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                Désélectionner tout
              </button>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={exportSelectedSchools}
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

      {/* Tableau des écoles */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={selectedSchools.length === filteredSchools.length && filteredSchools.length > 0}
                    onChange={selectedSchools.length === filteredSchools.length ? deselectAllSchools : selectAllSchools}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                </th>
                <th className="px-6 py-3 text-left">
                  <button
                    onClick={() => handleSort('name')}
                    className="flex items-center space-x-1 font-medium text-gray-900 hover:text-gray-700"
                  >
                    <span>École</span>
                    {sortConfig.key === 'name' && (
                      sortConfig.direction === 'asc' ? <SortAsc className="w-4 h-4" /> : <SortDesc className="w-4 h-4" />
                    )}
                  </button>
                </th>
                <th className="px-6 py-3 text-left">
                  <button
                    onClick={() => handleSort('type')}
                    className="flex items-center space-x-1 font-medium text-gray-900 hover:text-gray-700"
                  >
                    <span>Type</span>
                    {sortConfig.key === 'type' && (
                      sortConfig.direction === 'asc' ? <SortAsc className="w-4 h-4" /> : <SortDesc className="w-4 h-4" />
                    )}
                  </button>
                </th>
                <th className="px-6 py-3 text-left">
                  <button
                    onClick={() => handleSort('level')}
                    className="flex items-center space-x-1 font-medium text-gray-900 hover:text-gray-700"
                  >
                    <span>Niveau</span>
                    {sortConfig.key === 'level' && (
                      sortConfig.direction === 'asc' ? <SortAsc className="w-4 h-4" /> : <SortDesc className="w-4 h-4" />
                    )}
                  </button>
                </th>
                <th className="px-6 py-3 text-left">
                  <button
                    onClick={() => handleSort('region')}
                    className="flex items-center space-x-1 font-medium text-gray-900 hover:text-gray-700"
                  >
                    <span>Région</span>
                    {sortConfig.key === 'region' && (
                      sortConfig.direction === 'asc' ? <SortAsc className="w-4 h-4" /> : <SortDesc className="w-4 h-4" />
                    )}
                  </button>
                </th>
                <th className="px-6 py-3 text-left">
                  <button
                    onClick={() => handleSort('students')}
                    className="flex items-center space-x-1 font-medium text-gray-900 hover:text-gray-700"
                  >
                    <span>Étudiants</span>
                    {sortConfig.key === 'students' && (
                      sortConfig.direction === 'asc' ? <SortAsc className="w-4 h-4" /> : <SortDesc className="w-4 h-4" />
                    )}
                  </button>
                </th>
                <th className="px-6 py-3 text-left">
                  <button
                    onClick={() => handleSort('rating')}
                    className="flex items-center space-x-1 font-medium text-gray-900 hover:text-gray-700"
                  >
                    <span>Note</span>
                    {sortConfig.key === 'rating' && (
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
              {filteredSchools.map((school) => (
                <tr key={school.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <input
                      type="checkbox"
                      checked={selectedSchools.includes(school.id)}
                      onChange={() => toggleSchoolSelection(school.id)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <School className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">{school.name}</div>
                        <div className="text-sm text-gray-500 flex items-center">
                          <MapPin className="w-3 h-3 mr-1" />
                          {school.address}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getTypeColor(school.type)}`}>
                      {getTypeLabel(school.type)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getLevelColor(school.level[0])}`}>
                      {school.level.map(level => getLevelLabel(level)).join(', ')}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center text-sm text-gray-900">
                      <Globe className="w-4 h-4 mr-1" />
                      {school.region}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center text-sm text-gray-900">
                      <Users className="w-4 h-4 mr-1" />
                      {school.students.toLocaleString()}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <Star className="w-4 h-4 text-yellow-400 fill-current mr-1" />
                      <span className="text-sm font-medium text-gray-900">{school.rating}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => goToSchoolDetail(school)}
                        className="p-1 text-blue-600 hover:text-blue-800 transition-colors"
                        title="Voir les détails"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => goToEditSchool(school.id)}
                        className="p-1 text-green-600 hover:text-green-800 transition-colors"
                        title="Modifier"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(school)}
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
      {showDeleteModal && schoolToDelete && (
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
              Êtes-vous sûr de vouloir supprimer l'établissement <strong>{schoolToDelete.name}</strong> ?
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