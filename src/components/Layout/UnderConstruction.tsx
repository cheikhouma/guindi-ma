import React from 'react';
import { 
  Construction, 
  Clock, 
  ArrowLeft, 
  Wrench, 
  Lightbulb, 
  Heart,
  GraduationCap,
  CheckCircle
} from 'lucide-react';
import { useNavigation } from '../../hooks/useNavigation';

export const UnderConstruction: React.FC = () => {
  const { goToHome } = useNavigation();

  const upcomingFeatures = [
    {
      icon: <Wrench className="w-6 h-6" />,
      title: "À propos",
      description: "Découvrez notre mission et notre équipe dédiée à l'éducation au Sénégal"
    },
    {
      icon: <Lightbulb className="w-6 h-6" />,
      title: "FAQ",
      description: "Questions fréquemment posées et guides d'utilisation"
    },
    {
      icon: <Heart className="w-6 h-6" />,
      title: "Aide",
      description: "Centre d'aide et support utilisateur personnalisé"
    },
    {
      icon: <GraduationCap className="w-6 h-6" />,
      title: "Contact",
      description: "Formulaire de contact et informations de l'équipe"
    }
  ];

  const legalPages = [
    "Conditions d'utilisation",
    "Politique de confidentialité", 
    "Mentions légales"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
      <div className="max-w-4xl mx-auto text-center">
        {/* Header */}
        <div className="mb-12">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full mb-8 animate-pulse">
            <Construction className="w-12 h-12 text-white" />
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-4">
            Page en construction
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Nous travaillons actuellement sur cette page pour vous offrir une expérience encore meilleure.
          </p>

          <div className="flex items-center justify-center space-x-2 text-yellow-600 mb-8">
            <Clock className="w-5 h-5" />
            <span className="font-medium">Disponible bientôt</span>
          </div>
        </div>

        {/* Features à venir */}
        <div className="bg-white rounded-3xl shadow-xl p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Fonctionnalités à venir
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {upcomingFeatures.map((feature, index) => (
              <div 
                key={index}
                className="group bg-gradient-to-br from-gray-50 to-white border border-gray-200 rounded-2xl p-6 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
              >
                <div className="flex items-start space-x-4">
                  <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl text-white group-hover:scale-110 transition-transform">
                    {feature.icon}
                  </div>
                  <div className="flex-1 text-left">
                    <h3 className="font-bold text-gray-900 text-lg mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pages légales */}
        <div className="bg-white rounded-3xl shadow-xl p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Pages légales en préparation
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {legalPages.map((page, index) => (
              <div 
                key={index}
                className="flex items-center space-x-3 p-4 bg-gray-50 rounded-xl"
              >
                <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                <span className="text-gray-700 font-medium">{page}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Call to action */}
        <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-green-600 rounded-3xl p-8 text-white">
          <h2 className="text-2xl font-bold mb-4">
            En attendant...
          </h2>
          <p className="text-lg mb-6 opacity-90">
            Explorez nos fonctionnalités disponibles et découvrez les meilleures écoles du Sénégal !
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={goToHome}
              className="bg-white text-blue-600 px-8 py-4 rounded-xl font-semibold hover:bg-gray-50 transition-all duration-300 flex items-center justify-center space-x-3 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Retour à l'accueil</span>
            </button>
            
            <button
              onClick={goToHome}
              className="border-2 border-white text-white px-8 py-4 rounded-xl font-semibold hover:bg-white hover:text-blue-600 transition-all duration-300 flex items-center justify-center space-x-3"
            >
              <GraduationCap className="w-5 h-5" />
              <span>Explorer les écoles</span>
            </button>
          </div>
        </div>

        {/* Footer info */}
        <div className="mt-8 text-gray-500">
          <p className="text-sm">
            Cette page sera disponible dans les prochaines semaines. 
            <br />
            Merci de votre patience et de votre intérêt pour Guindi Ma !
          </p>
        </div>
      </div>
    </div>
  );
}; 