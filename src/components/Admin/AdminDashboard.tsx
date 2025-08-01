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
import { mockSchools, regions, schoolLevels, schoolTypes } from '../../data/mockData';
import { useNavigation } from '../../hooks/useNavigation';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  DoughnutController
} from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';
import ChartDataLabels from 'chartjs-plugin-datalabels';

// Enregistrer les composants Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  DoughnutController,
  ChartDataLabels
);

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

    const schoolsByLevel = schoolLevels.map(type => ({
      ...type,
      count: mockSchools.filter(s => s.level === type.value).length,
      students: mockSchools.filter(s => s.level === type.value).reduce((sum, s) => sum + s.students, 0)
    }));

    const schoolsByType = schoolTypes.map(type => ({
      ...type,
      count: mockSchools.filter(s => s.type === type.value).length,
      students: mockSchools.filter(s => s.type === type.value).reduce((sum, s) => sum + s.students, 0)
    }));

  // Configuration des graphiques
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: 'white',
        bodyColor: 'white',
        borderColor: 'rgba(255, 255, 255, 0.1)',
        borderWidth: 1,
        cornerRadius: 8,
        displayColors: false,
        callbacks: {
          label: function(context: any) {
            return `${context.label}: ${context.parsed} établissements`;
          }
        }
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
        },
        ticks: {
          color: '#6B7280',
          font: {
            size: 12
          }
        }
      },
      x: {
        grid: {
          display: false
        },
        ticks: {
          color: '#6B7280',
          font: {
            size: 11
          }
        }
      }
    }
  };

  // Configuration spécifique pour les donuts
  const donutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: 'white',
        bodyColor: 'white',
        borderColor: 'rgba(255, 255, 255, 0.1)',
        borderWidth: 1,
        cornerRadius: 8,
        displayColors: false,
        callbacks: {
          label: function(context: any) {
            const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
            const percentage = ((context.parsed / total) * 100).toFixed(1);
            return `${context.label}: ${context.parsed} établissements (${percentage}%)`;
          }
        }
      },
      datalabels: {
        color: '#ffffff',
        font: {
          weight: 'bold' as const,
          size: 14
        },
        formatter: function(value: number, context: any) {
          const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
          const percentage = ((value / total) * 100).toFixed(1);
          return percentage + '%';
        },
        display: function(context: any) {
          const value = context.parsed;
          const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
          const percentage = (value / total) * 100;
          return percentage > 5; // Afficher seulement si > 5%
        }
      }
    },
  };

  // Données pour le graphique par région
  const regionChartData = {
    labels: schoolsByRegion.slice(0, 8).map(item => item.region),
    datasets: [
      {
        data: schoolsByRegion.slice(0, 8).map(item => item.count),
        backgroundColor: [
          'rgba(59, 130, 246, 0.8)',
          'rgba(16, 185, 129, 0.8)',
          'rgba(245, 158, 11, 0.8)',
          'rgba(239, 68, 68, 0.8)',
          'rgba(139, 92, 246, 0.8)',
          'rgba(236, 72, 153, 0.8)',
          'rgba(14, 165, 233, 0.8)',
          'rgba(34, 197, 94, 0.8)',
        ],
        borderColor: [
          'rgba(59, 130, 246, 1)',
          'rgba(16, 185, 129, 1)',
          'rgba(245, 158, 11, 1)',
          'rgba(239, 68, 68, 1)',
          'rgba(139, 92, 246, 1)',
          'rgba(236, 72, 153, 1)',
          'rgba(14, 165, 233, 1)',
          'rgba(34, 197, 94, 1)',
        ],
        borderWidth: 2,
        borderRadius: 8,
        borderSkipped: false,
      },
    ],
  };

  // Fonction pour convertir les couleurs Tailwind en RGBA
  const convertTailwindColor = (tailwindColor: string, opacity: number = 0.8) => {
    const colorMap: { [key: string]: string } = {
      'bg-yellow-500': `rgba(234, 179, 8, ${opacity})`,
      'bg-red-500': `rgba(239, 68, 68, ${opacity})`,
      'bg-green-500': `rgba(34, 197, 94, ${opacity})`,
      'bg-orange-500': `rgba(249, 115, 22, ${opacity})`,
      'bg-blue-500': `rgba(59, 130, 246, ${opacity})`,
    };
    return colorMap[tailwindColor] || `rgba(156, 163, 175, ${opacity})`;
  };

  // Données pour le graphique par niveau
  const levelChartData = {
    labels: schoolsByLevel.map(type => type.label),
    datasets: [
      {
        data: schoolsByLevel.map(type => type.count),
        backgroundColor: schoolsByLevel.map(type => convertTailwindColor(type.color, 0.8)),
        borderColor: schoolsByLevel.map(type => convertTailwindColor(type.color, 1)),
        borderWidth: 2,
        cutout: '60%',
      },
    ],
  };

  // Données pour le graphique par type
  const typeChartData = {
    labels: schoolsByType.map(type => type.label),
    datasets: [
      {
        data: schoolsByType.map(type => type.count),
        backgroundColor: schoolsByType.map(type => convertTailwindColor(type.color, 0.8)),
        borderColor: schoolsByType.map(type => convertTailwindColor(type.color, 1)),
        borderWidth: 2,
        cutout: '60%',
      },
    ],
  };

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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Schools by Region */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Répartition par région</h3>
          
          {/* Graphique en barres */}
          <div className="h-48 mb-6">
            <Bar data={regionChartData} options={chartOptions} />
          </div>
          
          {/* Liste détaillée */}
          <div className="space-y-3">
            {schoolsByRegion.slice(0, 8).map((item) => {
              const total = schoolsByRegion.reduce((sum, r) => sum + r.count, 0);
              const percentage = ((item.count / total) * 100).toFixed(1);
              return (
                <div key={item.region} className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-gray-900">{item.region}</span>
                      <span className="text-sm text-gray-600">
                        {item.count} établissements <span className="text-blue-600">({percentage}%)</span>
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: `${(item.count / Math.max(...schoolsByRegion.map(r => r.count))) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Schools by Level */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Répartition par niveau</h3>
          
          {/* Graphique en donut */}
          <div className="h-48 mb-6 flex items-center justify-center">
            <Doughnut data={levelChartData} options={donutOptions} />
          </div>
          
          {/* Liste détaillée */}
          <div className="space-y-3">
            {schoolsByLevel.map((type) => {
              const total = schoolsByLevel.reduce((sum, t) => sum + t.count, 0);
              const percentage = ((type.count / total) * 100).toFixed(1);
              return (
                <div key={type.value} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-4 h-4 rounded-full ${type.color}`}></div>
                    <span className="text-sm font-medium text-gray-900">{type.label}</span>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-gray-900">
                      {type.count} <span className="text-blue-600">({percentage}%)</span>
                    </p>
                    <p className="text-xs text-gray-600">{type.students.toLocaleString()} étudiants</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Schools by Type */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Répartition par type</h3>
          
          {/* Graphique en donut */}
          <div className="h-48 mb-6 flex items-center justify-center">
            <Doughnut data={typeChartData} options={donutOptions} />
          </div>
          
          {/* Liste détaillée */}
          <div className="space-y-3">
            {schoolsByType.map((type) => {
              const total = schoolsByType.reduce((sum, t) => sum + t.count, 0);
              const percentage = ((type.count / total) * 100).toFixed(1);
              return (
                <div key={type.value} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-4 h-4 rounded-full ${type.color}`}></div>
                    <span className="text-sm font-medium text-gray-900">{type.label}</span>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-gray-900">
                      {type.count} <span className="text-blue-600">({percentage}%)</span>
                    </p>
                    <p className="text-xs text-gray-600">{type.students.toLocaleString()} étudiants</p>
                  </div>
                </div>
              );
            })}
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

      {/* Section Statistiques Avancées */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-6">Statistiques Avancées</h3>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Top 5 des régions par nombre d'étudiants */}
          <div>
            <h4 className="text-lg font-medium text-gray-900 mb-4">Top 5 - Régions par nombre d'étudiants</h4>
            <div className="h-64">
              <Bar 
                data={{
                  labels: schoolsByRegion
                    .sort((a, b) => b.students - a.students)
                    .slice(0, 5)
                    .map(item => item.region),
                  datasets: [{
                    data: schoolsByRegion
                      .sort((a, b) => b.students - a.students)
                      .slice(0, 5)
                      .map(item => item.students),
                    backgroundColor: [
                      'rgba(59, 130, 246, 0.8)',
                      'rgba(16, 185, 129, 0.8)',
                      'rgba(245, 158, 11, 0.8)',
                      'rgba(239, 68, 68, 0.8)',
                      'rgba(139, 92, 246, 0.8)',
                    ],
                    borderColor: [
                      'rgba(59, 130, 246, 1)',
                      'rgba(16, 185, 129, 1)',
                      'rgba(245, 158, 11, 1)',
                      'rgba(239, 68, 68, 1)',
                      'rgba(139, 92, 246, 1)',
                    ],
                    borderWidth: 2,
                    borderRadius: 8,
                    borderSkipped: false,
                  }]
                }} 
                options={{
                  ...chartOptions,
                  scales: {
                    ...chartOptions.scales,
                    y: {
                      ...chartOptions.scales.y,
                      ticks: {
                        callback: function(value: any) {
                          return value.toLocaleString() + ' étudiants';
                        }
                      }
                    }
                  },
                  plugins: {
                    ...chartOptions.plugins,
                    tooltip: {
                      ...chartOptions.plugins.tooltip,
                      callbacks: {
                        label: function(context: any) {
                          return `${context.label}: ${context.parsed.toLocaleString()} étudiants`;
                        }
                      }
                    }
                  }
                }} 
              />
            </div>
          </div>

          {/* Répartition des établissements par année de création */}
          <div>
            <h4 className="text-lg font-medium text-gray-900 mb-4">Répartition par année de création</h4>
            <div className="h-64">
              <Bar 
                data={{
                  labels: ['1950-1960', '1961-1970', '1971-1980', '1981-1990', '1991-2000', '2001-2010', '2011-2020', '2021+'],
                  datasets: [{
                    data: [
                      mockSchools.filter(s => s.established >= 1950 && s.established <= 1960).length,
                      mockSchools.filter(s => s.established >= 1961 && s.established <= 1970).length,
                      mockSchools.filter(s => s.established >= 1971 && s.established <= 1980).length,
                      mockSchools.filter(s => s.established >= 1981 && s.established <= 1990).length,
                      mockSchools.filter(s => s.established >= 1991 && s.established <= 2000).length,
                      mockSchools.filter(s => s.established >= 2001 && s.established <= 2010).length,
                      mockSchools.filter(s => s.established >= 2011 && s.established <= 2020).length,
                      mockSchools.filter(s => s.established >= 2021).length,
                    ],
                    backgroundColor: 'rgba(34, 197, 94, 0.8)',
                    borderColor: 'rgba(34, 197, 94, 1)',
                    borderWidth: 2,
                    borderRadius: 8,
                    borderSkipped: false,
                  }]
                }} 
                options={{
                  ...chartOptions,
                  plugins: {
                    ...chartOptions.plugins,
                    tooltip: {
                      ...chartOptions.plugins.tooltip,
                      callbacks: {
                        label: function(context: any) {
                          return `${context.parsed} établissements créés`;
                        }
                      }
                    }
                  }
                }} 
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};