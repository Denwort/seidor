import React, { useState, useEffect } from 'react';
import type { Character } from '../types';
import { CharacterCard } from './CharacterCard';
import { useDebounce } from '../hooks';

interface SearchSectionProps {
  characters: Character[];
  loading: boolean;
  error: string | null;
  onSearch: (search: string) => void;
  onAddFavorite: (id: string) => Promise<boolean>;
}

export const SearchSection: React.FC<SearchSectionProps> = ({
  characters,
  loading,
  error,
  onSearch,
  onAddFavorite
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [addingId, setAddingId] = useState<string | null>(null);
  const debouncedSearch = useDebounce(searchTerm, 500);

  useEffect(() => {
    onSearch(debouncedSearch);
  }, [debouncedSearch, onSearch]);

  const handleAddFavorite = async (id: string) => {
    if (addingId) return; // Prevent multiple additions at the same time

    setAddingId(id);
    try {
      const success = await onAddFavorite(id);
      if (success) {
        // Refresh search to exclude newly added favorite
        onSearch(debouncedSearch);
      }
    } catch (error) {
      console.error('Failed to add favorite:', error);
    } finally {
      setAddingId(null);
    }
  };

  return (
    <div className="search-section">
      <h2>🔍 Search Characters</h2>
      
      <input
        type="text"
        className="search-input"
        placeholder="Search Star Wars characters..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      {loading && (
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Searching...</p>
        </div>
      )}

      {error && (
        <div className="error-state">
          <p>❌ {error}</p>
        </div>
      )}

      {!loading && !error && characters.length === 0 && (
        <div className="empty-state">
          <p>No results found. Try another search.</p>
        </div>
      )}

      {!loading && !error && characters.length > 0 && (
        <div className="characters-grid">
          {characters.map((character) => (
            <CharacterCard
              key={character.id}
              character={character}
            >
              <button
                    className="btn-add-favorite"
                    onClick={() => handleAddFavorite(character.id)}
                    disabled={addingId === character.id || loading}
                  >
                    {addingId === character.id ? '⏳ Adding...' : '⭐ Add'}
                  </button>
            </CharacterCard>
          ))}
        </div>
      )}
    </div>
  );
};
