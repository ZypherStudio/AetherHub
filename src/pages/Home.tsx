import { useState, useRef, useEffect } from 'react';
import './Home.css';
import { 
  LayoutGrid, Gamepad2, Globe, BarChart2, Smile, Info,
  Search, Bell, Wifi, BatteryMedium, Plus, DownloadCloud, Terminal, Activity, Users, HardDrive, BookOpen
} from 'lucide-react';
import EmulatorBoot from '../components/EmulatorBoot';
import GameConfigModal from '../components/GameConfigModal';
import ComponentManager from '../components/ComponentManager';
import AddGameModal from '../components/AddGameModal';
import PlatformConnectModal from '../components/PlatformConnectModal';
import DownloadManager from '../components/DownloadManager';
import type { DownloadItem } from '../components/DownloadManager';
import WinlatorHUD from '../components/WinlatorHUD';
import CommunityConfigs from '../components/CommunityConfigs';
import WineTaskManager from '../components/WineTaskManager';
import HowItWorksModal from '../components/HowItWorksModal';
import GameDetailPanel from '../components/GameDetailPanel';
import SystemConsole from '../components/SystemConsole';

const defaultGames = [
  { id: '1', title: 'Black Myth: Wukong', platform: 'steam', image: 'https://steamcdn-a.akamaihd.net/steam/apps/2358720/library_600x900_2x.jpg', active: true, installed: true },
  { id: '2', title: 'Street Fighter V', platform: 'steam', image: 'https://steamcdn-a.akamaihd.net/steam/apps/310950/library_600x900_2x.jpg', active: false, installed: true },
  { id: '3', title: 'The Witcher 3', platform: 'gog', image: 'https://steamcdn-a.akamaihd.net/steam/apps/292030/library_600x900_2x.jpg', active: false, installed: true },
  { id: '4', title: 'Little Nightmares II', platform: 'steam', image: 'https://steamcdn-a.akamaihd.net/steam/apps/860510/library_600x900_2x.jpg', active: false, installed: true },
  { id: '5', title: 'Ghostwire Tokyo', platform: 'epic', image: 'https://steamcdn-a.akamaihd.net/steam/apps/1475810/library_600x900_2x.jpg', active: false, installed: true },
  { id: '6', title: 'Final Fantasy VII', platform: 'epic', image: 'https://steamcdn-a.akamaihd.net/steam/apps/1462040/library_600x900_2x.jpg', active: false, installed: true },
];

// Load games from localStorage or use defaults
const loadGames = () => {
  try {
    const saved = localStorage.getItem('gamehub_library');
    if (saved) return JSON.parse(saved);
  } catch {}
  return defaultGames;
};

