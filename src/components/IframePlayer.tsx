import { X } from 'lucide-react';
import './IframePlayer.css';

interface IframePlayerProps {
  url: string;
  onClose: () => void;
}

const IframePlayer = ({ url, onClose }: IframePlayerProps) => {
  return (
    <div className="iframe-overlay fade-enter-active">
      <div className="iframe-header">
        <button className="close-btn glass" onClick={onClose}>
          <X size={24} />
        </button>
      </div>
      <iframe src={url} className="game-iframe" frameBorder="0" allowFullScreen></iframe>
    </div>
  );
};

export default IframePlayer;
