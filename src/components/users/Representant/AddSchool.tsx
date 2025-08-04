import React, { useState } from 'react';
import { 
  School, 
  Building2, 
  MapPin, 
  Users, 
  Star, 
  Phone, 
  Mail, 
  Calendar, 
  Image, 
  Wrench,
  GraduationCap,
  Navigation,
  ArrowLeft,
  Plus,
  CheckCircle,
  AlertCircle,
  Map,
  Crosshair
} from 'lucide-react';
import { useNavigation } from '../../../hooks/useNavigation';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix icône par défaut Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png'
});

// Composant pour gérer les clics sur la carte
const MapClickHandler: React.FC<{ onLocationSelect: (lat: number, lng: number) => void }> = ({ onLocationSelect }) => {
  useMapEvents({
    click: (e) => {
      const { lat, lng } = e.latlng;
      onLocationSelect(lat, lng);
    },
  });
  return null;
};

export const AddSchoolForm: React.FC = () => {
  const { goBack } = useNavigation();
  const [form, setForm] = useState({
    name: '',
    type: "private" as 'private' | 'public',
    level: 'primary' as 'primary' | 'secondary' | 'high_school',
    address: '',
    region: 'Dakar' as 'Dakar' | 'Thiès' | 'Diourbel' | 'Saint-Louis' | 'Kaolack' | 'Ziguinchor' | 'Tambacounda' | 'Louga' | 'Fatick' | 'Kolda' | 'Matam' | 'Sédhiou' | 'Kaffrine' | 'Kedougou',
    lat: '',
    lng: '',
    students: '',
    facilities: '',
    rating: '',
    phone: '',
    email: '',
    established: '',
    images: '',
  });

  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [locationPermission, setLocationPermission] = useState<'granted' | 'denied' | 'prompt'>('prompt');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImageFiles([...imageFiles, ...Array.from(e.target.files)]);
    }
  };

  const removeImage = (index: number) => {
    setImageFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleLocationSelect = (lat: number, lng: number) => {
    setSelectedLocation({ lat, lng });
    setForm(prev => ({ ...prev, lat: lat.toString(), lng: lng.toString() }));
  };

  const getUserLocation = () => {
    if (!navigator.geolocation) {
      alert('La géolocalisation n\'est pas supportée par votre navigateur');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setUserLocation({ lat: latitude, lng: longitude });
        setSelectedLocation({ lat: latitude, lng: longitude });
        setForm(prev => ({ 
          ...prev, 
          lat: latitude.toString(), 
          lng: longitude.toString() 
        }));
        setLocationPermission('granted');
      },
      (error) => {
        console.error('Erreur de géolocalisation:', error);
        setLocationPermission('denied');
        switch (error.code) {
          case error.PERMISSION_DENIED:
            alert('Permission de géolocalisation refusée. Vous pouvez sélectionner manuellement la position sur la carte.');
            break;
          case error.POSITION_UNAVAILABLE:
            alert('Informations de localisation indisponibles.');
            break;
          case error.TIMEOUT:
            alert('Délai d\'attente dépassé pour la géolocalisation.');
            break;
          default:
            alert('Erreur lors de la géolocalisation.');
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000
      }
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simuler un délai de traitement
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Ici vous pouvez ajouter la logique pour sauvegarder l'école
    console.log('Nouvelle école:', {
      id: Date.now().toString(),
      name: form.name,
      type: form.type,
      level: form.level,
      address: form.address,
      region: form.region,
      coordinates: { lat: parseFloat(form.lat), lng: parseFloat(form.lng) },
      students: parseInt(form.students),
      facilities: form.facilities.split(',').map(f => f.trim()),
      rating: parseFloat(form.rating),
      reviews: [],
      images: form.images.split(',').map(url => url.trim()),
      phone: form.phone,
      email: form.email,
      established: parseInt(form.established),
    });
    
    // Rediriger vers le tableau de bord admin
    goBack();
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
    <div className=" container  bg-gradient-to-br from-white-50 to-blue-50 ">
      <div className=" mx-auto px-4">
     
        
        {/* Header */}
        <div className="mb-8">          
          <div className="text-center">
           
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Ajouter un établissement</h1>
            <p className="text-gray-600">Remplissez le formulaire ci-dessous pour ajouter un nouvel établissement</p>
          </div>
        </div>

        {/* Form */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-blue-500 p-8">
            <h2 className="text-xl font-semibold text-white">Informations de l'établissement</h2>
            <p className="text-yellow-100 mt-1">Tous les champs marqués d'un * sont obligatoires</p>
          </div>

          <form onSubmit={handleSubmit} className="p-8 space-y-6">
            {/* Informations de base */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
                Informations générales
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Nom de l'établissement *
                  </label>
                  <div className="relative">
                    <School className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input 
                      name="name" 
                      value={form.name} 
                      onChange={handleChange} 
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 pl-10 focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all" 
                      placeholder="Ex: École Primaire Liberté"
                      required 
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Type d'établissement *
                  </label>
                  <div className="relative">
                    <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <select 
                      name="type" 
                      value={form.type} 
                      onChange={handleChange} 
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 pl-10 focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all"
                    >
                      <option value="private">Privé</option>
                      <option value="public">Public</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Niveau d'enseignement *
                  </label>
                  <div className="relative">
                    <GraduationCap className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <select 
                      name="level" 
                      required 
                      value={form.level} 
                      onChange={handleChange} 
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 pl-10 focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all"
                    >
                      <option value="primary">Primaire</option>
                      <option value="secondary">Secondaire</option>
                      <option value="high_school">Lycée</option>
                    </select>
                  </div>
                  <div className="flex items-center space-x-2 mt-1">
                    <div className={`w-3 h-3 rounded-full ${getLevelColor(form.level)}`}></div>
                    <span className="text-xs text-gray-500">
                      {form.level === 'primary' && 'Marqueur jaune sur la carte'}
                      {form.level === 'secondary' && 'Marqueur rouge sur la carte'}
                      {form.level === 'high_school' && 'Marqueur vert sur la carte'}
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Région *
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <select 
                      name="region" 
                      required 
                      value={form.region} 
                      onChange={handleChange} 
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 pl-10 focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all"
                    >
                      <option value="Dakar">Dakar</option>
                      <option value="Thiès">Thiès</option>
                      <option value="Saint-Louis">Saint-Louis</option>
                      <option value="Kaolack">Kaolack</option>
                      <option value="Ziguinchor">Ziguinchor</option>
                      <option value="Diourbel">Diourbel</option>
                      <option value="Louga">Louga</option>
                      <option value="Fatick">Fatick</option>
                      <option value="Kolda">Kolda</option>
                      <option value="Tambacounda">Tambacounda</option>
                      <option value="Kédougou">Kédougou</option>
                      <option value="Sédhiou">Sédhiou</option>
                      <option value="Kaffrine">Kaffrine</option>
                      <option value="Matam">Matam</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Localisation */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
                Localisation
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Adresse complète *
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input 
                      name="address" 
                      value={form.address} 
                      onChange={handleChange} 
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 pl-10 focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all" 
                      placeholder="Ex: Avenue Bourguiba, Dakar"
                      required 
                    />
                  </div>
                </div>

                <div className="space-y-2 hidden">
                  <label className="block text-sm font-medium text-gray-700">
                    Latitude *
                  </label>
                  <div className="relative">
                    <Navigation className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input 
                      name="lat" 
                      type="number" 
                      step="any"
                      value={form.lat} 
                      onChange={handleChange} 
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 pl-10 focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all" 
                      placeholder="Ex: 14.6937"
                      required 
                    />
                  </div>
                </div>

                <div className="space-y-2 hidden">
                  <label className="block text-sm font-medium text-gray-700">
                    Longitude *
                  </label>
                  <div className="relative">
                    <Navigation className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input 
                      name="lng" 
                      type="number" 
                      step="any"
                      value={form.lng} 
                      onChange={handleChange} 
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 pl-10 focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all" 
                      placeholder="Ex: -17.4441"
                      required 
                    />
                  </div>
                </div>
              </div>

              {/* Carte interactive */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-medium text-gray-700">Sélectionner la position sur la carte</h4>
                  <div className="flex space-x-2">
                    <button
                      type="button"
                      onClick={getUserLocation}
                      className="flex items-center gap-2 px-3 py-2 bg-blue-500 text-white rounded-lg text-sm hover:bg-blue-600 transition-colors"
                    >
                      <Crosshair className="w-4 h-4" />
                      Ma position
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowMap(!showMap)}
                      className="flex items-center gap-2 px-3 py-2 bg-gray-500 text-white rounded-lg text-sm hover:bg-gray-600 transition-colors"
                    >
                      <Map className="w-4 h-4" />
                      {showMap ? 'Masquer' : 'Afficher'} la carte
                    </button>
                  </div>
                </div>

                {showMap && (
                  <div className="border border-gray-300 rounded-lg overflow-hidden">
                    <div className="h-96 w-full">
                      <MapContainer
                        center={selectedLocation ? [selectedLocation.lat, selectedLocation.lng] : [14.4974, -14.4524]}
                        zoom={selectedLocation ? 15 : 7}
                        scrollWheelZoom={true}
                        style={{ height: '100%', width: '100%' }}
                      >
                        <TileLayer
                          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        />
                        <MapClickHandler onLocationSelect={handleLocationSelect} />
                        
                        {/* Marqueur de position sélectionnée */}
                        {selectedLocation && (
                          <Marker
                            position={[selectedLocation.lat, selectedLocation.lng]}
                            icon={new L.DivIcon({
                              className: 'custom-marker',
                              html: `<div style="
                                background-color: #ef4444; 
                                width: 20px; 
                                height: 20px; 
                                border-radius: 50%; 
                                border: 3px solid white;
                                box-shadow: 0 2px 4px rgba(0,0,0,0.3);
                                display: flex;
                                align-items: center;
                                justify-content: center;
                              "></div>`,
                              iconSize: [20, 20],
                              iconAnchor: [10, 10]
                            })}
                          />
                        )}

                        {/* Marqueur de position utilisateur */}
                        {userLocation && (
                          <Marker
                            position={[userLocation.lat, userLocation.lng]}
                            icon={new L.DivIcon({
                              className: 'custom-marker',
                              html: `<div style="
                                background-color: #3b82f6; 
                                width: 16px; 
                                height: 16px; 
                                border-radius: 50%; 
                                border: 2px solid white;
                                box-shadow: 0 2px 4px rgba(0,0,0,0.3);
                                display: flex;
                                align-items: center;
                                justify-content: center;
                              "></div>`,
                              iconSize: [16, 16],
                              iconAnchor: [8, 8]
                            })}
                          />
                        )}
                      </MapContainer>
                    </div>
                  </div>
                )}

                {selectedLocation && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <span className="text-sm text-green-800">
                        Position sélectionnée : {selectedLocation.lat.toFixed(6)}, {selectedLocation.lng.toFixed(6)}
                      </span>
                    </div>
                  </div>
                )}

                {locationPermission === 'denied' && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                    <div className="flex items-center gap-2">
                      <AlertCircle className="w-5 h-5 text-yellow-600" />
                      <span className="text-sm text-yellow-800">
                        Permission de géolocalisation refusée. Vous pouvez sélectionner manuellement la position sur la carte.
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Statistiques */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
                Statistiques et contact
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Nombre d'étudiants *
                  </label>
                  <div className="relative">
                    <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input 
                      name="students" 
                      type="number" 
                      value={form.students} 
                      onChange={handleChange} 
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 pl-10 focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all" 
                      placeholder="Ex: 450"
                      required 
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Note moyenne
                  </label>
                  <div className="relative">
                    <Star className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input 
                      name="rating" 
                      type="number" 
                      step="0.1" 
                      min="0" 
                      max="5"
                      value={form.rating} 
                      onChange={handleChange} 
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 pl-10 focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all" 
                      placeholder="Ex: 4.2"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Téléphone
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input 
                      name="phone" 
                      value={form.phone} 
                      onChange={handleChange} 
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 pl-10 focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all" 
                      placeholder="Ex: +221 33 123 45 67"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input 
                      name="email" 
                      type="email" 
                      value={form.email} 
                      onChange={handleChange} 
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 pl-10 focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all" 
                      placeholder="Ex: contact@ecole.edu.sn ou contact@gmail.sn"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Année de création
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input 
                      name="established" 
                      type="number" 
                      value={form.established} 
                      onChange={handleChange} 
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 pl-10 focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all" 
                      placeholder="Ex: 1985"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Infrastructures */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
                Infrastructures et médias
              </h3>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    <div className="flex items-center gap-2">
                      <Wrench className="w-5 h-5" />
                      Infrastructures disponibles
                    </div>
                  </label>
                  <input 
                    name="facilities" 
                    value={form.facilities} 
                    onChange={handleChange} 
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all" 
                    placeholder="Ex: Bibliothèque, Cantine, Terrain de sport, Laboratoire"
                  />
                  <p className="text-xs text-gray-500">Séparez les infrastructures par des virgules</p>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    <div className="flex items-center gap-2">
                      <Image className="w-5 h-5" />
                      Images de l'établissement
                    </div>
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageChange}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all"
                  />
                  <p className="text-xs text-gray-500">Formats acceptés : JPG, PNG, WEBP (max 5MB par image)</p>
                </div>

                {/* Images sélectionnées */}
                {imageFiles.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-gray-700">Images sélectionnées :</h4>
                    <div className="space-y-2">
                      {imageFiles.map((file, index) => (
                        <div key={index} className="flex justify-between items-center border border-gray-200 rounded-lg p-3 bg-gray-50">
                          <div className="flex items-center gap-3">
                            <Image className="w-5 h-5 text-gray-500" />
                            <span className="text-sm truncate max-w-xs">{file.name}</span>
                            <span className="text-xs text-gray-500">({(file.size / 1024 / 1024).toFixed(2)} MB)</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="text-red-600 hover:text-red-800 text-sm font-medium transition-colors"
                          >
                            Supprimer
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Conditions et soumission */}
            <div className="space-y-6 pt-6 border-t border-gray-200">
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-yellow-800">Important</h4>
                    <p className="text-sm text-yellow-700">
                      L'ajout d'un établissement nécessite une validation par l'administrateur. 
                      Après vérification de l'authenticité, l'établissement sera ajouté à la plateforme.
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <input 
                  type="checkbox" 
                  required 
                  className="w-4 h-4 text-yellow-600 border-gray-300 rounded focus:ring-yellow-500" 
                />
                <label className="text-sm text-gray-700">
                  J'accepte les <a href="#" className="text-yellow-600 hover:text-yellow-700 underline">conditions générales d'utilisation</a>
                </label>
              </div>

              <button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full bg-blue-500 text-white py-4 px-6 rounded-lg font-semibold hover:from-blue-600 hover:to-white-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Traitement en cours...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-5 h-5" />
                    Demander l'ajout de l'établissement
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};