import { Gamepad2, Clock, HardDrive, Monitor, Cpu, Download } from 'lucide-react';
import './GameDetailPanel.css';

interface GameDetailPanelProps {
  game: any;
  onInstall: () => void;
  onLaunch: () => void;
}

// Simulated compatibility data based on popular game titles
const getCompatibility = (title: string) => {
  const t = title.toLowerCase();
  
  // Known great performers
  if (['skyrim', 'portal', 'stardew', 'terraria', 'undertale', 'hollow knight', 'celeste', 'hades', 'prison architect'].some(g => t.includes(g))) {
    return { level: 'perfect', label: 'Mükemmel', color: '#10b981', fps: '30-60 FPS', emoji: '🟢' };
  }
  
  // Known playable
  if (['witcher', 'dark souls', 'gta', 'dying light', 'fallout', 'resident evil', 'devil may cry', 'combat master', 'warband', 'final fantasy'].some(g => t.includes(g))) {
    return { level: 'playable', label: 'Oynanabilir', color: '#f59e0b', fps: '20-30 FPS', emoji: '🟡' };
  }
  
  // Known problematic
  if (['cyberpunk', 'elden ring', 'alan wake', 'starfield', 'spider-man', 'hogwarts'].some(g => t.includes(g))) {
    return { level: 'problematic', label: 'Ağır / Sorunlu', color: '#ef4444', fps: '10-20 FPS', emoji: '🔴' };
  }
  
  // Anti-cheat blocked
  if (['fortnite', 'valorant', 'apex legends', 'destiny'].some(g => t.includes(g))) {
    return { level: 'broken', label: 'Çalışmıyor (Anti-Cheat)', color: '#6b7280', fps: '-', emoji: '⚫' };
  }
  
  // Unknown - default to playable
  return { level: 'unknown', label: 'Test Edilmedi', color: '#8b5cf6', fps: '~25 FPS', emoji: '🟣' };
};

const getRecommendedSettings = (title: string) => {
  const t = title.toLowerCase();
  const isHeavy = ['cyberpunk', 'elden ring', 'alan wake', 'starfield', 'red dead'].some(g => t.includes(g));
  const isMedium = ['witcher', 'gta', 'dying light', 'dark souls'].some(g => t.includes(g));

  return {
    resolution: isHeavy ? '540p' : isMedium ? '720p' : '720p-900p',
    dxvk: 'DXVK 2.61+',
    fsr: isHeavy ? 'FSR Performance' : isMedium ? 'FSR Balanced' : 'FSR Quality / Kapalı',
    proton: 'Proton 11 ARM',
    renderer: t.includes('dx12') || isHeavy ? 'VKD3D (DX12)' : 'DXVK (DX11)',
  };
};

const formatPlaytime = (minutes: number) => {
  if (!minutes) return null;
  const hours = Math.floor(minutes / 60);
  if (hours > 0) return `${hours} saat ${minutes % 60} dk`;
  return `${minutes} dakika`;
};

const GameDetailPanel = ({ game, onInstall, onLaunch }: GameDetailPanelProps) => {
  if (!game) return null;
  
  const compat = getCompatibility(game.title);
  const settings = getRecommendedSettings(game.title);
  const playtime = formatPlaytime(game.playtimeMinutes);

  return (
    <div className="gdp-container">
      <div className="gdp-left">
        <div className="gdp-cover" style={{ backgroundImage: game.image ? `url(${game.image})` : 'none' }}>
          {!game.image && <span className="gdp-cover-title">{game.title}</span>}
        </div>
      </div>
      
      <div className="gdp-right">
        <div className="gdp-title-row">
          <h2 className="gdp-title">{game.title}</h2>
          <span className={`gdp-platform ${game.platform}`}>{game.platform.toUpperCase()}</span>
        </div>

        <div className="gdp-compat-bar">
          <span className="gdp-compat-badge" style={{ background: compat.color + '22', color: compat.color, borderColor: compat.color + '44' }}>
            {compat.emoji} {compat.label}
          </span>
          {compat.fps !== '-' && (
            <span className="gdp-fps">{compat.fps} @ 720p</span>
          )}
          {playtime && (
            <span className="gdp-playtime"><Clock size={12} /> {playtime}</span>
          )}
        </div>

        <div className="gdp-settings-grid">
          <div className="gdp-setting">
            <Monitor size={14} />
            <div>
              <span className="gdp-label">Çözünürlük</span>
              <span className="gdp-value">{settings.resolution}</span>
            </div>
          </div>
          <div className="gdp-setting">
            <HardDrive size={14} />
            <div>
              <span className="gdp-label">Grafik API</span>
              <span className="gdp-value">{settings.renderer}</span>
            </div>
          </div>
          <div className="gdp-setting">
            <Cpu size={14} />
            <div>
              <span className="gdp-label">Uyumluluk</span>
              <span className="gdp-value">{settings.proton}</span>
            </div>
          </div>
          <div className="gdp-setting">
            <Gamepad2 size={14} />
            <div>
              <span className="gdp-label">FSR Modu</span>
              <span className="gdp-value">{settings.fsr}</span>
            </div>
          </div>
        </div>

        <div className="gdp-actions">
          {game.installed ? (
            <button className="gdp-btn launch" onClick={onLaunch}>
              ▶ Oyunu Başlat
            </button>
          ) : (
            <button className="gdp-btn install" onClick={onInstall}>
              <Download size={16} /> Yükle
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default GameDetailPanel;
