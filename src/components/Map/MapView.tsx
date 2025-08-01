import React, { useState } from 'react';
import { Filter, List, Navigation } from 'lucide-react';
import { School as SchoolType, FilterState } from '../../types';
import { mockSchools, regions, schoolTypes } from '../../data/mockData';
import { SchoolCard } from '../School/SchoolCard';
import { MapContainer, TileLayer, Marker, Popup, Tooltip } from 'react-leaflet';
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

const createColoredIcon = (colorClass: string) => {
  const colorMap: Record<string, string> = {
    'bg-red-500': '#ef4444',
    'bg-blue-500': '#3b82f6',
    'bg-green-500': '#10b981',
    'bg-yellow-500': '#eab308',

  };

  const color = colorMap[colorClass] || '#6b7280';

  return new L.DivIcon({
    className: 'custom-marker',
    html: `<div style="
      background-color: ${color}; 
      width: 20px; 
      height: 20px; 
      border-radius: 50%; 
      border: 3px solid white;
      box-shadow: 0 2px 4px rgba(0,0,0,0.3);
      display: flex;
      align-items: center;
      justify-content: center;
    "></div>`,
    iconSize: [20, 20],
    iconAnchor: [10, 10],
    popupAnchor: [0, -10]
  });
};

export const MapView: React.FC = () => {
  const { user, toggleFavorite } = useAuth();
  const { goToSchoolDetail } = useNavigation();
  const [showFilters, setShowFilters] = useState(false);
  const [showList, setShowList] = useState(false);
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
        <div className="w-80 bg-white border-r border-gray-200 p-4 overflow-y-auto">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Filtres</h3>
            <button
              onClick={() => setShowFilters(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          </div>

          <div className="space-y-6">
            {/* Type d'établissement */}
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Niveau d'établissement</h4>
              <div className="space-y-2">
                {schoolTypes.map(type => (
                  <label key={type.value} className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={filters.type.includes(type.value)}
                      onChange={() => toggleArrayFilter('type', type.value)}
                      className="rounded text-blue-600 focus:ring-blue-500"
                    />
                    <div className="flex items-center space-x-2">
                      <div className={`w-3 h-3 rounded-full ${type.color}`}></div>
                      <span className="text-sm text-gray-700">{type.label}</span>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Région */}
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Région</h4>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {regions.map(region => (
                  <label key={region} className="flex items-center space-x-3">
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
              <h4 className="font-medium text-gray-900 mb-3">Nombre d'étudiants</h4>
              <div className="space-y-3">
                <div>
                  <label className="text-sm text-gray-600">Minimum</label>
                  <input
                    type="range"
                    min="0"
                    max="10000"
                    step="50"
                    value={filters.minStudents}
                    onChange={(e) => handleFilterChange('minStudents', Number(e.target.value))}
                    className="w-full"
                  />
                  <span className="text-xs text-gray-500">{filters.minStudents}</span>
                </div>
                <div>
                  <label className="text-sm text-gray-600">Maximum</label>
                  <input
                    type="range"
                    min="0"
                    max="50000"
                    step="100"
                    value={filters.maxStudents}
                    onChange={(e) => handleFilterChange('maxStudents', Number(e.target.value))}
                    className="w-full"
                  />
                  <span className="text-xs text-gray-500">{filters.maxStudents}</span>
                </div>
              </div>
            </div>

            {/* Note minimum */}
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Note minimum</h4>
              <input
                type="range"
                min="0"
                max="5"
                step="0.1"
                value={filters.minRating}
                onChange={(e) => handleFilterChange('minRating', Number(e.target.value))}
                className="w-full"
              />
              <span className="text-xs text-gray-500">{filters.minRating.toFixed(1)} étoiles</span>
            </div>
          </div>
        </div>
      )}

      {/* School List Sidebar */}
      {showList && (
        <div className="w-96 bg-white border-r border-gray-200 overflow-y-auto">
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-semibold text-gray-900">
                Établissements ({filteredSchools.length})
              </h3>
              <button
                onClick={() => setShowList(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
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
              const schoolType = schoolTypes.find(t => t.value === school.level);
              const colorClass = schoolType?.color || 'bg-gray-500';
              console.log(`School: ${school.name}, Level: ${school.level}, Color: ${colorClass}`);
              
              return (
                <Marker
                  key={school.id}
                  position={[school.coordinates.lat, school.coordinates.lng]}
                  icon={createColoredIcon(colorClass)}
                  eventHandlers={{
                    click: () => handleSchoolSelect(school)
                  }}
                >
                  <Tooltip direction="top" offset={[0, -10]} opacity={1} permanent={false}>
                    <div style={{ fontSize: '0.75rem', lineHeight: '1rem' }}>
                      <strong>{school.name}</strong><br />
                      {school.students} élèves<br />
                      Note : {school.rating.toFixed(1)} ★
                    </div>
                  </Tooltip>

                  <Popup>
                    <div className="space-y-1 text-sm">
                      <strong className="text-base">{school.name}</strong><br />
                      <span>{school.address}</span><br />
                      <span>{school.region} • {school.level}</span><br />
                      <span>Élèves : {school.students}</span><br />
                      <span>Note : {school.rating.toFixed(1)} ★</span><br />
                      <span>Tel : {school.phone}</span>
                    </div>
                  </Popup>
                </Marker>
              );
            })}
          </MapContainer>
        </div>

        {/* Floating Controls */}
        <div className="absolute top-4 right-4 flex flex-col space-y-2 z-[1000]">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`p-3 bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow ${showFilters ? 'bg-blue-50 text-blue-600' : 'text-gray-600'}`}
            title="Filtres"
          >
            <Filter className="w-5 h-5" />
          </button>

          <button
            onClick={() => setShowList(!showList)}
            className={`p-3 bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow ${showList ? 'bg-blue-50 text-blue-600' : 'text-gray-600'}`}
            title="Liste"
          >
            <List className="w-5 h-5" />
          </button>

          <button
            className="p-3 bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow text-gray-600"
            title="Ma position"
          >
            <Navigation className="w-5 h-5" />
          </button>
        </div>

        {/* Legend */}
        <div className="absolute bottom-4 left-4 bg-white p-4 rounded-lg shadow-lg z-[1000]">
          <h4 className="font-medium text-gray-900 mb-2">Légende</h4>
          <div className="space-y-2">
            {schoolTypes.map(type => (
              <div key={type.value} className="flex items-center space-x-2">
                <div className={`w-4 h-4 rounded-full ${type.color}`}></div>
                <span className="text-sm text-gray-700">{type.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};