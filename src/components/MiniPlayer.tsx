import React from 'react';
import { MediaTrack } from '../types/player';
import { Play, Pause, SkipForward, Sliders } from 'lucide-react';
import { AudioVisualizer } from './AudioVisualizer';

interface MiniPlayerProps {
  track: MediaTrack | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  onTogglePlay: () => void;
  onNext: () => void;
  onExpand: () => void;
  onOpenEqualizer: () => void;
  accentColor: string;
}

export const MiniPlayer: React.FC<MiniPlayerProps> = ({
  track,
  isPlaying,
  currentTime,
  duration,
  onTogglePlay,
  onNext,
  onExpand,
  onOpenEqualizer,
  accentColor
}) => {
  if (!track) return null;

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="relative w-full bg-black/50 backdrop-blur-2xl border-t border-white/15 shadow-[0_-8px_32px_rgba(0,0,0,0.5)] z-30 transition-all overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 py-2.5 flex items-center justify-between gap-3">
        {/* Track Info (Click expands to full Now Playing) */}
        <div
          onClick={onExpand}
          className="flex items-center gap-3 flex-1 min-w-0 cursor-pointer group"
        >
          {/* Album artwork disc */}
          <div className="relative w-11 h-11 rounded-xl overflow-hidden shadow-md shrink-0 border border-white/10">
            <img
              src={track.coverUrl}
              alt={track.title}
              className={`w-full h-full object-cover transition-transform ${
                isPlaying ? 'scale-105' : ''
              }`}
            />
          </div>

          <div className="min-w-0 flex-1">
            <h4 className="text-sm font-bold text-white truncate group-hover:text-cyan-300 transition-colors">
              {track.title}
            </h4>
            <p className="text-xs text-white/50 truncate font-medium">{track.artist}</p>
          </div>
        </div>

        {/* Real-time mini spectrum bar */}
        <div className="hidden sm:block w-24 px-2" onClick={onExpand}>
          <AudioVisualizer isPlaying={isPlaying} barColor={accentColor} barCount={12} height={20} />
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1 shrink-0">
          {/* Quick EQ */}
          <button
            onClick={onOpenEqualizer}
            className="p-2 rounded-xl text-white/50 hover:text-white hover:bg-white/10 transition-colors"
            title="Open Equalizer"
          >
            <Sliders className="w-4 h-4" />
          </button>

          {/* Play/Pause */}
          <button
            onClick={onTogglePlay}
            style={{ backgroundColor: accentColor }}
            className="w-10 h-10 rounded-full flex items-center justify-center active:scale-90 text-black shadow-lg transition-transform ml-1"
            title={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? (
              <Pause className="w-5 h-5 fill-black" />
            ) : (
              <Play className="w-5 h-5 fill-black ml-0.5" />
            )}
          </button>

          {/* Next */}
          <button
            onClick={onNext}
            className="p-2 rounded-xl text-white/70 hover:text-white hover:bg-white/10 active:scale-90 transition-transform"
            title="Next Track"
          >
            <SkipForward className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Subtle bottom progress bar indicating playback position */}
      <div className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-white/10 w-full overflow-hidden">
        <div
          className="h-full transition-all duration-200 relative"
          style={{
            width: `${Math.min(100, Math.max(0, progressPercent))}%`,
            backgroundColor: accentColor,
            boxShadow: `0 0 6px ${accentColor}`
          }}
        />
      </div>
    </div>
  );
};
