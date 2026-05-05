import { DownloadCloud, X } from 'lucide-react';
import './DownloadManager.css';

export interface DownloadItem {
  id: string;
  game: any;
  progress: number;
  speed: number;
}

interface DownloadManagerProps {
  downloads: DownloadItem[];
  onClose: () => void;
}

const DownloadManager = ({ downloads, onClose }: DownloadManagerProps) => {
  if (downloads.length === 0) return null;

  return (
    <div className="download-manager fade-enter-active">
      <div className="dm-header">
        <div className="dm-title">
          <DownloadCloud size={18} />
          <span>Active Downloads ({downloads.length})</span>
        </div>
        <button className="dm-close" onClick={onClose}><X size={16} /></button>
      </div>
      <div className="dm-list">
        {downloads.map(dl => (
          <div key={dl.id} className="dm-item">
            <div className="dm-cover" style={{backgroundImage: `url(${dl.game.image})`}}></div>
            <div className="dm-info">
              <div className="dm-game-title">{dl.game.title}</div>
              <div className="dm-stats">
                <span>{dl.progress.toFixed(1)}%</span>
                <span>{dl.speed.toFixed(1)} MB/s</span>
              </div>
              <div className="dm-progress-bar-container">
                <div className="dm-progress-bar" style={{width: `${dl.progress}%`}}></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DownloadManager;
