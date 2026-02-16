import { useState, useEffect, useCallback } from 'react';
import { ApiService } from '../services/api.service';
import type { Character, FavoriteCharacter, PaginatedResponse, LoadingState } from '../types';

/**
 * Hook for searching characters
 */
export const useCharacterSearch = () => {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [loading, setLoading] = useState<LoadingState>('idle');
  const [error, setError] = useState<string | null>(null);

  const searchCharacters = useCallback(async (search?: string) => {
    setLoading('loading');
    setError(null);
    
    try {
      const results = await ApiService.searchCharacters(search);
      setCharacters(results);
      setLoading('success');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setLoading('error');
      setCharacters([]);
    }
  }, []);

  return { characters, loading, error, searchCharacters };
};

/**
 * Hook for managing favorites
 */
export const useFavorites = () => {
  const [favorites, setFavorites] = useState<PaginatedResponse<FavoriteCharacter>>({
    data: [],
    pagination: { page: 1, pageSize: 4, total: 0, totalPages: 0 }
  });
  const [loading, setLoading] = useState<LoadingState>('idle');
  const [error, setError] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const defaultPageSize = 4;
  
  const fetchFavorites = useCallback(async (page: number = 1, pageSize: number = defaultPageSize, silent: boolean = false) => {
    if (!silent) {
      setLoading('loading');
    } else {
      setIsRefreshing(true);
    }
    setError(null);
    
    try {
      const result = await ApiService.getFavorites(page, pageSize);
      setFavorites(result);
      setLoading('success');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setLoading('error');
    } finally {
      setIsRefreshing(false);
    }
  }, []);

  const addFavorite = useCallback(async (characterId: string): Promise<boolean> => {
    try {
      await ApiService.addFavorite(characterId);
      // Silent refresh to keep UI stable
      await fetchFavorites(favorites.pagination.page, favorites.pagination.pageSize, true);
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add favorite');
      return false;
    }
  }, [favorites.pagination.page, favorites.pagination.pageSize, fetchFavorites]);

  const removeFavorite = useCallback(async (characterId: string): Promise<boolean> => {
    try {
      await ApiService.deleteFavorite(characterId);
      // Silent refresh to keep UI stable
      await fetchFavorites(favorites.pagination.page, favorites.pagination.pageSize, true);
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to remove favorite');
      return false;
    }
  }, [favorites.pagination.page, favorites.pagination.pageSize, fetchFavorites]);

  useEffect(() => {
    fetchFavorites();
  }, []);

  return { 
    favorites: favorites.data,
    pagination: favorites.pagination,
    loading, 
    error, 
    isRefreshing,
    fetchFavorites,
    addFavorite,
    removeFavorite
  };
};

/**
 * Hook for debouncing values
 */
export const useDebounce = <T,>(value: T, delay: number = 500): T => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};
