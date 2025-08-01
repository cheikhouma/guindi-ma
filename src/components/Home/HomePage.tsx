import React from 'react';
import { MapPin, School, Users, Star, ArrowRight } from 'lucide-react';
import { mockSchools } from '../../data/mockData';
import { useNavigation } from '../../hooks/useNavigation';

export const HomePage: React.FC = () => {
  const { goToMap, goToSearch, goToChat } = useNavigation();

  const stats = {
    totalSchools: mockSchools.length,
    regions: new Set(mockSchools.map(s => s.region)).size,
    totalStudents: mockSchools.reduce((sum, s) => sum + s.students, 0),
    averageRating: mockSchools.reduce((sum, s) => sum + s.rating, 0) / mockSchools.length
  };

  const featuredSchools = mockSchools
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 3);

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-green-600 rounded-2xl p-8 text-white">
        <div className="max-w-4xl">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            Découvrez les meilleurs établissements scolaires au Sénégal
          </h1>
          <p className="text-lg mb-6 opacity-90">
            Explorez, comparez et trouvez l'école parfaite pour votre enfant grâce à notre plateforme interactive.
          </p>
          <div className="flex flex-wrap gap-4">
            <button
              onClick={goToMap}
              className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors flex items-center space-x-2"
            >
              <MapPin className="w-5 h-5" />
              <span>Voir la carte</span>
            </button>
            <button
              onClick={goToSearch}
              className="border border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors flex items-center space-x-2"
            >
              <School className="w-5 h-5" />
              <span>Rechercher</span>
            </button>
          </div>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-blue-100 rounded-lg">
              <School className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats.totalSchools}</p>
              <p className="text-sm text-gray-600">Établissements</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-green-100 rounded-lg">
              <MapPin className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats.regions}</p>
              <p className="text-sm text-gray-600">Régions</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-purple-100 rounded-lg">
              <Users className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats.totalStudents.toLocaleString()}</p>
              <p className="text-sm text-gray-600">Étudiants</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-yellow-100 rounded-lg">
              <Star className="w-6 h-6 text-yellow-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats.averageRating.toFixed(1)}</p>
              <p className="text-sm text-gray-600">Note moyenne</p>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Schools */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Établissements recommandés</h2>
          <button
            onClick={goToSearch}
            className="text-blue-600 hover:text-blue-700 font-medium flex items-center space-x-1"
          >
            <span>Voir tout</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredSchools.map((school) => (
            <div key={school.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">{school.name}</h3>
                  <p className="text-sm text-gray-600">{school.address}</p>
                </div>
                <div className="flex items-center space-x-1 bg-yellow-50 px-2 py-1 rounded">
                  <Star className="w-4 h-4 text-yellow-600 fill-current" />
                  <span className="text-sm font-medium text-yellow-800">{school.rating}</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                  {school.level === 'primary' ? 'Primaire' :
                   school.level === 'secondary' ? 'Collège' : 'Lycée' }
                </span>
                <span className="text-sm text-gray-600">{school.students} élèves</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-xl p-6 border border-gray-200">
          <h3 className="text-xl font-bold text-gray-900 mb-3">Besoin d'aide ?</h3>
          <p className="text-gray-600 mb-4">
            Notre assistant intelligent peut vous aider à trouver l'établissement parfait.
          </p>
          <button
            onClick={goToChat}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Parler à l'assistant
          </button>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 border border-gray-200">
          <h3 className="text-xl font-bold text-gray-900 mb-3">Comparer les écoles</h3>
          <p className="text-gray-600 mb-4">
            Comparez facilement les établissements selon vos critères.
          </p>
          <button
            onClick={goToSearch}
            className="bg-purple-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-purple-700 transition-colors"
          >
            Commencer la comparaison
          </button>
        </div>
      </div>
    </div>
  );
};