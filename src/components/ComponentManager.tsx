import { useState } from 'react';
import { X, Search, Download, Trash2, CheckCircle, Package, Cpu, Monitor, Layers } from 'lucide-react';
import './ComponentManager.css';

interface Component {
  id: string;
  name: string;
  version: string;
  type: 'dxvk' | 'vkd3d' | 'box64' | 'fexcore' | 'gpu_driver' | 'wcp';
  source: string;
  installed: boolean;
  size: string;
}

const mockComponents: Component[] = [
  { id: '1', name: 'DXVK', version: '2.3.1', type: 'dxvk', source: 'Arihany WCPHub', installed: true, size: '4.2 MB' },
  { id: '2', name: 'DXVK', version: '2.4-async', type: 'dxvk', source: 'Nightlies by The412Banner', installed: false, size: '4.8 MB' },
  { id: '3', name: 'VKD3D-Proton', version: '2.12', type: 'vkd3d', source: 'Arihany WCPHub', installed: true, size: '6.1 MB' },
  { id: '4', name: 'Box64', version: '0.3.0', type: 'box64', source: 'Official', installed: true, size: '12.4 MB' },
  { id: '5', name: 'FEXCore', version: '2024.01', type: 'fexcore', source: 'Official', installed: false, size: '8.9 MB' },
  { id: '6', name: 'Turnip Adreno', version: '24.1.0', type: 'gpu_driver', source: 'Mesa Turnip', installed: true, size: '15.2 MB' },
  { id: '7', name: 'Freedreno', version: '24.0.5', type: 'gpu_driver', source: 'Mesa Freedreno', installed: false, size: '11.7 MB' },
  { id: '8', name: 'Wine 9.0', version: '9.0-rc1', type: 'wcp', source: 'WineHQ', installed: true, size: '45.3 MB' },
];

const typeColors: Record<string, string> = {
  dxvk: '#3b82f6',
  vkd3d: '#8b5cf6',
  box64: '#10b981',
  fexcore: '#f97316',
  gpu_driver: '#eab308',
  wcp: '#6b7280',
};

interface Props {
  onClose: () => void;
}

const ComponentManager = ({ onClose }: Props) => {
  const [components, setComponents] = useState(mockComponents);
  const [search, setSearch] = useState('');
  const [showDownloader, setShowDownloader] = useState(false);
  const [downloading, setDownloading] = useState<string | null>(null);

  const filtered = components.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.type.toLowerCase().includes(search.toLowerCase())
  );

  const installedCount = components.filter(c => c.installed).length;

  const handleInstall = (id: string) => {
    setDownloading(id);
    setTimeout(() => {
      setComponents(prev => prev.map(c => c.id === id ? { ...c, installed: true } : c));
      setDownloading(null);
    }, 2000);
  };

  const handleUninstall = (id: string) => {
    setComponents(prev => prev.map(c => c.id === id ? { ...c, installed: false } : c));
  };

  return (
    <div className="cm-overlay fade-enter-active">
      <div className="cm-window">
        <div className="cm-header">
          <div className="cm-title-area">
            <Package size={20} />
            <h2>Component Manager</h2>
            <span className="cm-count">{installedCount} installed</span>
          </div>
          <button className="close-btn" onClick={onClose}><X size={20} /></button>
        </div>

        <div className="cm-search">
          <Search size={16} />
          <input
            type="text"
            placeholder="Search components..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        <div className="cm-list">
          {filtered.map(comp => (
            <div key={comp.id} className="cm-card">
              <div className="cm-accent" style={{ background: typeColors[comp.type] }}></div>
              <div className="cm-card-content">
                <div className="cm-card-top">
                  <span className="cm-type-badge" style={{ background: typeColors[comp.type] }}>
                    {comp.type.toUpperCase().replace('_', ' ')}
                  </span>
                  {comp.installed && <CheckCircle size={14} color="#10b981" />}
                </div>
                <div className="cm-card-name">{comp.name} <span className="cm-version">v{comp.version}</span></div>
                <div className="cm-card-meta">
                  <span className="cm-source">{comp.source}</span>
                  <span className="cm-size">{comp.size}</span>
                </div>
                <div className="cm-card-actions">
                  {comp.installed ? (
                    <button className="cm-btn danger" onClick={() => handleUninstall(comp.id)}>
                      <Trash2 size={12} /> Remove
                    </button>
                  ) : downloading === comp.id ? (
                    <button className="cm-btn downloading" disabled>
                      <div className="mini-spinner"></div> Installing...
                    </button>
                  ) : (
                    <button className="cm-btn install" onClick={() => handleInstall(comp.id)}>
                      <Download size={12} /> Install
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="cm-footer">
          <button className="console-btn primary" onClick={() => setShowDownloader(!showDownloader)}>
            <Download size={16} /> Download Components
          </button>
        </div>

        {showDownloader && (
          <div className="cm-downloader">
            <h3>Available Sources</h3>
            <div className="cm-source-list">
              <div className="cm-source-item">
                <Layers size={16} color="#3b82f6" />
                <div>
                  <strong>Arihany WCPHub</strong>
                  <p>DXVK, VKD3D, Box64, FEXCore, GPU Drivers</p>
                </div>
              </div>
              <div className="cm-source-item">
                <Cpu size={16} color="#f97316" />
                <div>
                  <strong>The412Banner Nightlies</strong>
                  <p>Nightly builds, async DXVK, experimental drivers</p>
                </div>
              </div>
              <div className="cm-source-item">
                <Monitor size={16} color="#eab308" />
                <div>
                  <strong>Mesa Turnip / Freedreno</strong>
                  <p>GPU drivers for Adreno chipsets</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ComponentManager;
