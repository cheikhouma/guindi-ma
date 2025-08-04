import React from 'react';
import {
  Mail,
  Phone,
  MapPin,
  Heart,
  Facebook,
  Twitter,
  Instagram,
  GraduationCap,
  Globe,
  Users,
  Award,
  ArrowRight,
  MessageCircle,
  Home,
  Building2
} from 'lucide-react';
import { useNavigation } from '../../hooks/useNavigation';
import { useNavigate } from 'react-router-dom';

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  const { goToHome, goToSearch, goToMap,  goToChat } = useNavigation();
  const navigate = useNavigate();

  const navigationLinks = [
    { id: 'home', label: 'Accueil', action: goToHome, icon: <Home className="w-4 h-4" /> },
    { id: 'search', label: 'Ecole', action: goToSearch, icon: <Building2 className="w-4 h-4" /> },
    { id: 'map', label: 'Carte', action: goToMap, icon: <MapPin className="w-4 h-4" /> },
    { id: 'chat', label: 'Assistant IA', action: goToChat, icon: <MessageCircle className="w-4 h-4" /> },
  ];

  const resourceLinks = [
    { label: 'À propos', href: '/under-construction', description: 'Notre mission et équipe' },
    { label: 'Contact', href: '/under-construction', description: 'Nous contacter' },
    { label: 'Aide', href: '/under-construction', description: 'Centre d\'aide' },
    { label: 'FAQ', href: '/under-construction', description: 'Questions fréquentes' },
  ];

  const legalLinks = [
    { label: 'Conditions d\'utilisation', href: '/under-construction' },
    { label: 'Politique de confidentialité', href: '/under-construction' },
    { label: 'Mentions légales', href: '/under-construction' },
  ];

  const quickStats = [
    { label: 'Écoles', value: '150+', icon: <GraduationCap className="w-5 h-5" /> },
    { label: 'Régions', value: '14', icon: <MapPin className="w-5 h-5" /> },
    { label: 'Utilisateurs', value: '10k+', icon: <Users className="w-5 h-5" /> },
  ];

  return (
    <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-gray-300 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-0 w-64 h-64 bg-blue-500 rounded-full -translate-x-32 -translate-y-32"></div>
        <div className="absolute top-1/2 right-0 w-48 h-48 bg-green-500 rounded-full translate-x-24 -translate-y-24"></div>
        <div className="absolute bottom-0 left-1/3 w-32 h-32 bg-yellow-500 rounded-full translate-x-16 translate-y-16"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
          {/* Logo et description */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg">
                <GraduationCap className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Guindi Ma</h1>
                <p className="text-sm text-blue-300">Votre guide éducatif</p>
              </div>
            </div>

            <p className="text-gray-300 leading-relaxed text-lg">
              Votre plateforme de référence pour découvrir les meilleurs établissements scolaires au Sénégal.
              Trouvez l'école parfaite pour votre enfant en quelques clics.
            </p>

            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-4 pt-4">
              {quickStats.map((stat, index) => (
                <div key={index} className="text-center p-3 bg-white/5 rounded-lg backdrop-blur-sm">
                  <div className="flex justify-center mb-2 text-blue-400">
                    {stat.icon}
                  </div>
                  <div className="text-white font-bold text-lg">{stat.value}</div>
                  <div className="text-xs text-gray-400">{stat.label}</div>
                </div>
              ))}
            </div>

            {/* Social Links */}
            <div className="flex space-x-4 pt-4">
              <a href="#" className="group p-3 bg-white/10 rounded-full hover:bg-blue-500 transition-all duration-300 transform hover:scale-110">
                <Facebook className="w-5 h-5 text-gray-300 group-hover:text-white" />
              </a>
              <a href="#" className="group p-3 bg-white/10 rounded-full hover:bg-blue-400 transition-all duration-300 transform hover:scale-110">
                <Twitter className="w-5 h-5 text-gray-300 group-hover:text-white" />
              </a>
              <a href="#" className="group p-3 bg-white/10 rounded-full hover:bg-pink-500 transition-all duration-300 transform hover:scale-110">
                <Instagram className="w-5 h-5 text-gray-300 group-hover:text-white" />
              </a>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-6 flex items-center">
              <Globe className="w-5 h-5 mr-2 text-blue-400" />
              Navigation
            </h4>
            <ul className="space-y-3">
              {navigationLinks.map((link) => (
                <li key={link.id}>
                  <button
                    onClick={link.action}
                    className="group flex items-center space-x-3 text-gray-300 hover:text-white transition-all duration-300 text-sm hover:translate-x-1"
                  >
                    <span className="text-blue-400 group-hover:text-blue-300 transition-colors">
                      {link.icon}
                    </span>
                    <span>{link.label}</span>
                    <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-all duration-300" />
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Ressources */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-6 flex items-center">
              <Award className="w-5 h-5 mr-2 text-green-400" />
              Ressources
            </h4>
            <ul className="space-y-3">
              {resourceLinks.map((link, index) => (
                <li key={index}>
                  <button
                    onClick={() => navigate(link.href)}
                    className="group text-left w-full"
                  >
                    <div className="text-gray-300 hover:text-white transition-all duration-300 text-sm font-medium">
                      {link.label}
                    </div>
                    <div className="text-xs text-gray-500 group-hover:text-gray-400 transition-colors">
                      {link.description}
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-6 flex items-center">
              <MessageCircle className="w-5 h-5 mr-2 text-yellow-400" />
              Contact
            </h4>
            <div className="space-y-4">
              <div className="flex items-start space-x-3 group">
                <div className="p-2 bg-yellow-500/20 rounded-lg group-hover:bg-yellow-500/30 transition-colors">
                  <MapPin className="w-4 h-4 text-yellow-400" />
                </div>
                <div>
                  <div className="text-sm font-medium text-white">Adresse</div>
                  <div className="text-xs text-gray-400">Dakar, Sénégal</div>
                </div>
              </div>

              <div className="flex items-start space-x-3 group">
                <div className="p-2 bg-green-500/20 rounded-lg group-hover:bg-green-500/30 transition-colors">
                  <Phone className="w-4 h-4 text-green-400" />
                </div>
                <div>
                  <div className="text-sm font-medium text-white">Téléphone</div>
                  <div className="text-xs text-gray-400">+221 XX XXX XX XX</div>
                </div>
              </div>

              <div className="flex items-start space-x-3 group">
                <div className="p-2 bg-blue-500/20 rounded-lg group-hover:bg-blue-500/30 transition-colors">
                  <Mail className="w-4 h-4 text-blue-400" />
                </div>
                <div>
                  <div className="text-sm font-medium text-white">Email</div>
                  <div className="text-xs text-gray-400">contact@guindima.sn</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Newsletter Section */}
        {/* <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-2xl p-8 mb-8 backdrop-blur-sm border border-white/10">
          <div className="text-center">
            <h3 className="text-2xl font-bold text-white mb-2">Restez informé</h3>
            <p className="text-gray-300 mb-6">Recevez les dernières actualités sur l'éducation au Sénégal</p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Votre email"
                className="flex-1 px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl font-semibold hover:from-blue-600 hover:to-purple-600 transition-all duration-300 transform hover:scale-105 shadow-lg">
                S'abonner
              </button>
            </div>
          </div>
        </div> */}

        {/* Bottom Section */}
        <div className="border-t border-gray-700 pt-8">
          <div className="flex flex-col lg:flex-row justify-between items-center space-y-6 lg:space-y-0">
            {/* Copyright */}
            <div className="flex items-center space-x-2 text-gray-400">
              <span>© {currentYear} Guindi Ma. Fait avec</span>
              <Heart className="w-4 h-4 text-red-500 animate-pulse" />
              <span>au Sénégal</span>
            </div>

            {/* Liens légaux */}
            <div className="flex flex-wrap justify-center lg:justify-end gap-6">
              {legalLinks.map((link, index) => (
                <button
                  key={index}
                  onClick={() => navigate(link.href)}
                  className="text-sm text-gray-400 hover:text-white transition-all duration-300 hover:underline"
                >
                  {link.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};