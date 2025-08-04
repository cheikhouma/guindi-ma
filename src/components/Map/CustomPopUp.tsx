import { Eye, Globe, Heart, MapPin, Phone, Star, Users } from "lucide-react";
import { useNavigation } from "../../hooks/useNavigation";
import { useAuth } from "../../hooks/useAuth";
import { School as SchoolType } from "../../types";

// Composant pour les popups personnalisés
export const CustomPopup: React.FC<{ school: SchoolType }> = ({ school }) => {
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

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'primary': return 'bg-yellow-500';
      case 'secondary': return 'bg-red-500';
      case 'high_school': return 'bg-green-500';
      default: return 'bg-gray-500';
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
          className={`p-2 rounded-full transition-colors ${user?.favorites.includes(school.id)
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
          </div>        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Statut:</span>
          <span className={`font-medium px-3 py-1 rounded-full text-sm ${school.type === 'private'
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
