import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../firebase/useAuth';
import { favoritesApi } from '../services/favoritesApi';

// LocalStorage fallback functions
const getLocalFavorites = (uid: string): string[] => {
  try {
    const saved = localStorage.getItem(`favorites_${uid}`);
    return saved ? JSON.parse(saved) : [];
  } catch (error) {
    console.error('Error loading favorites from localStorage:', error);
    return [];
  }
};

const saveLocalFavorites = (uid: string, favorites: string[]): void => {
  try {
    localStorage.setItem(`favorites_${uid}`, JSON.stringify(favorites));
  } catch (error) {
    console.error('Error saving favorites to localStorage:', error);
  }
};

export const useFavorites = () => {
  const { user } = useAuth();
  const [favorites, setFavorites] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load favorites when user changes
  useEffect(() => {
    if (user?.uid) {
      loadFavorites();
    } else {
      setFavorites([]);
    }
  }, [user?.uid]);

  const loadFavorites = useCallback(async () => {
    if (!user?.uid) return;

    setLoading(true);
    setError(null);
    
    try {
      // Try API first
      const favoriteBooks = await favoritesApi.getFavorites(user.uid, user.email || undefined);
      setFavorites(favoriteBooks);
      // Sync to localStorage as backup
      saveLocalFavorites(user.uid, favoriteBooks);
    } catch (err) {
      console.warn('API failed, falling back to localStorage:', err);
      // Fallback to localStorage
      const localFavorites = getLocalFavorites(user.uid);
      setFavorites(localFavorites);
      setError('Using offline mode - changes will sync when connection is restored');
    } finally {
      setLoading(false);
    }
  }, [user?.uid, user?.email]);

  const toggleFavorite = useCallback(async (bookId: string): Promise<boolean> => {
    if (!user?.uid) {
      console.warn('No user authenticated');
      return false;
    }

    setError(null);
    
    try {
      const result = await favoritesApi.toggleFavorite(
        user.uid, 
        bookId, 
        user.email || undefined
      );

      if (result.success) {
        // Update local state immediately for better UX
        let newFavorites;
        if (result.action === 'added') {
          newFavorites = [...favorites, bookId];
        } else if (result.action === 'removed') {
          newFavorites = favorites.filter(id => id !== bookId);
        } else {
          return false;
        }
        
        setFavorites(newFavorites);
        saveLocalFavorites(user.uid, newFavorites);
        return true;
      } else {
        setError('Failed to update favorites');
        return false;
      }
    } catch (err) {
      console.warn('API failed, using localStorage fallback:', err);
      
      // Fallback to localStorage
      const isCurrentlyFavorite = favorites.includes(bookId);
      let newFavorites;
      
      if (isCurrentlyFavorite) {
        newFavorites = favorites.filter(id => id !== bookId);
      } else {
        newFavorites = [...favorites, bookId];
      }
      
      setFavorites(newFavorites);
      saveLocalFavorites(user.uid, newFavorites);
      setError('Offline mode - changes saved locally');
      return true;
    }
  }, [user?.uid, user?.email, favorites]);

  const addToFavorites = useCallback(async (bookId: string): Promise<boolean> => {
    if (!user?.uid) {
      console.warn('No user authenticated');
      return false;
    }

    setError(null);
    
    try {
      const success = await favoritesApi.addToFavorites(
        user.uid, 
        bookId, 
        user.email || undefined
      );

      if (success) {
        setFavorites(prev => [...prev, bookId]);
      }
      return success;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to add to favorites';
      setError(errorMessage);
      console.error('Error adding to favorites:', err);
      return false;
    }
  }, [user?.uid, user?.email]);

  const removeFromFavorites = useCallback(async (bookId: string): Promise<boolean> => {
    if (!user?.uid) {
      console.warn('No user authenticated');
      return false;
    }

    setError(null);
    
    try {
      const success = await favoritesApi.removeFromFavorites(user.uid, bookId);

      if (success) {
        setFavorites(prev => prev.filter(id => id !== bookId));
      }
      return success;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to remove from favorites';
      setError(errorMessage);
      console.error('Error removing from favorites:', err);
      return false;
    }
  }, [user?.uid]);

  const isFavorite = useCallback((bookId: string): boolean => {
    return favorites.includes(bookId);
  }, [favorites]);

  const refreshFavorites = useCallback(() => {
    loadFavorites();
  }, [loadFavorites]);

  return {
    favorites,
    loading,
    error,
    toggleFavorite,
    addToFavorites,
    removeFromFavorites,
    isFavorite,
    refreshFavorites,
    isAuthenticated: !!user?.uid
  };
};
