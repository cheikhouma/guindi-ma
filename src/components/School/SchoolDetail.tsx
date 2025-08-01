import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Heart, 
  MapPin, 
  Users, 
  Star, 
  Phone, 
  Mail, 
  Globe, 
  Calendar,
  Share2,
  Navigation
} from 'lucide-react';
import { School } from '../../types';
import { useNavigation } from '../../hooks/useNavigation';
import { useAuth } from '../../hooks/useAuth';
import { useParams } from 'react-router-dom';
import { mockSchools } from '../../data/mockData';

export const SchoolDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user, toggleFavorite } = useAuth();
  const { goBack } = useNavigation();
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  // Trouver l'école par son ID
  const school = mockSchools.find(s => s.id === id);
  
  if (!school) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Établissement non trouvé</h2>
        <p className="text-gray-600 mb-6">L'établissement que vous recherchez n'existe pas.</p>
        <button
          onClick={goBack}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
        >
          Retour
        </button>
      </div>
    );
  }

  const isFavorite = user?.favorites.includes(school.id) || false;

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'primary': return 'École Primaire';
      case 'secondary': return 'Collège';
      case 'high_school': return 'Lycée';
      default: return type;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'primary': return 'bg-green-100 text-green-800';
      case 'secondary': return 'bg-blue-100 text-blue-800';
      case 'high_school': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={goBack}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Retour</span>
        </button>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={() => toggleFavorite(school.id)}
            className={`p-2 rounded-lg transition-colors ${
              isFavorite 
                ? 'bg-red-50 text-red-600 hover:bg-red-100' 
                : 'bg-gray-50 text-gray-400 hover:bg-gray-100 hover:text-red-500'
            }`}
          >
            <Heart className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
          </button>
          
          <button className="p-2 bg-gray-50 text-gray-600 rounded-lg hover:bg-gray-100 transition-colors">
            <Share2 className="w-5 h-5" />
          </button>
          
          <button className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors">
            <Navigation className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main Info */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <div className="flex items-center space-x-3 mb-2">
              <h1 className="text-3xl font-bold text-gray-900">{school.name}</h1>
              <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getTypeColor(school.type)}`}>
                {getTypeLabel(school.type)}
              </span>
            </div>
            
            <div className="flex items-center space-x-1 text-gray-600 mb-3">
              <MapPin className="w-5 h-5" />
              <span className="text-lg">{school.address}</span>
            </div>
            
            <div className="flex items-center space-x-6 text-gray-600">
              <div className="flex items-center space-x-2">
                <Users className="w-5 h-5" />
                <span className="font-semibold">{school.students.toLocaleString()}</span>
                <span>élèves</span>
              </div>
              
              <div className="flex items-center space-x-2">
                <Calendar className="w-5 h-5" />
                <span>Fondé en {school.established}</span>
              </div>
            </div>
          </div>
          
          <div className="text-right">
            <div className="flex items-center space-x-1 mb-2">
              <Star className="w-6 h-6 text-yellow-500 fill-current" />
              <span className="text-2xl font-bold text-gray-900">{school.rating}</span>
            </div>
            <p className="text-sm text-gray-600">{school.reviews.length} avis</p>
          </div>
        </div>

        {/* Contact Info */}
        <div className="flex flex-wrap gap-4 pt-4 border-t border-gray-200">
          {school.phone && (
            <div className="flex items-center space-x-2 text-gray-600">
              <Phone className="w-4 h-4" />
              <span>{school.phone}</span>
            </div>
          )}
          
          {school.email && (
            <div className="flex items-center space-x-2 text-gray-600">
              <Mail className="w-4 h-4" />
              <span>{school.email}</span>
            </div>
          )}
          
          {school.website && (
            <div className="flex items-center space-x-2 text-blue-600">
              <Globe className="w-4 h-4" />
              <a href={school.website} target="_blank" rel="noopener noreferrer" className="hover:underline">
                Site web
              </a>
            </div>
          )}
        </div>
      </div>

      {/* Images */}
      {school.images.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Photos</h2>
          
          <div className="space-y-4">
            <div className="aspect-video rounded-lg overflow-hidden">
              <img
                src={school.images[activeImageIndex]}
                alt={`${school.name} - Image ${activeImageIndex + 1}`}
                className="w-full h-full object-cover"
              />
            </div>
            
            {school.images.length > 1 && (
              <div className="flex space-x-2 overflow-x-auto">
                {school.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveImageIndex(index)}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                      index === activeImageIndex ? 'border-blue-500' : 'border-gray-200'
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${school.name} - Miniature ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Facilities */}
      {school.facilities.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Équipements et services</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {school.facilities.map((facility, index) => (
              <div
                key={index}
                className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg"
              >
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm font-medium text-gray-700">{facility}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Reviews */}
      {school.reviews.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Avis des parents</h2>
          <div className="space-y-4">
            {school.reviews.map((review) => (
              <div key={review.id} className="border-b border-gray-200 pb-4 last:border-b-0">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h4 className="font-semibold text-gray-900">{review.userName}</h4>
                    <div className="flex items-center space-x-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < review.rating 
                              ? 'text-yellow-500 fill-current' 
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                  <span className="text-sm text-gray-500">
                    {new Date(review.date).toLocaleDateString('fr-FR')}
                  </span>
                </div>
                <p className="text-gray-700">{review.comment}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};