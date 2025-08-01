import React from 'react';
import {
  BarChart3,
  Users,
  School,
  MapPin,
  TrendingUp,
  Download,
  PlusCircle,
  Edit3
} from 'lucide-react';
import { mockSchools, regions, schoolTypes } from '../../data/mockData';
import { useNavigation } from '../../hooks/useNavigation';

export const AdminDashboard: React.FC = () => {
  const { goToAddSchool, goToEditSchool } = useNavigation();
  
  const stats = {
    totalSchools: mockSchools.length,
    totalStudents: mockSchools.reduce((sum, s) => sum + s.students, 0),
    regions: new Set(mockSchools.map(s => s.region)).size,
    averageRating: mockSchools.reduce((sum, s) => sum + s.rating, 0) / mockSchools.length
  };

  const schoolsByRegion = regions.map(region => ({
    region,
    count: mockSchools.filter(s => s.region === region).length,
    students: mockSchools.filter(s => s.region === region).reduce((sum, s) => sum + s.students, 0)
  })).filter(item => item.count > 0);

  const schoolsByType = schoolTypes.map(type => ({
    ...type,
    count: mockSchools.filter(s => s.type === type.value).length,
    students: mockSchools.filter(s => s.type === type.value).reduce((sum, s) => sum + s.students, 0)
  }));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Tableau de bord administrateur</h1>
            <p className="text-gray-600">Vue d'ensemble du système éducatif sénégalais</p>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={goToAddSchool}
              className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Ajouter école</span>
            </button>

            <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              <Download className="w-4 h-4" />
              <span>Exporter</span>
            </button>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Établissements</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalSchools}</p>
              <p className="text-sm text-green-600 flex items-center mt-1">
                <TrendingUp className="w-4 h-4 mr-1" />
                +12% ce mois
              </p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <School className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Étudiants</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalStudents.toLocaleString()}</p>
              <p className="text-sm text-green-600 flex items-center mt-1">
                <TrendingUp className="w-4 h-4 mr-1" />
                +8% ce mois
              </p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <Users className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Régions Couvertes</p>
              <p className="text-2xl font-bold text-gray-900">{stats.regions}</p>
              <p className="text-sm text-blue-600 flex items-center mt-1">
                <MapPin className="w-4 h-4 mr-1" />
                Sur 14 régions
              </p>
            </div>
            <div className="p-3 bg-purple-100 rounded-lg">
              <MapPin className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Note Moyenne</p>
              <p className="text-2xl font-bold text-gray-900">{stats.averageRating.toFixed(1)}</p>
              <p className="text-sm text-yellow-600 flex items-center mt-1">
                <BarChart3 className="w-4 h-4 mr-1" />
                Satisfaction élevée
              </p>
            </div>
            <div className="p-3 bg-yellow-100 rounded-lg">
              <BarChart3 className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Schools by Region */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Répartition par région</h3>
          <div className="space-y-4">
            {schoolsByRegion.slice(0, 8).map((item) => (
              <div key={item.region} className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-gray-900">{item.region}</span>
                    <span className="text-sm text-gray-600">{item.count} établissements</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{ width: `${(item.count / Math.max(...schoolsByRegion.map(r => r.count))) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Schools by Type */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Répartition par type</h3>
          <div className="space-y-4">
            {schoolsByType.map((type) => (
              <div key={type.value} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`w-4 h-4 rounded-full ${type.color}`}></div>
                  <span className="text-sm font-medium text-gray-900">{type.label}</span>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-gray-900">{type.count}</p>
                  <p className="text-xs text-gray-600">{type.students.toLocaleString()} étudiants</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Schools Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Établissements récents</h3>
            <button className="text-blue-600 hover:text-blue-700 font-medium">
              Voir tout
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Établissement
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Niveau
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Région
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Étudiants
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Note
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {mockSchools.slice(0, 5).map((school) => (
                <tr key={school.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{school.name}</div>
                      <div className="text-sm text-gray-500">{school.address}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${school.type === 'private' ? 'bg-green-100 text-green-400' :
                      'bg-blue-200 text-blue-400'
                      }`}>
                      {
                        school.type === 'private' ? 'Privée' : 'Publique'
                      }
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${school.level === 'primary' ? 'bg-green-100 text-green-800' :
                      school.level === 'secondary' ? 'bg-blue-100 text-blue-800' :
                        school.level === 'high_school' ? 'bg-purple-100 text-purple-800' :
                          'bg-red-100 text-red-800'
                      }`}>
                      {
                        school.level === 'primary' ? 'Primaire' :
                          school.level === 'secondary' ? 'Collège' : 'Lycée'
                      }
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {school.region}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {school.students.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <span className="text-sm font-medium text-gray-900">{school.rating}</span>
                      <span className="text-yellow-400 ml-1">★</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button 
                      onClick={() => goToEditSchool(school.id)}
                      className="text-blue-600 hover:text-blue-900 mr-3"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};