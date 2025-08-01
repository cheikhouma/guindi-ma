import React, { useEffect } from 'react';
import { GraduationCap, MapPin } from 'lucide-react';

interface SplashScreenProps {
  onComplete: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onComplete }) => {
  useEffect(() => {
    const timer = setTimeout(onComplete, 2500);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-blue-600 via-blue-700 to-green-600 flex items-center justify-center z-50">
      <div className="text-center text-white animate-fade-in">
        <div className="flex items-center justify-center mb-8">
          <div className="relative">
            <GraduationCap className="w-16 h-16 animate-bounce" />
            <MapPin className="w-8 h-8 absolute -bottom-2 -right-2 text-green-300 animate-pulse" />
          </div>
        </div>
        
        <h1 className="text-4xl font-bold mb-4 animate-slide-up">
          Guindi Ma
        </h1>
        
        <p className="text-lg opacity-90 animate-slide-up animation-delay-200">
          Votre guide des établissements scolaires au Sénégal
        </p>
        
        <div className="mt-8 flex justify-center">
          <div className="flex space-x-1">
            <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
            <div className="w-2 h-2 bg-white rounded-full animate-pulse animation-delay-200"></div>
            <div className="w-2 h-2 bg-white rounded-full animate-pulse animation-delay-400"></div>
          </div>
        </div>
      </div>
    </div>
  );
};