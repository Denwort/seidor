import axios, { AxiosError } from 'axios';
import type { 
  Character, 
  FavoriteCharacter, 
  PaginatedResponse, 
  ApiResponse,
  CharactersResponse 
} from '../types';

// Configure API base URL from environment variable or default to localhost
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export class ApiService {
  /**
   * Search characters from SWAPI (excludes favorites)
   */
  static async searchCharacters(search?: string): Promise<Character[]> {
    try {
      const params = search ? { search } : {};
      const response = await apiClient.get<ApiResponse<CharactersResponse>>('/characters', { params });
      
      if (!response.data.success || !response.data.data) {
        throw new Error(response.data.error || 'Failed to fetch characters');
      }
      
      return response.data.data.characters;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError<ApiResponse>;
        throw new Error(axiosError.response?.data?.error || 'Failed to fetch characters');
      }
      throw error;
    }
  }

  /**
   * Add a character to favorites
   */
  static async addFavorite(characterId: string): Promise<FavoriteCharacter> {
    try {
      const response = await apiClient.post<ApiResponse<FavoriteCharacter>>('/favorites', {
        characterId,
      });
      
      if (!response.data.success || !response.data.data) {
        throw new Error(response.data.error || 'Failed to add favorite');
      }
      
      return response.data.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError<ApiResponse>;
        throw new Error(axiosError.response?.data?.error || 'Failed to add favorite');
      }
      throw error;
    }
  }

  /**
   * Get paginated list of favorites
   */
  static async getFavorites(
    page: number = 1,
    pageSize: number = 10
  ): Promise<PaginatedResponse<FavoriteCharacter>> {
    try {
      const response = await apiClient.get<ApiResponse<PaginatedResponse<FavoriteCharacter>>>(
        '/favorites',
        { params: { page, pageSize } }
      );
      
      if (!response.data.success || !response.data.data) {
        throw new Error(response.data.error || 'Failed to fetch favorites');
      }
      
      return response.data.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError<ApiResponse>;
        throw new Error(axiosError.response?.data?.error || 'Failed to fetch favorites');
      }
      throw error;
    }
  }

  /**
   * Delete a favorite by character ID
   */
  static async deleteFavorite(characterId: string): Promise<void> {
    try {
      const response = await apiClient.delete<ApiResponse>(
        `/favorites/${characterId}`
      );
      
      if (!response.data.success) {
        throw new Error(response.data.error || 'Failed to delete favorite');
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError<ApiResponse>;
        throw new Error(axiosError.response?.data?.error || 'Failed to delete favorite');
      }
      throw error;
    }
  }

}
