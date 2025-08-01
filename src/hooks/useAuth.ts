import { useState, useCallback, useEffect } from 'react';
import { User } from '../types';
import { mockUser } from '../data/mockData';

// Simuler un stockage local pour persister l'état de connexion
const STORAGE_KEY = 'guindi_ma_user';

const getStoredUser = (): User | null => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
};

const setStoredUser = (user: User | null) => {
  if (user) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
  } else {
    localStorage.removeItem(STORAGE_KEY);
  }
};

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(getStoredUser);
  const [isLoading, setIsLoading] = useState(false);

  // Persister l'état utilisateur dans le localStorage
  useEffect(() => {
    setStoredUser(user);
  }, [user]);

  const login = useCallback(async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Simuler une validation d'email/mot de passe
      if (email === 'admin@example.com' && password === 'admin123') {
        // Connexion admin
        setUser({
          ...mockUser,
          email: email,
          name: 'Admin User'
        });
      } else if (email === 'user@example.com' && password === 'user123') {
        // Connexion utilisateur normal
        setUser({
          id: '2',
          name: 'Utilisateur Normal',
          email: email,
          role: 'user',
          favorites: ['1', '2'],
          avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=100'
        });
      } else {
        // Connexion avec les données mockées par défaut
        setUser({
          ...mockUser,
          email: email,
          name: email.split('@')[0] // Utiliser la partie avant @ comme nom
        });
      }
    } catch (error) {
      console.error('Erreur de connexion:', error);
      throw new Error('Email ou mot de passe incorrect');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const register = useCallback(async (name: string, email: string, password: string) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newUser: User = {
        id: Date.now().toString(),
        name,
        email,
        role: 'user',
        favorites: [],
        avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=100'
      };
      
      setUser(newUser);
    } catch (error) {
      console.error('Erreur d\'inscription:', error);
      throw new Error('Erreur lors de l\'inscription');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    setUser(null);
  }, []);

  const toggleFavorite = useCallback((schoolId: string) => {
    if (!user) return;
    
    const favorites = user.favorites.includes(schoolId)
      ? user.favorites.filter(id => id !== schoolId)
      : [...user.favorites, schoolId];
    
    setUser({ ...user, favorites });
  }, [user]);

  return {
    user,
    isLoading,
    login,
    register,
    logout,
    toggleFavorite,
    isAuthenticated: !!user
  };
};