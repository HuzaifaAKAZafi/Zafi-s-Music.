import React, { useState, useEffect } from 'react';
import { MediaTrack } from '../types/player';
import { Play, Pause, SkipBack, SkipForward, Heart, X, Car, Mic } from 'lucide-react';

interface DrivingModeModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentTrack: MediaTrack | null;
  isPlaying: boolean;
  onTogglePlay: () => void;
  onNext: () => void;
  onPrev: () => void;
  onToggleFavorite: (trackId: string) => void;
  accentColor: string;
}

export const DrivingModeModal: React.FC<DrivingModeModalProps> = ({
  isOpen,
  onClose,
  currentTrack,
  isPlaying,
  onTogglePlay,
  onNext,
  onPrev,
  onToggleFavorite,
  accentColor
}) => {
  const [currentTimeStr, setCurrentTimeStr] = useState('');
  const [micActive, setMicActive] = useState(false);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTimeStr(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  if (!isOpen || !currentTrack) return null;

  return (
    <div className="fixed inset-0 z-50 bg-[#07090E] text-white flex flex-col justify-between p-6 select-none animate-fadeIn">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center">
            <Car className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs uppercase tracking-widest text-white/50 font-bold">Lark Drive Mode</div>
            <div className="text-xl font-mono font-bold">{currentTimeStr}</div>
          </div>
        </div>

        <button
          onClick={onClose}
          className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-white/10 hover:bg-white/20 active:scale-95 text-white font-bold text-sm transition-transform"
        >
          <X className="w-5 h-5" />
          Exit
        </button>
      </div>

      {/* Center Song Info */}
      <div className="flex flex-col items-center text-center my-auto px-4 max-w-xl mx-auto w-full">
        <div className="relative mb-6">
          <img
            src={currentTrack.coverUrl}
            alt={currentTrack.title}
            className="w-48 h-48 md:w-64 md:h-64 rounded-3xl object-cover shadow-2xl border-2 border-white/10"
          />
          <button
            onClick={() => onToggleFavorite(currentTrack.id)}
            className="absolute -bottom-3 -right-3 w-14 h-14 rounded-2xl bg-black/80 backdrop-blur-md border border-white/20 flex items-center justify-center active:scale-90 transition-transform shadow-lg"
          >
            <Heart
              className={`w-7 h-7 ${currentTrack.isFavorite ? 'fill-rose-500 text-rose-500' : 'text-white/70'}`}
            />
          </button>
        </div>

        <h2 className="text-2xl md:text-4xl font-extrabold tracking-tight truncate w-full mb-2">
          {currentTrack.title}
        </h2>
        <p className="text-lg md:text-xl text-white/60 font-medium truncate w-full">
          {currentTrack.artist}
        </p>
      </div>

      {/* Large Driving Touch Controls */}
      <div className="max-w-2xl mx-auto w-full space-y-4">
        <div className="flex items-center justify-center gap-6 md:gap-10">
          <button
            onClick={onPrev}
            className="w-20 h-20 md:w-24 md:h-24 rounded-3xl bg-white/10 hover:bg-white/15 active:scale-90 flex items-center justify-center transition-all"
            title="Previous Song"
          >
            <SkipBack className="w-10 h-10 md:w-12 md:h-12 text-white" />
          </button>

          <button
            onClick={onTogglePlay}
            style={{ backgroundColor: accentColor }}
            className="w-28 h-28 md:w-32 md:h-32 rounded-3xl active:scale-90 flex items-center justify-center shadow-xl transition-all"
            title={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? (
              <Pause className="w-14 h-14 text-black fill-black" />
            ) : (
              <Play className="w-14 h-14 text-black fill-black ml-1.5" />
            )}
          </button>

          <button
            onClick={onNext}
            className="w-20 h-20 md:w-24 md:h-24 rounded-3xl bg-white/10 hover:bg-white/15 active:scale-90 flex items-center justify-center transition-all"
            title="Next Song"
          >
            <SkipForward className="w-10 h-10 md:w-12 md:h-12 text-white" />
          </button>
        </div>

        {/* Voice Search button */}
        <div className="flex justify-center pt-2">
          <button
            onClick={() => {
              setMicActive(!micActive);
              if (!micActive) {
                setTimeout(() => setMicActive(false), 3000);
              }
            }}
            className={`flex items-center gap-2 px-6 py-3 rounded-2xl transition-all text-sm font-semibold ${
              micActive ? 'bg-rose-500 text-white animate-pulse' : 'bg-white/5 hover:bg-white/10 text-white/70'
            }`}
          >
            <Mic className="w-5 h-5" />
            <span>{micActive ? 'Listening to voice...' : 'Tap for Voice Search'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
