import React, { useState, useRef } from 'react';
import { 
  Filter, 
  List, 
  Navigation, 
  MapPin, 
  Users, 
  Star, 
  Phone, 
  Mail, 
  ExternalLink,
  X,
  Search,
  Eye,
  Heart,
  GraduationCap,
  Building,
  Globe
} from 'lucide-react';
import { School as SchoolType, FilterState } from '../../types';
import { mockSchools, regions, schoolLevels } from '../../data/mockData';
import { SchoolCard } from '../School/SchoolCard';
import { MapContainer, TileLayer, Marker, Popup, Tooltip, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useNavigation } from '../../hooks/useNavigation';
import { useAuth } from '../../hooks/useAuth';

// Fix icône par défaut Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png'
});

const createColoredIcon = (colorClass: string, isHovered: boolean = false) => {
  const colorMap: Record<string, string> = {
    'bg-red-500': '#ef4444',
    'bg-blue-500': '#3b82f6',
    'bg-green-500': '#10b981',
    'bg-yellow-500': '#eab308',
  };

  const color = colorMap[colorClass] || '#6b7280';
  const size = isHovered ? 28 : 24;
  const borderWidth = isHovered ? 4 : 3;

  return new L.DivIcon({
    className: 'custom-marker',
    html: `<div style="
      background-color: ${color}; 
      width: ${size}px; 
      height: ${size}px; 
      border-radius: 50%; 
      border: ${borderWidth}px solid white;
      box-shadow: 0 ${isHovered ? '4px 8px' : '2px 4px'} rgba(0,0,0,${isHovered ? '0.4' : '0.3'});
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s ease;
      cursor: pointer;
    "></div>`,
    iconSize: [size, size],
    iconAnchor: [size/2, size/2],
    popupAnchor: [0, -size/2]
  });
};