const Home = () => {
  const [games, setGames] = useState(loadGames);
  const [downloads, setDownloads] = useState<DownloadItem[]>([]);
  const [showDownloads, setShowDownloads] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isBooting, setIsBooting] = useState(false);
  const [showConfig, setShowConfig] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showAddGame, setShowAddGame] = useState(false);
  const [showConnectPlatform, setShowConnectPlatform] = useState<'steam'|'epic'|'gog'|null>(null);
  const [viewMode, setViewMode] = useState<'carousel' | 'grid'>('carousel');
  const [activePlatform, setActivePlatform] = useState<string>('all');
  const [controllerConnected, setControllerConnected] = useState(false);
  const [controllerName, setControllerName] = useState('Wireless Controller');
  
  // Top Bar State
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [isOffline, setIsOffline] = useState(false);

  const [showHowItWorks, setShowHowItWorks] = useState(false);
  const [systemStatus, setSystemStatus] = useState<any>(null);
  const [showConsole, setShowConsole] = useState(false);

  // Re-added for Build Stability
  const [showComponents, setShowComponents] = useState(false);
  const [showHUD, setShowHUD] = useState(false);
  const [hudMode, setHudMode] = useState<'normal' | 'detailed' | 'konkr'>('normal');
  const [showCommunityConfigs, setShowCommunityConfigs] = useState(false);
  const [showTaskManager, setShowTaskManager] = useState(false);
  const [useSDCard, setUseSDCard] = useState(false);

  // Check system status (Wine, Box64, etc.)
  useEffect(() => {
    fetch('http://localhost:3001/api/system/status')
      .then(res => res.json())
      .then(data => setSystemStatus(data))
      .catch(err => console.error('System check failed:', err));
  }, []);

  // Persist games to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('gamehub_library', JSON.stringify(games));
  }, [games]);

  const carouselRef = useRef<HTMLDivElement>(null);

  // Real Gamepad API integration
  useEffect(() => {
    const handleGamepadConnected = (e: GamepadEvent) => {
      const id = e.gamepad.id.toLowerCase();
      let brand = "Wireless Controller";
      if (id.includes("xbox") || id.includes("xinput")) brand = "Xbox Wireless Controller";
      else if (id.includes("playstation") || id.includes("dualshock") || id.includes("dualsense") || id.includes("054c")) brand = "PlayStation Controller";
      else if (id.includes("nintendo") || id.includes("pro controller")) brand = "Nintendo Pro Controller";
      
      setControllerName(brand);
      setControllerConnected(true);
    };

    const handleGamepadDisconnected = (e: GamepadEvent) => {
      console.log('Gamepad disconnected:', e.gamepad.id);
      setControllerConnected(false);
    };

    window.addEventListener('gamepadconnected', handleGamepadConnected);
    window.addEventListener('gamepaddisconnected', handleGamepadDisconnected);

    return () => {
      window.removeEventListener('gamepadconnected', handleGamepadConnected);
      window.removeEventListener('gamepaddisconnected', handleGamepadDisconnected);
    };
  }, []);

  // Download simulation loop
  const queueDownload = (game: any) => {
    const dl = { id: Math.random().toString(), game, progress: 0, speed: 0 };
    setDownloads((prev: any) => [...prev, dl]);
    
    const interval = setInterval(() => {
      setDownloads((prev: any) => {
        let hasFinished = false;
        const updated = prev.map((d: any) => {
          if (d.id === dl.id) {
            const newProgress = Math.min(100, d.progress + Math.random() * 5);
            if (newProgress >= 100) hasFinished = true;
            return { ...d, progress: newProgress, speed: 15 + Math.random() * 20 };
          }
          return d;
        });

        if (hasFinished) {
          clearInterval(interval);
          setGames((p: any) => p.map((g: any) => g.id === game.id ? { ...g, installed: true } : g));
          return updated.filter((d: any) => d.progress < 100);
        }
        return updated;
      });
    }, 1000);
    setShowDownloads(true);
  };

  // Use current time
  const [time, setTime] = useState('');
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    };
    updateTime();
    const interval = setInterval(updateTime, 60000);
    return () => clearInterval(interval);
  }, []);

  const handleScroll = () => {
    if (!carouselRef.current) return;
    const scrollLeft = carouselRef.current.scrollLeft;
    const itemWidth = 200 + 16; // width + gap
    const index = Math.round(scrollLeft / itemWidth);
    if (index !== selectedIndex && index >= 0 && index < filteredGames.length) {
      setSelectedIndex(index);
    }
  };

  const handleLaunchOrInstall = async () => {
    if (!selectedGame) return;
    
    if (selectedGame.installed) {
      setIsBooting(true);
      // Real Launch
      fetch('http://localhost:3001/api/system/launch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ gamePath: `C:/Games/${selectedGame.title}/game.exe` })
      });
    } else {
      // Real Install trigger
      try {
        const res = await fetch('http://localhost:3001/api/system/install', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            platform: selectedGame.platform, 
            gameId: selectedGame.id,
            title: selectedGame.title 
          })
        });
        const data = await res.json();
        
        if (data.status === 'started') {
          queueDownload(selectedGame);
          setShowDownloads(true);
          setShowConsole(true); // Auto-open console on install
        }
      } catch (err) {
        console.error('Real install failed, falling back to simulation:', err);
        queueDownload(selectedGame);
      }
    }
  };

  const handleGameAdded = (newGame: any) => {
    const gameWithInstall = { ...newGame, installed: false };
    setGames((prev: any) => [...prev, gameWithInstall]);
    queueDownload(gameWithInstall);
  };

  const filteredGames = games.filter(g => {
    if (activePlatform !== 'all' && g.platform !== activePlatform) return false;
    if (searchQuery && !g.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  // If selected index is out of bounds due to filter, reset it
  useEffect(() => {
    if (selectedIndex >= filteredGames.length && filteredGames.length > 0) {
      setSelectedIndex(Math.max(0, filteredGames.length - 1));
    }
  }, [filteredGames.length, selectedIndex]);

  const selectedGame = filteredGames[selectedIndex];

  return (
    <div className="dashboard-container">
      {/* Dynamic Background Blur */}
      {selectedGame ? (
        <div 
          className="bg-layer" 
          style={{ backgroundImage: `url(${selectedGame.image})` }}
        />
      ) : (
        <div className="bg-layer empty-bg" />
      )}
      <div className="bg-overlay" />
      <div className="content-layer">
        
        {/* TOP BAR */}
        <header className="top-bar">
          <div className="nav-left">
            <div className={`nav-item ${viewMode === 'grid' ? 'active' : ''}`} onClick={() => setViewMode(prev => prev === 'grid' ? 'carousel' : 'grid')}>
              <LayoutGrid size={20} />
              <span>Library</span>
            </div>
            <div className={`nav-item ${viewMode === 'carousel' ? 'active' : ''}`} onClick={() => setViewMode('carousel')}><Gamepad2 size={20} /></div>
            <div className="nav-item" onClick={() => setShowComponents(true)} title="Component Manager"><Globe size={20} /></div>
            <div className="nav-item" onClick={() => { setShowHUD(true); setHudMode(p => p === 'normal' ? 'detailed' : p === 'detailed' ? 'konkr' : 'normal'); }} title="Performance HUD"><BarChart2 size={20} /></div>
            <div className="nav-item" onClick={() => setShowCommunityConfigs(true)} title="Community Configs"><Users size={20} /></div>
            <div className="nav-item" onClick={() => setShowTaskManager(true)} title="Wine Task Manager"><Terminal size={20} /></div>
            <div className="nav-item" onClick={() => setShowHowItWorks(true)} title="Nasıl Çalışır?"><BookOpen size={20} /></div>
            <div className="nav-item" onClick={() => setShowSettings(true)} title="Ayarlar"><Smile size={20} /></div>
          </div>
          
          <div className="nav-right">
            {showSearch ? (
              <div className="search-bar">
                <input 
                  type="text" 
                  autoFocus
                  placeholder="Search library..." 
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  onBlur={() => !searchQuery && setShowSearch(false)}
                />
              </div>
            ) : (
              <Search size={18} onClick={() => setShowSearch(true)} style={{cursor:'pointer'}} />
            )}
            
            <div className="nav-item" onClick={() => setShowDownloads(!showDownloads)} style={{position: 'relative'}}>
              <DownloadCloud size={20} color={downloads.length > 0 ? '#66c0f4' : 'white'} />
              {downloads.length > 0 && <span className="dl-badge">{downloads.length}</span>}
            </div>
            <button className="icon-button" onClick={() => setShowAddGame(true)}>
              <Plus size={20} />
            </button>
            
            <div className="nav-item" onClick={() => setShowNotifications(!showNotifications)} style={{position: 'relative'}}>
              <Bell size={18} />
              <span className="dl-badge" style={{background: '#ffbd2e'}}>2</span>
              {showNotifications && (
                <div className="notifications-dropdown">
                  <div className="notif-item"><b>System:</b> DXVK 2.3 Update Available</div>
                  <div className="notif-item"><b>Wine:</b> Turnip Driver v24.1.0 Installed</div>
                </div>
              )}
            </div>

            <Gamepad2 size={18} color={controllerConnected ? '#10b981' : 'white'} />
            <span className="time-text">{time}</span>
            <Wifi size={18} color={isOffline ? '#666' : 'white'} onClick={() => setIsOffline(!isOffline)} style={{cursor: 'pointer'}} />
            <div className="battery-indicator">
              {systemStatus && (
                <div className="system-status-pills">
                  <span className={`status-pill ${systemStatus.wine ? 'ok' : 'err'}`}>WINE</span>
                  <span className={`status-pill ${systemStatus.box64 ? 'ok' : 'err'}`}>BOX64</span>
                  <span className="status-pill storage">{systemStatus.storage.free} FREE</span>
                </div>
              )}
              <BatteryMedium size={18} />
              <span>86%</span>
            </div>
          </div>
        </header>

        {/* PLATFORM FILTERS */}
        <div className="platform-filters">
          <button className={`plat-btn ${activePlatform === 'all' ? 'active' : ''}`} onClick={() => setActivePlatform('all')}>All Games</button>
          <button className={`plat-btn ${activePlatform === 'steam' ? 'active' : ''}`} onClick={() => setActivePlatform('steam')}>Steam</button>
          <button className={`plat-btn ${activePlatform === 'epic' ? 'active' : ''}`} onClick={() => setActivePlatform('epic')}>Epic Games</button>
          <button className={`plat-btn ${activePlatform === 'gog' ? 'active' : ''}`} onClick={() => setActivePlatform('gog')}>GOG</button>
          <button className={`plat-btn ${activePlatform === 'iso' ? 'active' : ''}`} onClick={() => setActivePlatform('iso')}>Local (ISO)</button>
        </div>

        {/* PLATFORM CONNECT BANNER */}
        {activePlatform !== 'all' && activePlatform !== 'iso' && (
          <div className="platform-connect-banner">
            <div className="banner-info">
              <h3>{activePlatform.toUpperCase()} Library</h3>
              <p>Sync your {activePlatform.toUpperCase()} account to automatically import and play your games.</p>
            </div>
            <button className="console-btn primary" onClick={() => setShowConnectPlatform(activePlatform as 'steam'|'epic'|'gog')}>
              <span className="btn-console-icon">Y</span>
              Connect Account
            </button>
          </div>
        )}

        {/* CONTROLLER NOTIFICATION */}
        {controllerConnected && (
          <div className="controller-toast">
            <Gamepad2 size={16} />
            <span>{controllerName} Connected</span>
          </div>
        )}

        {/* MAIN VIEW AREA */}
        {filteredGames.length === 0 ? (
          <div className="empty-state-view">
            <h2>No games found for {activePlatform === 'iso' ? 'Local (ISO)' : activePlatform.toUpperCase()}</h2>
            <p>Click the + icon in the top right or connect your account to install games.</p>
            <button className="console-btn primary" onClick={() => setShowAddGame(true)}>
              <span className="btn-console-icon">+</span>
              Install Game
            </button>
          </div>
        ) : viewMode === 'carousel' ? (
          <div className="carousel-container" ref={carouselRef} onScroll={handleScroll}>
            <div className="carousel-spacer"></div>
            {filteredGames.map((game, idx) => {
              const isSelected = idx === selectedIndex;
              return (
                <div 
                  key={game.id} 
                  className={`game-cover-wrapper ${isSelected ? 'selected' : ''}`}
                  onClick={() => {
                    setSelectedIndex(idx);
                    carouselRef.current?.scrollTo({ left: idx * 216, behavior: 'smooth' });
                  }}
                >
                  <div className={`game-cover ${!game.image ? 'no-cover' : ''}`} style={{ backgroundImage: game.image ? `url(${game.image})` : 'none' }}>
                    {!game.image && <span className="cover-fallback-title">{game.title}</span>}
                    <div className={`platform-badge ${game.platform}`}>{game.platform.toUpperCase()}</div>
                  </div>
                  {isSelected && <div className="game-title-badge">{game.title}</div>}
                </div>
              );
            })}
            <div className="carousel-spacer"></div>
          </div>
        ) : (
          <div className="library-grid">
            <h2 className="grid-title">{activePlatform === 'all' ? 'All Games' : activePlatform.toUpperCase()} ({filteredGames.length})</h2>
            <div className="grid-container">
              {filteredGames.map((game, idx) => (
                <div 
                  key={game.id} 
                  className={`grid-item ${idx === selectedIndex ? 'selected' : ''}`}
                  onClick={() => setSelectedIndex(idx)}
                >
                  <div className={`grid-cover ${!game.image ? 'no-cover' : ''}`} style={{ backgroundImage: game.image ? `url(${game.image})` : 'none' }}>
                    {!game.image && <span className="cover-fallback-title">{game.title}</span>}
                    <div className={`platform-badge ${game.platform}`}>{game.platform.toUpperCase()}</div>
                  </div>
                  <div className="grid-info">
                    <span className="grid-title-text">{game.title}</span>
                    <span className="grid-status">{game.installed ? '✅ Ready' : '📥 Install'}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* GAME DETAIL PANEL — shows when a game is selected */}
        {selectedGame && (
          <GameDetailPanel
            game={selectedGame}
            onInstall={handleLaunchOrInstall}
            onLaunch={() => setIsBooting(true)}
          />
        )}

        {/* BOTTOM BAR */}
        <footer className="bottom-bar">
          <div className="btn-group-left">
            <button className="glass-btn" onClick={() => setShowConfig(true)}>Options / Config</button>
            <button className="glass-btn" onClick={() => setShowComponents(true)}>
              <HardDrive size={14} /> Components
            </button>
            <button className="glass-btn" onClick={() => setShowHowItWorks(true)}>
              <BookOpen size={14} /> Nasıl Çalışır?
            </button>
            <button className="glass-btn" onClick={() => setUseSDCard(!useSDCard)}>
              {useSDCard ? '💾 SD Card' : '📁 Internal'}
            </button>
            <button className="glass-icon-btn" onClick={() => { setShowHUD(!showHUD); }}><Activity size={18} /></button>
          </div>
          
          <div className="btn-group-right">
            <button className="launch-btn" onClick={handleLaunchOrInstall}>
              <span className="btn-console-icon">A</span>
              {selectedGame?.installed ? 'Launch' : 'Install'}
            </button>
          </div>
        </footer>
      </div>

      {showConfig && (
        <GameConfigModal
          game={selectedGame}
          onClose={() => setShowConfig(false)}
          onLaunch={() => {
            setShowConfig(false);
            setIsBooting(true);
          }}
        />
      )}

      {showSettings && (
        <ComponentManager onClose={() => setShowSettings(false)} />
      )}

      {showComponents && (
        <ComponentManager onClose={() => setShowComponents(false)} />
      )}

      {showHUD && (
        <WinlatorHUD mode={hudMode} onClose={() => setShowHUD(false)} />
      )}

      {showCommunityConfigs && (
        <CommunityConfigs onClose={() => setShowCommunityConfigs(false)} />
      )}

      {showTaskManager && (
        <WineTaskManager onClose={() => setShowTaskManager(false)} />
      )}

      {showHowItWorks && (
        <HowItWorksModal onClose={() => setShowHowItWorks(false)} />
      )}

      {showConsole && (
        <SystemConsole onClose={() => setShowConsole(false)} />
      )}

      {showAddGame && (
        <AddGameModal 
          onClose={() => setShowAddGame(false)} 
          onGameAdded={queueDownload}
        />
      )}

      {isBooting && selectedGame && (
        <EmulatorBoot 
          gameName={selectedGame.title} 
          onBootComplete={() => setIsBooting(false)} 
        />
      )}
      {showConnectPlatform && (
        <PlatformConnectModal 
          platform={showConnectPlatform} 
          onClose={() => setShowConnectPlatform(null)} 
          onSuccess={(platform, realGames?) => {
            setShowConnectPlatform(null);
            
            if (realGames && realGames.length > 0) {
              // REAL API DATA from Steam!
              setGames(prev => [...prev, ...realGames]);
              setActivePlatform(platform);
              alert(`✅ ${realGames.length} real games synced from your ${platform.toUpperCase()} account!`);
            } else {
              // Fallback for Epic/GOG (no real API yet)
              let syncedGames: any[] = [];
              if (platform === 'epic') {
                syncedGames = [
                  { id: `epic-1-${Date.now()}`, title: `Fortnite`, platform: 'epic', image: 'https://steamcdn-a.akamaihd.net/steam/apps/271590/library_600x900_2x.jpg', active: false, installed: false },
                ];
              } else if (platform === 'gog') {
                syncedGames = [
                  { id: `gog-1-${Date.now()}`, title: `Baldur's Gate 3`, platform: 'gog', image: 'https://steamcdn-a.akamaihd.net/steam/apps/1086940/library_600x900_2x.jpg', active: false, installed: false }
                ];
              }
              if (syncedGames.length > 0) {
                setGames(prev => [...prev, ...syncedGames]);
                setActivePlatform(platform);
              }
              alert(`${syncedGames.length || 0} games synced from ${platform.toUpperCase()}. Epic/GOG require native OAuth — showing demo data.`);
            }
          }} 
        />
      )}
      {showDownloads && (
        <DownloadManager 
          downloads={downloads} 
          onClose={() => setShowDownloads(false)} 
        />
      )}
    </div>
  );
};

export default Home;
