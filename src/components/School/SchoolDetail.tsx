import React, { useState, useEffect, useRef } from 'react';
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
  Navigation,
  Download,
  FileText,
  ChevronDown,
  ExternalLink,
  Copy,
  Check,
  Building,
  Award,
  Clock,
  Map,
  Send,
  MessageCircle,
  User
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
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [copied, setCopied] = useState(false);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [newComment, setNewComment] = useState('');
  const [newRating, setNewRating] = useState(5);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const exportMenuRef = useRef<HTMLDivElement>(null);
  const shareMenuRef = useRef<HTMLDivElement>(null);

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

  const getLevelLabel = (level: string) => {
    switch (level) {
      case 'primary': return 'Primaire';
      case 'secondary': return 'Collège';
      case 'high_school': return 'Lycée';
      default: return level;
    }
  };

  // Fonction d'export CSV
  const exportToCSV = () => {
    const csvData = [
      ['Nom', school.name],
      ['Type', getTypeLabel(school.type)],
      ['Niveau', getLevelLabel(school.level)],
      ['Adresse', school.address],
      ['Région', school.region],
      ['Latitude', school.coordinates.lat.toString()],
      ['Longitude', school.coordinates.lng.toString()],
      ['Nombre d\'élèves', school.students.toString()],
      ['Note', school.rating.toString()],
      ['Année de fondation', school.established.toString()],
      ['Téléphone', school.phone || 'Non renseigné'],
      ['Email', school.email || 'Non renseigné'],
      ['Site web', school.website || 'Non renseigné'],
      ['Équipements', school.facilities.join(', ')],
      ['Nombre d\'avis', school.reviews.length.toString()],
      ['Date d\'export', new Date().toLocaleDateString('fr-FR')]
    ];

    const csvContent = csvData.map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `${school.name.replace(/[^a-zA-Z0-9]/g, '_')}_donnees.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setShowExportMenu(false);
  };

  // Fonction d'export TXT
  const exportToTXT = () => {
    const txtContent = `INFORMATIONS SUR L'ÉTABLISSEMENT
=====================================

Nom: ${school.name}
Type: ${getTypeLabel(school.type)}
Niveau: ${getLevelLabel(school.level)}
Adresse: ${school.address}
Région: ${school.region}

COORDONNÉES GÉOGRAPHIQUES
=========================
Latitude: ${school.coordinates.lat}
Longitude: ${school.coordinates.lng}

STATISTIQUES
============
Nombre d'élèves: ${school.students.toLocaleString()}
Note moyenne: ${school.rating}/5
Année de fondation: ${school.established}
Nombre d'avis: ${school.reviews.length}

CONTACT
=======
Téléphone: ${school.phone || 'Non renseigné'}
Email: ${school.email || 'Non renseigné'}
Site web: ${school.website || 'Non renseigné'}

ÉQUIPEMENTS ET SERVICES
=======================
${school.facilities.map(facility => `- ${facility}`).join('\n')}

${school.reviews.length > 0 ? `
AVIS DES PARENTS
================
${school.reviews.map(review => `
${review.userName} - ${new Date(review.date).toLocaleDateString('fr-FR')}
Note: ${review.rating}/5
${review.comment}
`).join('\n')}` : ''}

Date d'export: ${new Date().toLocaleDateString('fr-FR')}
Source: Guindi Ma - Plateforme de gestion des établissements scolaires du Sénégal`;

    const blob = new Blob([txtContent], { type: 'text/plain;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `${school.name.replace(/[^a-zA-Z0-9]/g, '_')}_donnees.txt`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setShowExportMenu(false);
  };

  // Fonction de partage
  const shareSchool = async () => {
    const shareData = {
      title: school.name,
      text: `Découvrez ${school.name} - ${getTypeLabel(school.type)} à ${school.region}`,
      url: window.location.href
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (error) {
        console.log('Erreur de partage:', error);
        copyToClipboard();
      }
    } else {
      copyToClipboard();
    }
    setShowShareMenu(false);
  };

  // Copier le lien
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.log('Erreur de copie:', error);
    }
  };

  // Obtenir la géolocalisation de l'utilisateur
  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          console.log('Erreur de géolocalisation:', error);
          // Utiliser une position par défaut (Dakar)
          setUserLocation({ lat: 14.7167, lng: -17.4677 });
        }
      );
    } else {
      // Utiliser une position par défaut (Dakar)
      setUserLocation({ lat: 14.7167, lng: -17.4677 });
    }
  };

  // Ouvrir Google Maps avec itinéraire
  const openGoogleMaps = () => {
    if (!userLocation) {
      getUserLocation();
      return;
    }

    const origin = `${userLocation.lat},${userLocation.lng}`;
    const destination = `${school.coordinates.lat},${school.coordinates.lng}`;
    const url = `https://www.google.com/maps/dir/${origin}/${destination}`;
    window.open(url, '_blank');
  };

  // Fermer les menus quand on clique en dehors
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (exportMenuRef.current && !exportMenuRef.current.contains(event.target as Node)) {
        setShowExportMenu(false);
      }
      if (shareMenuRef.current && !shareMenuRef.current.contains(event.target as Node)) {
        setShowShareMenu(false);
      }
    };

    if (showExportMenu || showShareMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showExportMenu, showShareMenu]);

  // Fonction pour ajouter un commentaire
  const handleSubmitComment = async () => {
    if (!user || !newComment.trim()) return;

    setIsSubmitting(true);
    
    try {
      // Simuler un appel API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newReview = {
        id: Date.now().toString(),
        userId: user.id,
        userName: user.name,
        rating: newRating,
        comment: newComment.trim(),
        date: new Date().toISOString().split('T')[0]
      };

      // Dans un vrai projet, on enverrait cette donnée à l'API
      console.log('Nouveau commentaire:', newReview);
      
      // Réinitialiser le formulaire
      setNewComment('');
      setNewRating(5);
      
      // Afficher un message de succès (dans un vrai projet)
      alert('Votre commentaire a été ajouté avec succès !');
      
    } catch (error) {
      console.error('Erreur lors de l\'ajout du commentaire:', error);
      alert('Erreur lors de l\'ajout du commentaire. Veuillez réessayer.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header avec image de fond */}
      <div className="relative bg-gradient-to-br from-blue-800  to-green-600 rounded-3xl overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-64 h-64 bg-white rounded-full -translate-x-32 -translate-y-32"></div>
          <div className="absolute top-1/2 right-0 w-48 h-48 bg-white rounded-full translate-x-24 -translate-y-24"></div>
          <div className="absolute bottom-0 left-1/3 w-32 h-32 bg-white rounded-full translate-x-16 translate-y-16"></div>
        </div>

        <div className="relative p-8 text-white">
          {/* Navigation et actions */}
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={goBack}
              className="flex items-center space-x-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-xl hover:bg-white/30 transition-all duration-300"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Retour</span>
            </button>
            
            <div className="flex items-center space-x-3">
              <button
                onClick={() => toggleFavorite(school.id)}
                className={`p-3 rounded-xl transition-all duration-300 ${
                  isFavorite 
                    ? 'bg-red-500 text-white hover:bg-red-600' 
                    : 'bg-white/20 backdrop-blur-sm hover:bg-white/30'
                }`}
              >
                <Heart className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
              </button>
              
              {/* Share Menu */}
              <div className="relative" ref={shareMenuRef}>
                <button
                  onClick={() => setShowShareMenu(!showShareMenu)}
                  className="p-3 bg-white/20 backdrop-blur-sm rounded-xl hover:bg-white/30 transition-all duration-300"
                >
                  <Share2 className="w-5 h-5" />
                </button>
                
                {showShareMenu && (
                  <div className="absolute right-0 top-full mt-2 bg-white rounded-xl shadow-xl border border-gray-200 py-2 z-10 min-w-[200px]">
                    <button
                      onClick={shareSchool}
                      className="w-full flex items-center space-x-3 px-4 py-3 text-left hover:bg-gray-50 transition-colors"
                    >
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <Share2 className="w-4 h-4 text-blue-600" />
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">Partager</div>
                        <div className="text-sm text-gray-500">Via l'appareil</div>
                      </div>
                    </button>
                    
                    <button
                      onClick={copyToClipboard}
                      className="w-full flex items-center space-x-3 px-4 py-3 text-left hover:bg-gray-50 transition-colors"
                    >
                      <div className="p-2 bg-green-100 rounded-lg">
                        {copied ? (
                          <Check className="w-4 h-4 text-green-600" />
                        ) : (
                          <Copy className="w-4 h-4 text-green-600" />
                        )}
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">
                          {copied ? 'Lien copié !' : 'Copier le lien'}
                        </div>
                        <div className="text-sm text-gray-500">Dans le presse-papiers</div>
                      </div>
                    </button>
                  </div>
                )}
              </div>

              {/* Export Menu */}
              <div className="relative" ref={exportMenuRef}>
                <button
                  onClick={() => setShowExportMenu(!showExportMenu)}
                  className="p-3 bg-white/20 backdrop-blur-sm rounded-xl hover:bg-white/30 transition-all duration-300 flex items-center space-x-1"
                >
                  <Download className="w-5 h-5" />
                  <ChevronDown className="w-4 h-4" />
                </button>
                
                {showExportMenu && (
                  <div className="absolute right-0 top-full mt-2 bg-white rounded-xl shadow-xl border border-gray-200 py-2 z-10 min-w-[200px]">
                    <button
                      onClick={exportToCSV}
                      className="w-full flex items-center space-x-3 px-4 py-3 text-left hover:bg-gray-50 transition-colors"
                    >
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <FileText className="w-4 h-4 text-blue-600" />
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">Exporter en CSV</div>
                        <div className="text-sm text-gray-500">Format tableur</div>
                      </div>
                    </button>
                    
                    <button
                      onClick={exportToTXT}
                      className="w-full flex items-center space-x-3 px-4 py-3 text-left hover:bg-gray-50 transition-colors"
                    >
                      <div className="p-2 bg-green-100 rounded-lg">
                        <FileText className="w-4 h-4 text-green-600" />
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">Exporter en TXT</div>
                        <div className="text-sm text-gray-500">Format texte</div>
                      </div>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Informations principales */}
          <div className="max-w-4xl">
            <div className="flex items-start justify-between mb-6">
              <div className="flex-1">
                <div className="flex items-center space-x-4 mb-4">
                  <h1 className="text-4xl md:text-5xl font-bold">{school.name}</h1>
                  <span className={`inline-block px-4 py-2 rounded-full text-sm text-white font-semibold bg-white/20 backdrop-blur-sm ${getTypeColor(school.type)}`}>
                    {getTypeLabel(school.type)}
                  </span>
                </div>
                
                <div className="flex items-center space-x-2 text-xl mb-4">
                  <MapPin className="w-6 h-6" />
                  <span>{school.address}</span>
                </div>
                
                <div className="flex items-center space-x-6 text-lg">
                  <div className="flex items-center space-x-2">
                    <Users className="w-6 h-6" />
                    <span className="font-semibold">{school.students.toLocaleString()}</span>
                    <span>élèves</span>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-6 h-6" />
                    <span>Fondé en {school.established}</span>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Star className="w-6 h-6 text-yellow-300 fill-current" />
                    <span className="font-semibold">{school.rating}</span>
                    <span>({school.reviews.length} avis)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Cartes d'informations */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Carte de contact */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
            <Phone className="w-5 h-5 mr-2 text-blue-600" />
            Contact
          </h2>
          
          <div className="space-y-4">
            {school.phone && (
              <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-xl">
                <Phone className="w-5 h-5 text-blue-600" />
                <div>
                  <div className="font-medium text-gray-900">{school.phone}</div>
                  <div className="text-sm text-gray-600">Téléphone</div>
                </div>
              </div>
            )}
            
            {school.email && (
              <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-xl">
                <Mail className="w-5 h-5 text-green-600" />
                <div>
                  <div className="font-medium text-gray-900">{school.email}</div>
                  <div className="text-sm text-gray-600">Email</div>
                </div>
              </div>
            )}
            
            {school.website && (
              <a 
                href={school.website} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center space-x-3 p-3 bg-purple-50 rounded-xl hover:bg-purple-100 transition-colors"
              >
                <Globe className="w-5 h-5 text-purple-600" />
                <div>
                  <div className="font-medium text-gray-900">Site web</div>
                  <div className="text-sm text-gray-600">Visiter le site</div>
                </div>
                <ExternalLink className="w-4 h-4 text-purple-600 ml-auto" />
              </a>
            )}
          </div>
        </div>

        {/* Carte de localisation */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
            <Map className="w-5 h-5 mr-2 text-green-600" />
            Localisation
          </h2>
          
          <div className="space-y-4">
            <div className="p-4 bg-gray-50 rounded-xl">
              <div className="flex items-center space-x-2 mb-2">
                <MapPin className="w-5 h-5 text-gray-600" />
                <span className="font-medium text-gray-900">Adresse</span>
              </div>
              <p className="text-gray-700">{school.address}</p>
            </div>

            <div className="p-4 bg-gray-50 rounded-xl">
              <div className="flex items-center space-x-2 mb-2">
                <Globe className="w-5 h-5 text-gray-600" />
                <span className="font-medium text-gray-900">Région</span>
              </div>
              <p className="text-gray-700">{school.region}</p>
            </div>

            <button
              onClick={openGoogleMaps}
              className="w-full bg-green-600 text-white py-3 px-4 rounded-xl font-semibold hover:bg-green-700 transition-colors flex items-center justify-center space-x-2"
            >
              <Navigation className="w-5 h-5" />
              <span>Itinéraire Google Maps</span>
            </button>
          </div>
        </div>

        {/* Carte de statistiques */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
            <Award className="w-5 h-5 mr-2 text-yellow-600" />
            Statistiques
          </h2>
          
          <div className="space-y-4">
            <div className="p-4 bg-blue-50 rounded-xl">
              <div className="flex items-center space-x-2 mb-2">
                <Users className="w-5 h-5 text-blue-600" />
                <span className="font-medium text-gray-900">Élèves</span>
              </div>
              <p className="text-2xl font-bold text-blue-900">{school.students.toLocaleString()}</p>
            </div>

            <div className="p-4 bg-yellow-50 rounded-xl">
              <div className="flex items-center space-x-2 mb-2">
                <Star className="w-5 h-5 text-yellow-600" />
                <span className="font-medium text-gray-900">Note moyenne</span>
              </div>
              <p className="text-2xl font-bold text-yellow-900">{school.rating}/5</p>
            </div>

            <div className="p-4 bg-purple-50 rounded-xl">
              <div className="flex items-center space-x-2 mb-2">
                <Clock className="w-5 h-5 text-purple-600" />
                <span className="font-medium text-gray-900">Fondé en</span>
              </div>
              <p className="text-2xl font-bold text-purple-900">{school.established}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Images */}
      {school.images.length > 0 && (
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
            <Building className="w-5 h-5 mr-2 text-blue-600" />
            Photos de l'établissement
          </h2>
          
          <div className="space-y-6">
            <div className="aspect-video rounded-xl overflow-hidden shadow-lg">
              <img
                src={school.images[activeImageIndex]}
                alt={`${school.name} - Image ${activeImageIndex + 1}`}
                className="w-full h-full object-cover"
              />
            </div>
            
            {school.images.length > 1 && (
              <div className="flex space-x-3 overflow-x-auto pb-2">
                {school.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveImageIndex(index)}
                    className={`flex-shrink-0 w-24 h-24 rounded-xl overflow-hidden border-2 transition-all ${
                      index === activeImageIndex ? 'border-blue-500 shadow-lg' : 'border-gray-200 hover:border-gray-300'
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
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
            <Award className="w-5 h-5 mr-2 text-green-600" />
            Équipements et services
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {school.facilities.map((facility, index) => (
              <div
                key={index}
                className="flex items-center space-x-3 p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-200"
              >
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-sm font-medium text-gray-700">{facility}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Reviews */}
      {school.reviews.length > 0 && (
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
            <Star className="w-5 h-5 mr-2 text-yellow-600" />
            Avis des parents ({school.reviews.length})
          </h2>
          <div className="space-y-6">
            {school.reviews.map((review) => (
              <div key={review.id} className="border-b border-gray-200 pb-6 last:border-b-0">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h4 className="font-semibold text-gray-900 text-lg">{review.userName}</h4>
                    <div className="flex items-center space-x-1 mt-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-5 h-5 ${
                            i < review.rating 
                              ? 'text-yellow-500 fill-current' 
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                      <span className="ml-2 text-sm text-gray-600">({review.rating}/5)</span>
                    </div>
                  </div>
                  <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                    {new Date(review.date).toLocaleDateString('fr-FR')}
                  </span>
                </div>
                <p className="text-gray-700 leading-relaxed">{review.comment}</p>
              </div>
            ))}
                     </div>
         </div>
       )}

       {/* Section Ajouter un commentaire */}
       {user && (
         <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
           <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
             <MessageCircle className="w-5 h-5 mr-2 text-blue-600" />
             Ajouter un commentaire
           </h2>
           
           <div className="space-y-6">
             {/* Note */}
             <div>
               <label className="block text-sm font-medium text-gray-700 mb-3">
                 Votre note
               </label>
               <div className="flex items-center space-x-2">
                 {[1, 2, 3, 4, 5].map((star) => (
                   <button
                     key={star}
                     onClick={() => setNewRating(star)}
                     className="transition-colors duration-200"
                   >
                     <Star
                       className={`w-8 h-8 ${
                         star <= newRating
                           ? 'text-yellow-500 fill-current'
                           : 'text-gray-300 hover:text-yellow-400'
                       }`}
                     />
                   </button>
                 ))}
                 <span className="ml-3 text-sm text-gray-600">
                   {newRating}/5 étoiles
                 </span>
               </div>
             </div>

             {/* Commentaire */}
             <div>
               <label className="block text-sm font-medium text-gray-700 mb-3">
                 Votre commentaire
               </label>
               <textarea
                 value={newComment}
                 onChange={(e) => setNewComment(e.target.value)}
                 placeholder="Partagez votre expérience avec cette école..."
                 className="w-full h-32 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                 maxLength={500}
               />
               <div className="flex justify-between items-center mt-2">
                 <span className="text-sm text-gray-500">
                   {newComment.length}/500 caractères
                 </span>
                 <span className="text-sm text-gray-500">
                   Connecté en tant que {user.name}
                 </span>
               </div>
             </div>

             {/* Bouton d'envoi */}
             <div className="flex justify-end">
               <button
                 onClick={handleSubmitComment}
                 disabled={!newComment.trim() || isSubmitting}
                 className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                   !newComment.trim() || isSubmitting
                     ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                     : 'bg-blue-600 text-white hover:bg-blue-700 transform hover:scale-105'
                 }`}
               >
                 {isSubmitting ? (
                   <>
                     <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                     <span>Envoi en cours...</span>
                   </>
                 ) : (
                   <>
                     <Send className="w-5 h-5" />
                     <span>Publier le commentaire</span>
                   </>
                 )}
               </button>
             </div>
           </div>
         </div>
       )}

       {/* Section Connexion pour commenter */}
       {!user && (
         <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border border-blue-200 p-8 text-center">
           <div className="max-w-md mx-auto">
             <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
               <User className="w-8 h-8 text-blue-600" />
             </div>
             <h3 className="text-xl font-bold text-gray-900 mb-2">
               Connectez-vous pour commenter
             </h3>
             <p className="text-gray-600 mb-6">
               Partagez votre expérience avec cette école en vous connectant à votre compte.
             </p>
             <button
               onClick={() => window.location.href = '/login'}
               className="bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors"
             >
               Se connecter
             </button>
           </div>
         </div>
       )}
     </div>
   );
 };