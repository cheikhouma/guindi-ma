import React from 'react';
import { Heart, MapPin, Users, Star, Phone, Mail, Calendar } from 'lucide-react';
import { School } from '../../types';
import { useNavigation } from '../../hooks/useNavigation';

interface SchoolCardProps {
  school: School;
  isFavorite: boolean;
  onToggleFavorite: (schoolId: string) => void;
  onSelect: (school: School) => void;
  compact?: boolean;
}

export const SchoolCard: React.FC<SchoolCardProps> = ({
  school,
  isFavorite,
  onToggleFavorite,
  onSelect,
  compact = false
}) => {
  const getLevelLabel = (level: string) => {
    switch (level) {
      case 'primary': return 'Primaire';
      case 'secondary': return 'Collège';
      case 'high_school': return 'Lycée';
      default: return level;
    }
  };

  const { goToSchoolDetail } = useNavigation();

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'primary': return 'bg-yellow-500';
      case 'secondary': return 'bg-red-500';
      case 'high_school': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'private': return 'Privée';
      case 'public': return 'Publique';
      default: return type;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'private': return 'bg-orange-100 text-orange-800';
      case 'public': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };


  return (
    <div className={`bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow cursor-pointer ${compact ? 'p-4' : 'p-6'}`}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-2">
            <h3
              className={`font-semibold text-gray-900 hover:text-blue-600 transition-colors ${compact ? 'text-base' : 'text-lg'}`}
              onClick={() => onSelect(school)}
            >
              {school.name}
            </h3>
            <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${getTypeColor(school.type)}`}>
              {getTypeLabel(school.type)}
            </span>
          </div>

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

          <div className="flex items-center space-x-1 text-gray-600 mb-2">
            <MapPin className="w-4 h-4" />
            <span className={compact ? 'text-sm' : 'text-base'}>{school.address}</span>
          </div>

          <div className="flex items-center space-x-4 text-sm text-gray-600">
            <div className="flex items-center space-x-1">
              <Users className="w-4 h-4" />
              <span>{school.students} élèves</span>
            </div>

            <div className="flex items-center space-x-1">
              <Star className="w-4 h-4 text-yellow-500 fill-current" />
              <span>{school.rating}</span>
            </div>

            {!compact && school.established && (
              <div className="flex items-center space-x-1">
                <Calendar className="w-4 h-4" />
                <span>Depuis {school.established}</span>
              </div>
            )}
          </div>
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite(school.id);
          }}
          className={`p-2 rounded-lg transition-colors ${isFavorite
              ? 'bg-red-50 text-red-600 hover:bg-red-100'
              : 'bg-gray-50 text-gray-400 hover:bg-gray-100 hover:text-red-500'
            }`}
        >
          <Heart className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
        </button>
      </div>

      {!compact && (
        <>
          {/* Facilities */}
          {school.facilities.length > 0 && (
            <div className="mb-4">
              <div className="flex flex-wrap gap-2">
                {school.facilities.slice(0, 4).map((facility, index) => (
                  <span
                    key={index}
                    className="inline-block bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs"
                  >
                    {facility}
                  </span>
                ))}
                {school.facilities.length > 4 && (
                  <span className="inline-block bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
                    +{school.facilities.length - 4} autres
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Contact Info */}
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-4">
              {school.phone && (
                <div className="flex items-center space-x-1 text-gray-600">
                  <Phone className="w-4 h-4" />
                  <span>{school.phone}</span>
                </div>
              )}

              {school.email && (
                <div className="flex items-center space-x-1 text-gray-600">
                  <Mail className="w-4 h-4" />
                  <span className="truncate">{school.email}</span>
                </div>
              )}
            </div>

            <button
              onClick={() => goToSchoolDetail(school)}

              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              Voir détails →
            </button>
          </div>
        </>
      )}
    </div>
  );
};