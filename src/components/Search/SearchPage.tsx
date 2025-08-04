import React, { useState } from 'react';
import { Search, Filter, SlidersHorizontal, Heart, Star } from 'lucide-react';
import { School, FilterState } from '../../types';
import { mockSchools, regions, schoolLevels } from '../../data/mockData';
import { SchoolCard } from '../School/SchoolCard';
import { useNavigation } from '../../hooks/useNavigation';
import { useAuth } from '../../hooks/useAuth';

export const SearchPage: React.FC = () => {
  const { user, toggleFavorite } = useAuth();
  const { goToSchoolDetail } = useNavigation();
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState<'name' | 'rating' | 'students'>('rating');
  const [activeTab, setActiveTab] = useState<'search' | 'favorites'>('search');
  const [filters, setFilters] = useState<FilterState>({
    type: [],
    region: [],
    level: [],
    minStudents: 0,
    maxStudents: 50000,
    minRating: 0
  });

  const filteredSchools = mockSchools.filter(school => {
    // Search query
    if (searchQuery && !school.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !school.address.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !school.region.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }

    // Filters
    if (filters.type.length > 0 && !filters.type.includes(school.type)) return false;
    if (filters.region.length > 0 && !filters.region.includes(school.region)) return false;
    if (filters.level.length > 0 && !school.level.some(level => filters.level.includes(level))) return false;
    if (school.students < filters.minStudents || school.students > filters.maxStudents) return false;
    if (school.rating < filters.minRating) return false;

    return true;
  }).sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return a.name.localeCompare(b.name);
      case 'rating':
        return b.rating - a.rating;
      case 'students':
        return b.students - a.students;
      default:
        return 0;
    }
  });

  const favoriteSchools = mockSchools.filter(school => 
    user?.favorites.includes(school.id)
  ).sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return a.name.localeCompare(b.name);
      case 'rating':
        return b.rating - a.rating;
      case 'students':
        return b.students - a.students;
      default:
        return 0;
    }
  });

  const handleFilterChange = (key: keyof FilterState, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const toggleArrayFilter = (key: 'type' | 'region' | 'level', value: string) => {
    setFilters(prev => ({
      ...prev,
      [key]: prev[key].includes(value)
        ? prev[key].filter(item => item !== value)
        : [...prev[key], value]
    }));
  };

  const handleSchoolSelect = (school: School) => {
    goToSchoolDetail(school);
  };

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-2">
        <div className="flex space-x-1">
          <button
            onClick={() => setActiveTab('search')}
            className={`flex-1 flex items-center justify-center space-x-2 px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
              activeTab === 'search'
                ? 'bg-blue-50 text-blue-700 border border-blue-200'
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
            }`}
          >
            <Search className="w-4 h-4" />
            <span>Recherche</span>
          </button>
          <button
            onClick={() => setActiveTab('favorites')}
            className={`flex-1 flex items-center justify-center space-x-2 px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
              activeTab === 'favorites'
                ? 'bg-red-50 text-red-700 border border-red-200'
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
            }`}
          >
            <Heart className="w-4 h-4" />
            <span>Favoris ({user?.favorites.length || 0})</span>
          </button>
        </div>
      </div>

      {/* Search and Filters Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          <div className="flex-1 lg:mr-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Rechercher un établissement, une ville, une région..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'name' | 'rating' | 'students')}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="rating">Trier par note</option>
              <option value="name">Trier par nom</option>
              <option value="students">Trier par effectif</option>
            </select>
            
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg border transition-colors ${
                showFilters 
                  ? 'bg-blue-50 text-blue-600 border-blue-200' 
                  : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50'
              }`}
            >
              <SlidersHorizontal className="w-4 h-4" />
              <span>Filtres</span>
            </button>
          </div>
        </div>

        {/* Results count */}
        <div className="mt-4 pt-4 border-t border-gray-200">
          <p className="text-sm text-gray-600">
            {activeTab === 'search' 
              ? `${filteredSchools.length} établissement${filteredSchools.length > 1 ? 's' : ''} trouvé${filteredSchools.length > 1 ? 's' : ''}`
              : `${favoriteSchools.length} favori${favoriteSchools.length > 1 ? 's' : ''} sauvegardé${favoriteSchools.length > 1 ? 's' : ''}`
            }
          </p>
        </div>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Type d'établissement */}
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Type d'établissement</h4>
              <div className="space-y-2">
                {schoolLevels.map(type => (
                  <label key={type.value} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={filters.type.includes(type.value)}
                      onChange={() => toggleArrayFilter('type', type.value)}
                      className="rounded text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">{type.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Niveaux */}
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Niveaux</h4>
              <div className="space-y-2">
                {schoolLevels.map(level => (
                  <label key={level.value} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={filters.level.includes(level.value)}
                      onChange={() => toggleArrayFilter('level', level.value)}
                      className="rounded text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">{level.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Région */}
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Région</h4>
              <div className="space-y-2 max-h-32 overflow-y-auto">
                {regions.slice(0, 6).map(region => (
                  <label key={region} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={filters.region.includes(region)}
                      onChange={() => toggleArrayFilter('region', region)}
                      className="rounded text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">{region}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Nombre d'étudiants */}
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Effectif</h4>
              <div className="space-y-3">
                <div>
                  <label className="text-sm text-gray-600">Minimum: {filters.minStudents}</label>
                  <input
                    type="range"
                    min="0"
                    max="10000"
                    step="100"
                    value={filters.minStudents}
                    onChange={(e) => handleFilterChange('minStudents', Number(e.target.value))}
                    className="w-full"
                  />
                </div>
              </div>
            </div>

            {/* Note minimum */}
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Note minimum</h4>
              <div>
                <label className="text-sm text-gray-600">
                  {filters.minRating.toFixed(1)} étoile{filters.minRating !== 1 ? 's' : ''}
                </label>
                <input
                  type="range"
                  min="0"
                  max="5"
                  step="0.1"
                  value={filters.minRating}
                  onChange={(e) => handleFilterChange('minRating', Number(e.target.value))}
                  className="w-full"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Results */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {(activeTab === 'search' ? filteredSchools : favoriteSchools).map(school => (
          <SchoolCard
            key={school.id}
            school={school}
            isFavorite={user?.favorites.includes(school.id) || false}
            onToggleFavorite={toggleFavorite}
            onSelect={handleSchoolSelect}
          />
        ))}
      </div>

      {activeTab === 'search' && filteredSchools.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <Search className="w-12 h-12 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun établissement trouvé</h3>
          <p className="text-gray-600">
            Essayez de modifier vos critères de recherche ou vos filtres.
          </p>
        </div>
      )}

      {activeTab === 'favorites' && favoriteSchools.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <Heart className="w-12 h-12 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun favori sauvegardé</h3>
          <p className="text-gray-600">
            Ajoutez des écoles à vos favoris pour les retrouver facilement ici.
          </p>
        </div>
      )}
    </div>
  );
};