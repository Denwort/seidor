import React, { useState } from 'react';
import type { FavoriteCharacter } from '../types';
import { CharacterCard } from './CharacterCard';

interface FavoritesSectionProps {
  favorites: FavoriteCharacter[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
  loading: boolean;
  error: string | null;
  isRefreshing: boolean;
  onPageChange: (page: number) => void;
  onRemoveFavorite: (characterId: string) => Promise<boolean>;
}

export const FavoritesSection: React.FC<FavoritesSectionProps> = ({
  favorites,
  pagination,
  loading,
  error,
  isRefreshing,
  onPageChange,
  onRemoveFavorite
}) => {
  const [removingId, setRemovingId] = useState<string | null>(null);

  const handleRemoveFavorite = async (characterId: string) => {
    if (removingId) return; // Prevent multiple removals

    setRemovingId(characterId);
    try {
      const success = await onRemoveFavorite(characterId);
      if (!success) {
        alert('Failed to remove favorite. Please try again.');
      }
    } catch (error) {
      console.error('Failed to remove favorite:', error);
    } finally {
      setRemovingId(null);
    }
  };

  return (
    <div className="favorites-section">
      <h2>⭐ My Favorites</h2>

      {loading && favorites.length === 0 && (
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Loading favorites...</p>
        </div>
      )}

      {error && (
        <div className="error-state">
          <p>❌ {error}</p>
        </div>
      )}

      {!loading && !error && favorites.length === 0 && (
        <div className="empty-state">
          <p>No favorites added yet.</p>
          <p>Start exploring characters!</p>
        </div>
      )}

      {favorites.length > 0 && (
        <>
          <div className="favorites-info">
            <p>
              Showing {favorites.length} of {pagination.total} favorites
              {isRefreshing && <span className="refreshing-indicator"> • Updating...</span>}
            </p>
          </div>

          <div className={`characters-grid ${isRefreshing ? 'refreshing' : ''}`}>
            {favorites.map((favorite) => (
              <div 
                key={favorite.favoriteId} 
                className={`favorite-card-wrapper ${removingId === favorite.id ? 'removing' : ''}`}
              >
                <CharacterCard
                  character={favorite}
                >
                  <button
                    className="btn-remove"
                    onClick={() => handleRemoveFavorite(favorite.id)}
                    disabled={removingId === favorite.id || isRefreshing}
                  >
                    {removingId === favorite.id ? '⏳ Removing...' : '🗑️ Remove'}
                  </button>
                </CharacterCard>
              </div>
            ))}
          </div>

          {pagination.totalPages > 1 && (
            <div className="pagination">
              <button
                className="btn-pagination"
                onClick={() => onPageChange(pagination.page - 1)}
                disabled={pagination.page === 1 || loading || isRefreshing}
              >
                ← Previous
              </button>
              
              <span className="pagination-info">
                Page {pagination.page} of {pagination.totalPages}
              </span>
              
              <button
                className="btn-pagination"
                onClick={() => onPageChange(pagination.page + 1)}
                disabled={pagination.page === pagination.totalPages || loading || isRefreshing}
              >
                Next →
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};
