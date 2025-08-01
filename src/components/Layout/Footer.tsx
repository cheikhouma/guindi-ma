import React from 'react';
import { Mail, Phone, MapPin, Heart, Facebook, Twitter, Instagram, ExternalLink, GraduationCap } from 'lucide-react';
import { useNavigation } from '../../hooks/useNavigation';

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  const { goToHome, goToSearch, goToMap, goToFavorites } = useNavigation();

  const navigationLinks = [
    { id: 'home', label: 'Accueil', action: goToHome },
    { id: 'search', label: 'Rechercher', action: goToSearch },
    { id: 'map', label: 'Carte', action: goToMap },
    { id: 'favorites', label: 'Favoris', action: goToFavorites },
  ];

  const resourceLinks = [
    { label: 'À propos', href: '#' },
    { label: 'Contact', href: '#' },
    { label: 'Aide', href: '#' },
    { label: 'FAQ', href: '#' },
  ];

  const legalLinks = [
    { label: 'Conditions d\'utilisation', href: '#' },
    { label: 'Politique de confidentialité', href: '#' },
    { label: 'Mentions légales', href: '#' },
  ];

  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Logo et description */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-blue-600 rounded-lg">
                <GraduationCap className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-xl font-bold text-white">Guindi Ma</h1>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed">
              Votre guide pour découvrir les meilleurs établissements scolaires au Sénégal. 
              Trouvez l'école parfaite pour votre enfant en quelques clics.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Navigation</h4>
            <ul className="space-y-3">
              {navigationLinks.map((link) => (
                <li key={link.id}>
                  <button
                    onClick={link.action}
                    className="text-gray-400 hover:text-white transition-colors text-sm"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Ressources */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Ressources</h4>
            <ul className="space-y-3">
              {resourceLinks.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.href}
                    className="text-gray-400 hover:text-white transition-colors text-sm flex items-center"
                  >
                    {link.label}
                    <ExternalLink className="w-3 h-3 ml-1" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Contact</h4>
            <div className="space-y-3">
              <div className="flex items-center text-sm text-gray-400">
                <MapPin className="w-4 h-4 mr-2 flex-shrink-0" />
                <span>Dakar, Sénégal</span>
              </div>
              <div className="flex items-center text-sm text-gray-400">
                <Phone className="w-4 h-4 mr-2 flex-shrink-0" />
                <span>+221 XX XXX XX XX</span>
              </div>
              <div className="flex items-center text-sm text-gray-400">
                <Mail className="w-4 h-4 mr-2 flex-shrink-0" />
                <span>contact@guindima.sn</span>
              </div>
            </div>
          </div>
        </div>

        {/* Ligne de séparation */}
        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            {/* Copyright */}
            <div className="flex items-center text-sm text-gray-400">
              <span>© {currentYear} Guindi Ma. Fait avec</span>
              <Heart className="w-4 h-4 mx-1 text-red-500" />
              <span>au Sénégal</span>
            </div>

            {/* Liens légaux */}
            <div className="flex flex-wrap justify-center md:justify-end space-x-6">
              {legalLinks.map((link, index) => (
                <a
                  key={index}
                  href={link.href}
                  className="text-sm text-gray-400 hover:text-white transition-colors"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};