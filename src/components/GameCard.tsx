import './GameCard.css';
import { Star, Play } from 'lucide-react';

interface GameCardProps {
  id: string;
  title: string;
  category: string;
  rating: number;
  image: string;
  onPlay?: (id: string) => void;
}

const GameCard = ({ id, title, category, rating, image, onPlay }: GameCardProps) => {
  return (
    <div className="game-card glass-panel" onClick={() => onPlay && onPlay(id)}>
      <div className="game-card-image" style={{ backgroundImage: `url(${image})` }}>
        <div className="play-overlay">
          <div className="play-button">
            <Play size={20} fill="currentColor" />
          </div>
        </div>
      </div>
      <div className="game-card-content">
        <h3 className="game-title">{title}</h3>
        <p className="game-category">{category}</p>
        <div className="game-rating">
          <Star size={12} fill="#fbbf24" color="#fbbf24" />
          <span>{rating.toFixed(1)}</span>
        </div>
      </div>
    </div>
  );
};

export default GameCard;
