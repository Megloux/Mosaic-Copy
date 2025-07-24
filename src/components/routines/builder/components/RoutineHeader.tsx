import React from 'react';
import { Play, Heart, Share2, Download, Clock } from 'lucide-react';
import { formatDuration } from '@/components/routines/builder/utils/formatters';

interface RoutineHeaderProps {
  title: string;
  duration: number;
  onPlay: () => void;
  onFavorite: () => void;
  onShare: () => void;
  onDownload: () => void;
  isFavorite: boolean;
}

/**
 * Spotify-inspired header for the Routine Builder
 * Contains play button, favorite, share, and download options
 */
export const RoutineHeader: React.FC<RoutineHeaderProps> = ({
  title,
  duration,
  onPlay,
  onFavorite,
  onShare,
  onDownload,
  isFavorite
}) => {
  return (
    <div className="flex items-center justify-between p-4 bg-slate-800 rounded-lg mb-4">
      <div className="flex-1">
        <h1 className="text-xl font-bold">{title}</h1>
        <div className="flex items-center text-white/70 mt-1">
          <Clock className="w-4 h-4 mr-1" />
          <span>{formatDuration(duration)}</span>
        </div>
      </div>
      
      <div className="flex space-x-3">
        <button 
          onClick={onFavorite}
          className="p-2 rounded-full hover:bg-white/10 transition-colors"
          aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
        >
          <Heart className={`w-6 h-6 ${isFavorite ? "fill-pink-500 text-pink-500" : "text-white"}`} />
        </button>
        
        <button 
          onClick={onShare}
          className="p-2 rounded-full hover:bg-white/10 transition-colors"
          aria-label="Share routine"
        >
          <Share2 className="w-6 h-6" />
        </button>
        
        <button 
          onClick={onDownload}
          className="p-2 rounded-full hover:bg-white/10 transition-colors"
          aria-label="Download routine"
        >
          <Download className="w-6 h-6" />
        </button>
        
        <button 
          onClick={onPlay}
          className="p-3 rounded-full bg-green-500 hover:bg-green-400 transition-colors"
          aria-label="Start routine"
        >
          <Play className="w-6 h-6 text-black" fill="black" />
        </button>
      </div>
    </div>
  );
};
