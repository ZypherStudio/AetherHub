import { useState } from 'react';
import { X, Search, Download, Star, User, Settings } from 'lucide-react';
import './CommunityConfigs.css';

interface GameConfig {
  id: string;
  gameName: string;
  author: string;
  stars: number;
  dxvk: string;
  box64: string;
  driver: string;
  resolution: string;
  notes: string;
}

const mockConfigs: GameConfig[] = [
  { id: '1', gameName: 'Cyberpunk 2077', author: 'Banner412', stars: 45, dxvk: 'DXVK 2.3.1', box64: 'Box64 0.3.0', driver: 'Turnip 24.1.0', resolution: '720p', notes: 'FSR 2.0 ON, Shadows Medium' },
  { id: '2', gameName: 'Elden Ring', author: 'WineGuru', stars: 38, dxvk: 'DXVK 2.3-async', box64: 'Box64 0.3.0', driver: 'Turnip 24.1.0', resolution: '900p', notes: 'Anti-cheat bypass required' },
  { id: '3', gameName: 'GTA V', author: 'MobilePC_TR', stars: 67, dxvk: 'DXVK 2.2', box64: 'Box64 0.2.8', driver: 'Freedreno 24.0.5', resolution: '720p', notes: 'DX11 mode, FXAA only' },
  { id: '4', gameName: 'Red Dead Redemption 2', author: 'SnapGamer', stars: 29, dxvk: 'VKD3D 2.12', box64: 'Box64 0.3.0', driver: 'Turnip 24.1.0', resolution: '540p', notes: 'Vulkan API, Low settings, TDP 15W' },
  { id: '5', gameName: 'The Witcher 3', author: 'LinuxDeck', stars: 52, dxvk: 'DXVK 2.3.1', box64: 'Box64 0.3.0', driver: 'Turnip 24.1.0', resolution: '720p', notes: 'Next-gen update works, Hair OFF' },
];

interface Props {
  onClose: () => void;
}

const CommunityConfigs = ({ onClose }: Props) => {
  const [search, setSearch] = useState('');
  const [appliedId, setAppliedId] = useState<string | null>(null);

  const filtered = mockConfigs.filter(c =>
    c.gameName.toLowerCase().includes(search.toLowerCase()) ||
    c.author.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="cc-overlay fade-enter-active">
      <div className="cc-window">
        <div className="cc-header">
          <div className="cc-title-area">
            <Settings size={20} />
            <h2>Community Game Configs</h2>
          </div>
          <button className="close-btn" onClick={onClose}><X size={20} /></button>
        </div>

        <div className="cc-search">
          <Search size={16} />
          <input placeholder="Search by game or author..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>

        <div className="cc-list">
          {filtered.map(config => (
            <div key={config.id} className={`cc-card ${appliedId === config.id ? 'applied' : ''}`}>
              <div className="cc-card-top">
                <h3>{config.gameName}</h3>
                <div className="cc-stars"><Star size={12} color="#eab308" fill="#eab308" /> {config.stars}</div>
              </div>
              <div className="cc-author"><User size={12} /> {config.author}</div>
              <div className="cc-specs">
                <span className="cc-tag dxvk">{config.dxvk}</span>
                <span className="cc-tag box64">{config.box64}</span>
                <span className="cc-tag driver">{config.driver}</span>
                <span className="cc-tag res">{config.resolution}</span>
              </div>
              <p className="cc-notes">{config.notes}</p>
              <div className="cc-actions">
                <button 
                  className={`console-btn ${appliedId === config.id ? 'secondary' : 'primary'}`}
                  onClick={() => setAppliedId(appliedId === config.id ? null : config.id)}
                >
                  <Download size={14} />
                  {appliedId === config.id ? 'Applied ✓' : 'Apply Config'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CommunityConfigs;
