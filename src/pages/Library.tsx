import { useState } from 'react';
import './Library.css';
import { DownloadCloud, Play, Gamepad2 } from 'lucide-react';
import GameConfigModal from '../components/GameConfigModal';
import EmulatorBoot from '../components/EmulatorBoot';

const mockLibrary = [
  { id: '1', title: 'Cyberpunk 2077', platform: 'steam', status: 'installed', image: 'https://images.unsplash.com/photo-1605806616949-1e87b487cb2a?auto=format&fit=crop&w=500&q=60' },
  { id: '2', title: 'Fortnite', platform: 'epic', status: 'installed', image: 'https://images.unsplash.com/photo-1552820728-8b83bb6b773f?auto=format&fit=crop&w=500&q=60' },
  { id: '3', title: 'The Witcher 3', platform: 'gog', status: 'not_installed', image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=500&q=60' },
];

const Library = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [selectedGameId, setSelectedGameId] = useState<string | null>(null);
  const [isBooting, setIsBooting] = useState(false);

  const filteredGames = activeTab === 'all' 
    ? mockLibrary 
    : mockLibrary.filter(g => g.platform === activeTab);

  const handlePlayClick = (id: string) => {
    setSelectedGameId(id);
  };

  const handleLaunch = () => {
    setIsBooting(true);
  };

  const handleBootComplete = () => {
    setIsBooting(false);
    setSelectedGameId(null);
    alert('Wine Sunucusu Başlatıldı! (Oyun burada açılacak)');
  };

  const selectedGame = mockLibrary.find(g => g.id === selectedGameId);

  return (
    <div className="library-container fade-enter-active">
      <header className="library-header">
        <h1>Kütüphane</h1>
      </header>

      <div className="platform-tabs glass">
        <button className={`tab ${activeTab === 'all' ? 'active' : ''}`} onClick={() => setActiveTab('all')}>Tümü</button>
        <button className={`tab ${activeTab === 'steam' ? 'active' : ''}`} onClick={() => setActiveTab('steam')}>Steam</button>
        <button className={`tab ${activeTab === 'epic' ? 'active' : ''}`} onClick={() => setActiveTab('epic')}>Epic Games</button>
        <button className={`tab ${activeTab === 'gog' ? 'active' : ''}`} onClick={() => setActiveTab('gog')}>GOG</button>
      </div>

      <div className="library-list">
        {filteredGames.map(game => (
          <div key={game.id} className="library-card glass-panel">
            <div className="lib-image" style={{ backgroundImage: `url(${game.image})` }}></div>
            <div className="lib-info">
              <h3>{game.title}</h3>
              <span className="lib-platform">{game.platform.toUpperCase()}</span>
            </div>
            <div className="lib-action">
              {game.status === 'installed' ? (
                <button className="btn-play glass" onClick={() => handlePlayClick(game.id)}><Play size={18} fill="currentColor" /></button>
              ) : (
                <button className="btn-download glass"><DownloadCloud size={18} /></button>
              )}
            </div>
          </div>
        ))}
      </div>

      {selectedGame && !isBooting && (
        <GameConfigModal
          game={selectedGame}
          onClose={() => setSelectedGameId(null)}
          onLaunch={handleLaunch}
        />
      )}

      {isBooting && selectedGame && (
        <EmulatorBoot 
          gameName={selectedGame.title} 
          onBootComplete={handleBootComplete} 
        />
      )}
    </div>
  );
};

export default Library;
