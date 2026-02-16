export interface Character {
  id: string;
  name: string;
  height: string;
  mass: string;
  hairColor: string;
  skinColor: string;
  eyeColor: string;
  birthYear: string;
  gender: string;
}

export interface FavoriteCharacter extends Character {
  favoriteId: number;
  addedAt: Date | string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface CharactersResponse {
  characters: Character[];
  total: number;
}

export type LoadingState = 'idle' | 'loading' | 'success' | 'error';
