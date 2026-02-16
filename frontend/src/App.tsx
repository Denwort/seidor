import { SearchSection } from './components/SearchSection';
import { FavoritesSection } from './components/FavoritesSection';
import { useCharacterSearch, useFavorites } from './hooks';
import './App.css';

function App() {
  const { 
    characters, 
    loading: searchLoading, 
    error: searchError, 
    searchCharacters 
  } = useCharacterSearch();

  const {
    favorites,
    pagination,
    loading: favoritesLoading,
    error: favoritesError,
    isRefreshing,
    fetchFavorites,
    addFavorite,
    removeFavorite
  } = useFavorites();

  const handleSearch = (search: string) => {
    searchCharacters(search);
  };

  const handleAddFavorite = async (characterId: string): Promise<boolean> => {
    return await addFavorite(characterId);
  };

  const handleRemoveFavorite = async (characterId: string): Promise<boolean> => {
    return await removeFavorite(characterId);
  };

  const handlePageChange = (page: number) => {
    fetchFavorites(page, pagination.pageSize);
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>🌌 SWAPI Favorites</h1>
        <p className="subtitle">
          Explore and save your favorite Star Wars characters
        </p>
      </header>

      <main className="app-main">
        <div className="container">
          <SearchSection
            characters={characters}
            loading={searchLoading === 'loading'}
            error={searchError}
            onSearch={handleSearch}
            onAddFavorite={handleAddFavorite}
          />

          <FavoritesSection
            favorites={favorites}
            pagination={pagination}
            loading={favoritesLoading === 'loading'}
            error={favoritesError}
            isRefreshing={isRefreshing}
            onPageChange={handlePageChange}
            onRemoveFavorite={handleRemoveFavorite}
          />
        </div>
      </main>

      <footer className="app-footer">
        <p>
          Powered by <a href="https://swapi.py4e.com" target="_blank" rel="noopener noreferrer">SWAPI</a>
        </p>
      </footer>
    </div>
  );
}

export default App;
