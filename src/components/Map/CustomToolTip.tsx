import { Eye, MapPin, Star } from "lucide-react";
import { useNavigation } from "../../hooks/useNavigation";
import {School as SchoolType} from "../../types";

// Composant pour les tooltips personnalisés
export const CustomTooltip: React.FC<{ school: SchoolType }> = ({ school }) => {
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
          <span className="font-medium text-gray-900">{getLevelLabel(school.type)}</span>
        </div>
        <div className="flex items-center justify-between text-xs">
          <span className="text-gray-600">Élèves:</span>
          <span className="font-medium text-gray-900">{school.students.toLocaleString()}</span>
        </div>
        <div className="flex items-center justify-between text-xs">
          <span className="text-gray-600">Statut:</span>
          <span className={`font-medium px-2 py-1 rounded-full text-xs ${school.type === 'private'
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
          onTouchMoveCapture={() => goToSchoolDetail(school)}
          className="flex-1 bg-blue-600 text-white text-xs px-3 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-1"
        >
          <Eye className="w-3 h-3" />
          <span>Voir détails</span>
        </button>

      </div>
    </div>
  );
};