// Composant pour les tooltips personnalisés
const CustomTooltip: React.FC<{ school: SchoolType }> = ({ school }) => {
  const { goToSchoolDetail } = useNavigation();
  
  const getLevelLabel = (level: string) => {
    switch (level) {
      case 'primary': return 'Primaire';
      case 'secondary': return 'Collège';
      case 'high_school': return 'Lycée';
      default: return level;
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-2xl border border-gray-200 p-4 max-w-xs">
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h3 className="font-bold text-gray-900 text-sm leading-tight mb-1">
            {school.name}
          </h3>
          <div className="flex items-center space-x-2 text-xs text-gray-600">
            <MapPin className="w-3 h-3" />
            <span>{school.region}</span>
          </div>
        </div>
        <div className="flex items-center space-x-1 bg-yellow-50 px-2 py-1 rounded-full">
          <Star className="w-3 h-3 text-yellow-600 fill-current" />
          <span className="text-xs font-bold text-yellow-800">{school.rating}</span>
        </div>
      </div>

      {/* Info */}
      <div className="space-y-2 mb-3">
        <div className="flex items-center justify-between text-xs">
          <span className="text-gray-600">Type:</span>
          <span className="font-medium text-gray-900">{getLevelLabel(school.level)}</span>
        </div>
        <div className="flex items-center justify-between text-xs">
          <span className="text-gray-600">Élèves:</span>
          <span className="font-medium text-gray-900">{school.students.toLocaleString()}</span>
        </div>
        <div className="flex items-center justify-between text-xs">
          <span className="text-gray-600">Statut:</span>
          <span className={`font-medium px-2 py-1 rounded-full text-xs ${
            school.type === 'private' 
              ? 'bg-green-100 text-green-800' 
              : 'bg-blue-100 text-blue-800'
          }`}>
            {school.type === 'private' ? 'Privé' : 'Public'}
          </span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex space-x-2">
        <button
          onClick={() => goToSchoolDetail(school)}
          className="flex-1 bg-blue-600 text-white text-xs px-3 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-1"
        >
          <Eye className="w-3 h-3" />
          <span>Voir détails</span>
        </button>
        {school.phone && (
          <a
            href={`tel:${school.phone}`}
            className="bg-green-600 text-white text-xs px-3 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center"
            title="Appeler"
          >
            <Phone className="w-3 h-3" />
          </a>
        )}
      </div>
    </div>
  );
};

// Composant pour les popups personnalisés
const CustomPopup: React.FC<{ school: SchoolType }> = ({ school }) => {
  const { goToSchoolDetail } = useNavigation();
  const { user, toggleFavorite } = useAuth();
  
  const getLevelLabel = (level: string) => {
    switch (level) {
      case 'primary': return 'Primaire';
      case 'secondary': return 'Collège';
      case 'high_school': return 'Lycée';
      default: return level;
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-xl border border-gray-200 p-6 max-w-sm">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="font-bold text-gray-900 text-lg leading-tight mb-2">
            {school.name}
          </h3>
          <div className="flex items-center space-x-2 text-sm text-gray-600 mb-1">
            <MapPin className="w-4 h-4" />
            <span>{school.address}</span>
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Globe className="w-4 h-4" />
            <span>{school.region}</span>
          </div>
        </div>
        <button
          onClick={() => toggleFavorite(school.id)}
          className={`p-2 rounded-full transition-colors ${
            user?.favorites.includes(school.id)
              ? 'bg-red-100 text-red-600 hover:bg-red-200'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          <Heart className={`w-5 h-5 ${user?.favorites.includes(school.id) ? 'fill-current' : ''}`} />
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="bg-blue-50 p-3 rounded-lg">
          <div className="flex items-center space-x-2 mb-1">
            <Users className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-medium text-blue-900">Élèves</span>
          </div>
          <span className="text-lg font-bold text-blue-900">{school.students.toLocaleString()}</span>
        </div>
        <div className="bg-yellow-50 p-3 rounded-lg">
          <div className="flex items-center space-x-2 mb-1">
            <Star className="w-4 h-4 text-yellow-600" />
            <span className="text-sm font-medium text-yellow-900">Note</span>
          </div>
          <span className="text-lg font-bold text-yellow-900">{school.rating}</span>
        </div>
      </div>

      {/* Info */}
      <div className="space-y-2 mb-4">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Niveau:</span>
          <span className="text-sm font-medium text-gray-900">{getLevelLabel(school.level)}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Statut:</span>
          <span className={`font-medium px-3 py-1 rounded-full text-sm ${
            school.type === 'private' 
              ? 'bg-green-100 text-green-800' 
              : 'bg-blue-100 text-blue-800'
          }`}>
            {school.type === 'private' ? 'Privé' : 'Public'}
          </span>
        </div>
        {school.phone && (
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Téléphone:</span>
            <a href={`tel:${school.phone}`} className="text-sm font-medium text-blue-600 hover:text-blue-800">
              {school.phone}
            </a>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex space-x-3">
        <button
          onClick={() => goToSchoolDetail(school)}
          className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
        >
          <Eye className="w-4 h-4" />
          <span>Voir détails</span>
        </button>
        {school.phone && (
          <a
            href={`tel:${school.phone}`}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center"
            title="Appeler"
          >
            <Phone className="w-4 h-4" />
          </a>
        )}
      </div>
    </div>
  );
};

export const MapView: React.FC = () => {
  const { user, toggleFavorite } = useAuth();
  const { goToSchoolDetail } = useNavigation();
  const [showFilters, setShowFilters] = useState(false);
  const [showList, setShowList] = useState(false);
  const [hoveredSchool, setHoveredSchool] = useState<string | null>(null);
  const [filters, setFilters] = useState<FilterState>({
    type: [],
    region: [],
    minStudents: 0,
    maxStudents: 10000,
    minRating: 0
  });

  const filteredSchools = mockSchools.filter(school => {
    if (filters.type.length > 0 && !filters.type.includes(school.level)) return false;
    if (filters.region.length > 0 && !filters.region.includes(school.region)) return false;
    if (school.students < filters.minStudents || school.students > filters.maxStudents) return false;
    if (school.rating < filters.minRating) return false;
    return true;
  });

  const handleFilterChange = (key: keyof FilterState, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const toggleArrayFilter = (key: 'type' | 'region', value: string) => {
    setFilters(prev => ({
      ...prev,
      [key]: prev[key].includes(value)
        ? prev[key].filter(item => item !== value)
        : [...prev[key], value]
    }));
  };

  const handleSchoolSelect = (school: SchoolType) => {
    goToSchoolDetail(school);
  };

  return (
    <div className="h-[calc(100vh-4rem)] flex">
      {/* Filters Sidebar */}
      {showFilters && (
        <div className="w-80 bg-white border-r border-gray-200 p-6 overflow-y-auto shadow-xl">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-900 flex items-center">
              <Filter className="w-5 h-5 mr-2 text-blue-600" />
              Filtres
            </h3>
            <button
              onClick={() => setShowFilters(false)}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-8">
            {/* Type d'établissement */}
            <div>
              <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
                <GraduationCap className="w-4 h-4 mr-2 text-blue-600" />
                Niveau d'établissement
              </h4>
              <div className="space-y-3">
                {schoolLevels.map(type => (
                  <label key={type.value} className="flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.type.includes(type.value)}
                      onChange={() => toggleArrayFilter('type', type.value)}
                      className="rounded text-blue-600 focus:ring-blue-500"
                    />
                    <div className="flex items-center space-x-3">
                      <div className={`w-4 h-4 rounded-full ${type.color}`}></div>
                      <span className="text-sm font-medium text-gray-700">{type.label}</span>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Région */}
            <div>
              <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
                <Globe className="w-4 h-4 mr-2 text-green-600" />
                Région
              </h4>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {regions.map(region => (
                  <label key={region} className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer">
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
              <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
                <Users className="w-4 h-4 mr-2 text-purple-600" />
                Nombre d'étudiants
              </h4>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Minimum: {filters.minStudents.toLocaleString()}</label>
                  <input
                    type="range"
                    min="0"
                    max="10000"
                    step="50"
                    value={filters.minStudents}
                    onChange={(e) => handleFilterChange('minStudents', Number(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Maximum: {filters.maxStudents.toLocaleString()}</label>
                  <input
                    type="range"
                    min="0"
                    max="50000"
                    step="100"
                    value={filters.maxStudents}
                    onChange={(e) => handleFilterChange('maxStudents', Number(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                  />
                </div>
              </div>
            </div>

            {/* Note minimum */}
            <div>
              <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
                <Star className="w-4 h-4 mr-2 text-yellow-600" />
                Note minimum
              </h4>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  {filters.minRating.toFixed(1)} étoile{filters.minRating !== 1 ? 's' : ''}
                </label>
                <input
                  type="range"
                  min="0"
                  max="5"
                  step="0.1"
                  value={filters.minRating}
                  onChange={(e) => handleFilterChange('minRating', Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* School List Sidebar */}
      {showList && (
        <div className="w-96 bg-white border-r border-gray-200 overflow-y-auto shadow-xl">
          <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-900 flex items-center">
                <List className="w-5 h-5 mr-2 text-blue-600" />
                Établissements ({filteredSchools.length})
              </h3>
              <button
                onClick={() => setShowList(false)}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-sm text-gray-600">
              Cliquez sur une école pour voir ses détails
            </p>
          </div>

          <div className="p-4 space-y-4">
            {filteredSchools.map(school => (
              <SchoolCard
                key={school.id}
                school={school}
                isFavorite={user?.favorites.includes(school.id) || false}
                onToggleFavorite={toggleFavorite}
                onSelect={handleSchoolSelect}
                compact
              />
            ))}
          </div>
        </div>
      )}

      {/* Map Container */}
      <div className="flex-1 relative">
        <div className="h-full w-full">
          <MapContainer
            center={[14.4974, -14.4524]}
            zoom={7}
            scrollWheelZoom={true}
            style={{ height: '100%', width: '100%' }}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            {filteredSchools.map((school) => {
              const schoolType = schoolLevels.find(t => t.value === school.level);
              const colorClass = schoolType?.color || 'bg-gray-500';
              const isHovered = hoveredSchool === school.id;
              
              return (
                <Marker
                  key={school.id}
                  position={[school.coordinates.lat, school.coordinates.lng]}
                  icon={createColoredIcon(colorClass, isHovered)}
                  eventHandlers={{
                    click: () => handleSchoolSelect(school),
                    mouseover: () => setHoveredSchool(school.id),
                    mouseout: () => setHoveredSchool(null)
                  }}
                >
                  <Tooltip 
                    direction="top" 
                    offset={[0, -15]} 
                    opacity={1} 
                    permanent={false}
                    className="custom-tooltip"
                  >
                    <CustomTooltip school={school} />
                  </Tooltip>

                  <Popup className="custom-popup">
                    <CustomPopup school={school} />
                  </Popup>
                </Marker>
              );
            })}
          </MapContainer>
        </div>

        {/* Floating Controls */}
        <div className="absolute top-6 right-6 flex flex-col space-y-3 z-[1000]">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`p-4 bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 ${
              showFilters ? 'bg-blue-50 text-blue-600 ring-2 ring-blue-200' : 'text-gray-600 hover:bg-gray-50'
            }`}
            title="Filtres"
          >
            <Filter className="w-6 h-6" />
          </button>

          <button
            onClick={() => setShowList(!showList)}
            className={`p-4 bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 ${
              showList ? 'bg-blue-50 text-blue-600 ring-2 ring-blue-200' : 'text-gray-600 hover:bg-gray-50'
            }`}
            title="Liste des écoles"
          >
            <List className="w-6 h-6" />
          </button>

          <button
            className="p-4 bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 text-gray-600 hover:bg-gray-50"
            title="Ma position"
          >
            <Navigation className="w-6 h-6" />
          </button>
        </div>

        {/* Legend */}
        <div className="absolute bottom-6 left-6 bg-white p-6 rounded-xl shadow-lg z-[1000] border border-gray-200">
          <h4 className="font-bold text-gray-900 mb-4 flex items-center">
            <MapPin className="w-5 h-5 mr-2 text-blue-600" />
            Légende
          </h4>
          <div className="space-y-3">
            {schoolLevels.map(type => (
              <div key={type.value} className="flex items-center space-x-3">
                <div className={`w-5 h-5 rounded-full ${type.color} shadow-md`}></div>
                <span className="text-sm font-medium text-gray-700">{type.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Stats Card */}
        <div className="absolute top-6 left-6 bg-white p-6 rounded-xl shadow-lg z-[1000] border border-gray-200">
          <h4 className="font-bold text-gray-900 mb-3 flex items-center">
            <Building className="w-5 h-5 mr-2 text-green-600" />
            Statistiques
          </h4>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Écoles visibles:</span>
              <span className="text-sm font-bold text-gray-900">{filteredSchools.length}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Total:</span>
              <span className="text-sm font-bold text-gray-900">{mockSchools.length}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};