import React from 'react';
import { Heart } from 'lucide-react';
import { School } from '../../types';
import { mockSchools } from '../../data/mockData';
import { SchoolCard } from '../School/SchoolCard';
import { useNavigation } from '../../hooks/useNavigation';
import { useAuth } from '../../hooks/useAuth';

export const FavoritesPage: React.FC = () => {
  const { user, toggleFavorite } = useAuth();
  const { goToSchoolDetail, goToSearch } = useNavigation();
  
  const favoriteSchools = mockSchools.filter(school => 
    user?.favorites.includes(school.id)
  );

  const handleSchoolSelect = (school: School) => {
    goToSchoolDetail(school);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center space-x-3 mb-2">
          <h1 className="text-2xl font-bold text-gray-900">Mes établissements favoris</h1>
        </div>
        <p className="text-gray-600">
          Retrouvez ici tous les établissements que vous avez ajoutés à vos favoris.
        </p>
      </div>

      {favoriteSchools.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {favoriteSchools.map(school => (
            <SchoolCard
              key={school.id}
              school={school}
              isFavorite={true}
              onToggleFavorite={toggleFavorite}
              onSelect={handleSchoolSelect}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <Heart className="w-12 h-12 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun favori pour le moment</h3>
          <p className="text-gray-600 mb-6">
            Ajoutez des établissements à vos favoris pour les retrouver facilement ici.
          </p>
          <button
            onClick={goToSearch}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Découvrir les établissements
          </button>
        </div>
      )}
    </div>
  );
};