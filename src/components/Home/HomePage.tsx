import React, { useState, useEffect } from 'react';
import {
  MapPin,
  School,
  Users,
  Star,
  ArrowRight,
  Search,
  MessageCircle,
  TrendingUp,
  Award,
  Globe,
  BookOpen,
  Eye,
  CheckCircle
} from 'lucide-react';
import { mockSchools } from '../../data/mockData';
import { useNavigation } from '../../hooks/useNavigation';

export const HomePage: React.FC = () => {
  const { goToMap, goToSearch, goToChat, goToSchoolDetail } = useNavigation();
  const [animatedStats, setAnimatedStats] = useState({
    totalSchools: 0,
    regions: 0,
    totalStudents: 0,
    averageRating: 0
  });

  const stats = {
    totalSchools: mockSchools.length,
    regions: new Set(mockSchools.map(s => s.region)).size,
    totalStudents: mockSchools.reduce((sum, s) => sum + s.students, 0),
    averageRating: mockSchools.reduce((sum, s) => sum + s.rating, 0) / mockSchools.length
  };

  const featuredSchools = mockSchools
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 6);

  // Animation des statistiques
  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedStats(stats);
    }, 500);

    return () => clearTimeout(timer);
  }, [stats]);

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'primary': return 'bg-yellow-500';
      case 'secondary': return 'bg-red-500';
      case 'high_school': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getLevelLabel = (level: string) => {
    switch (level) {
      case 'primary': return 'Primaire';
      case 'secondary': return 'Collège';
      case 'high_school': return 'Lycée';
      default: return level;
    }
  };

  return (
    <div className="space-y-12">
      {/* Hero Section - Amélioré */}
      <div className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-purple-600 to-green-600 rounded-3xl p-8 md:p-12 text-white">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-32 h-32 bg-white rounded-full -translate-x-16 -translate-y-16"></div>
          <div className="absolute top-1/2 right-0 w-24 h-24 bg-white rounded-full translate-x-12 -translate-y-12"></div>
          <div className="absolute bottom-0 left-1/3 w-16 h-16 bg-white rounded-full translate-x-8 translate-y-8"></div>
        </div>

        <div className="relative max-w-5xl mx-auto">
          <div className="text-center md:text-left">
            <div className="inline-flex items-center space-x-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
              <Award className="w-5 h-5" />
              <span className="text-sm font-medium">Plateforme officielle du Sénégal</span>
            </div>

            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              Trouvez l'école
              <span className="block text-yellow-300">parfaite</span>
              pour votre enfant
            </h1>

            <p className="text-xl md:text-2xl mb-8 opacity-90 max-w-3xl">
              Explorez plus de <span className="font-bold text-yellow-300">{stats.totalSchools}</span> établissements
              répartis dans <span className="font-bold text-yellow-300">{stats.regions}</span> régions du Sénégal
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <button
                onClick={goToMap}
                className="group bg-white text-blue-600 px-8 py-4 rounded-xl font-semibold hover:bg-gray-50 transition-all duration-300 flex items-center justify-center space-x-3 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                <MapPin className="w-6 h-6" />
                <span>Explorer la carte</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={goToSearch}
                className="group border-2 border-white text-white px-8 py-4 rounded-xl font-semibold hover:bg-white hover:text-blue-600 transition-all duration-300 flex items-center justify-center space-x-3 backdrop-blur-sm hover:shadow-xl transform hover:-translate-y-1"
              >
                <Search className="w-6 h-6" />
                <span>Rechercher</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Statistics - Amélioré avec animations */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <div className="group bg-white p-6 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl group-hover:scale-110 transition-transform">
              <School className="w-7 h-7 text-white" />
            </div>
            <div>
              <p className="text-3xl font-bold text-gray-900">{animatedStats.totalSchools}</p>
              <p className="text-sm text-gray-600 font-medium">Établissements</p>
            </div>
          </div>
        </div>

        <div className="group bg-white p-6 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-gradient-to-br from-green-500 to-green-600 rounded-xl group-hover:scale-110 transition-transform">
              <Globe className="w-7 h-7 text-white" />
            </div>
            <div>
              <p className="text-3xl font-bold text-gray-900">{animatedStats.regions}</p>
              <p className="text-sm text-gray-600 font-medium">Régions</p>
            </div>
          </div>
        </div>

        <div className="group bg-white p-6 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl group-hover:scale-110 transition-transform">
              <Users className="w-7 h-7 text-white" />
            </div>
            <div>
              <p className="text-3xl font-bold text-gray-900">{(animatedStats.totalStudents / 1000).toFixed(1)}k</p>
              <p className="text-sm text-gray-600 font-medium">Étudiants</p>
            </div>
          </div>
        </div>

        <div className="group bg-white p-6 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl group-hover:scale-110 transition-transform">
              <Star className="w-7 h-7 text-white" />
            </div>
            <div>
              <p className="text-3xl font-bold text-gray-900">{animatedStats.averageRating.toFixed(1)}</p>
              <p className="text-sm text-gray-600 font-medium">Note moyenne</p>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Schools - Redesign complet */}
      <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Établissements d'excellence</h2>
            <p className="text-gray-600">Les meilleures écoles selon nos critères de qualité</p>
          </div>
          <button
            onClick={goToSearch}
            className="group bg-blue-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-blue-700 transition-all duration-300 flex items-center space-x-2 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
          >
            <span>Voir tout</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredSchools.map((school, index) => (
            <div
              key={school.id}
              className="group bg-gradient-to-br from-gray-50 to-white border border-gray-200 rounded-2xl p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 hover:border-blue-300"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  {/* Niveaux */}
                  <div className="flex flex-wrap gap-1 mb-2">
                    {school.level.map((level, index) => (
                      <span
                        key={index}
                        className={`inline-block px-2 py-1 rounded text-xs font-medium ${getLevelColor(level)}`}
                      >
                        {getLevelLabel(level)}
                      </span>
                    ))}
                  </div>

                  <h3 className="font-bold text-gray-900 text-lg mb-2 group-hover:text-blue-600 transition-colors">
                    {school.name}
                  </h3>
                  <p className="text-sm text-gray-600 mb-3 flex items-center">
                    <MapPin className="w-4 h-4 mr-1" />
                    {school.address}
                  </p>
                </div>
                <div className="flex items-center space-x-1 bg-yellow-50 px-3 py-1 rounded-full">
                  <Star className="w-4 h-4 text-yellow-600 fill-current" />
                  <span className="text-sm font-bold text-yellow-800">{school.rating}</span>
                </div>
              </div>

              <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                <span className="flex items-center">
                  <Users className="w-4 h-4 mr-1" />
                  {school.students.toLocaleString()} élèves
                </span>
                <span className="flex items-center">
                  <BookOpen className="w-4 h-4 mr-1" />
                  {school.facilities.length} infrastructures
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  {school.type === 'private' ? 'Privé' : 'Public'}
                </span>
                <button onClick={() => goToSchoolDetail(school)}

                  className="text-blue-600 hover:text-blue-700 font-medium text-sm flex items-center group">
                  <Eye className="w-4 h-4 mr-1 group-hover:scale-110 transition-transform" />
                  Voir détails
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions - Redesign */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="group bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 rounded-3xl p-8 border border-green-200 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
          <div className="flex items-start space-x-4">
            <div className="p-4 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl group-hover:scale-110 transition-transform">
              <MessageCircle className="w-8 h-8 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Assistant intelligent</h3>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Notre IA vous aide à trouver l'établissement parfait selon vos critères :
                localisation, niveau, budget, et plus encore.
              </p>
              <div className="flex items-center space-x-4 text-sm text-gray-600 mb-6">
                <span className="flex items-center">
                  <CheckCircle className="w-4 h-4 mr-2 text-green-600" />
                  Recommandations personnalisées
                </span>
                <span className="flex items-center">
                  <CheckCircle className="w-4 h-4 mr-2 text-green-600" />
                  Réponses instantanées
                </span>
              </div>
              <button
                onClick={goToChat}
                className="bg-green-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-green-700 transition-all duration-300 flex items-center space-x-2 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                <MessageCircle className="w-5 h-5" />
                <span>Parler à l'assistant</span>
              </button>
            </div>
          </div>
        </div>

        <div className="group bg-gradient-to-br from-purple-50 via-violet-50 to-indigo-50 rounded-3xl p-8 border border-purple-200 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
          <div className="flex items-start space-x-4">
            <div className="p-4 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl group-hover:scale-110 transition-transform">
              <TrendingUp className="w-8 h-8 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Comparaison avancée</h3>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Comparez facilement les établissements selon vos critères :
                performance académique, infrastructures, coûts et plus.
              </p>
              <div className="flex items-center space-x-4 text-sm text-gray-600 mb-6">
                <span className="flex items-center">
                  <CheckCircle className="w-4 h-4 mr-2 text-purple-600" />
                  Comparaison côte à côte
                </span>
                <span className="flex items-center">
                  <CheckCircle className="w-4 h-4 mr-2 text-purple-600" />
                  Critères personnalisables
                </span>
              </div>
              <button
                onClick={goToSearch}
                className="bg-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-purple-700 transition-all duration-300 flex items-center space-x-2 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                <TrendingUp className="w-5 h-5" />
                <span>Comparer les écoles</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Call to Action - Nouveau */}
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-green-600 rounded-3xl p-8 md:p-12 text-white text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Prêt à trouver l'école parfaite ?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Rejoignez des milliers de parents qui ont déjà trouvé l'établissement idéal pour leurs enfants.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={goToMap}
              className="bg-white text-blue-600 px-8 py-4 rounded-xl font-semibold hover:bg-gray-50 transition-all duration-300 flex items-center justify-center space-x-3 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              <MapPin className="w-6 h-6" />
              <span>Explorer maintenant</span>
            </button>
            <button
              onClick={goToSearch}
              className="border-2 border-white text-white px-8 py-4 rounded-xl font-semibold hover:bg-white hover:text-blue-600 transition-all duration-300 flex items-center justify-center space-x-3"
            >
              <Search className="w-6 h-6" />
              <span>Rechercher</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};