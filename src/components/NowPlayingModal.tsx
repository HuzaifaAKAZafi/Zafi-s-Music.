import React, { useState } from 'react';
import { MediaTrack, PlaybackMode, LyricLine } from '../types/player';
import { formatTime } from '../utils/formatters';
import {
  ChevronDown,
  Heart,
  Shuffle,
  Repeat,
  Repeat1,
  SkipBack,
  SkipForward,
  Play,
  Pause,
  Sliders,
  Moon,
  ListMusic,
  Scissors,
  Music2,
  FileText,
  Gauge
} from 'lucide-react';
import { AudioVisualizer } from './AudioVisualizer';
import { MusicVisualizer } from './MusicVisualizer';
import { LyricsViewer } from './LyricsViewer';

interface NowPlayingModalProps {
  isOpen: boolean;
  onClose: () => void;
  track: MediaTrack | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  playbackMode: PlaybackMode;
  playbackRate: number;
  queue: MediaTrack[];
  onTogglePlay: () => void;
  onSeek: (time: number) => void;
  onNext: () => void;
  onPrev: () => void;
  onToggleFavorite: (id: string) => void;
  onTogglePlaybackMode: () => void;
  onChangePlaybackRate: (rate: number) => void;
  onSelectQueueTrack: (track: MediaTrack) => void;
  onOpenEqualizer: () => void;
  onOpenSleepTimer: () => void;
  onOpenRingtoneCutter: (track: MediaTrack) => void;
  onUpdateLyrics: (newLyrics: LyricLine[]) => void;
  accentColor: string;
}

export const NowPlayingModal: React.FC<NowPlayingModalProps> = ({
  isOpen,
  onClose,
  track,
  isPlaying,
  currentTime,
  duration,
  playbackMode,
  playbackRate,
  queue,
  onTogglePlay,
  onSeek,
  onNext,
  onPrev,
  onToggleFavorite,
  onTogglePlaybackMode,
  onChangePlaybackRate,
  onSelectQueueTrack,
  onOpenEqualizer,
  onOpenSleepTimer,
  onOpenRingtoneCutter,
  onUpdateLyrics,
  accentColor
}) => {
  const [viewMode, setViewMode] = useState<'cover' | 'visualizer' | 'lyrics'>('cover');
  const [visualizerMode, setVisualizerMode] = useState<'bars' | 'wave' | 'circle' | 'fire'>('fire');
  const [showQueue, setShowQueue] = useState(false);
  const [showSpeedMenu, setShowSpeedMenu] = useState(false);

  if (!isOpen || !track) return null;

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;
  const speeds = [0.5, 0.75, 1.0, 1.25, 1.5, 2.0];

  return (
    <div className="fixed inset-0 z-40 bg-black/65 backdrop-blur-3xl text-white flex flex-col justify-between overflow-hidden animate-slideUp">
      {/* Dynamic blurred backdrop image */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-30 blur-3xl scale-125 pointer-events-none transition-all duration-700"
        style={{ backgroundImage: `url(${track.coverUrl})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/60 to-black/85 pointer-events-none" />

      {/* Top Navigation Bar */}
      <div className="relative z-10 flex items-center justify-between px-6 py-4 shrink-0">
        <button
          onClick={onClose}
          className="p-2 -ml-2 rounded-2xl bg-white/5 hover:bg-white/10 active:scale-95 text-white/80 hover:text-white transition-all border border-white/10 shadow-md"
          title="Minimize player"
        >
          <ChevronDown className="w-6 h-6" />
        </button>

        {/* Center Mode Switch (Cover vs Visualizer vs Lyrics) */}
        <div className="flex items-center p-1 bg-white/[0.07] backdrop-blur-2xl rounded-2xl border border-white/10 shadow-lg">
          <button
            onClick={() => setViewMode('cover')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              viewMode === 'cover' ? 'bg-white/20 text-white shadow-sm font-bold' : 'text-white/60 hover:text-white'
            }`}
          >
            <Music2 className="w-3.5 h-3.5" />
            <span>Cover</span>
          </button>
          <button
            onClick={() => setViewMode('visualizer')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              viewMode === 'visualizer' ? 'bg-white/20 text-white shadow-sm font-bold' : 'text-white/60 hover:text-white'
            }`}
          >
            <Gauge className="w-3.5 h-3.5" />
            <span>Visualizer</span>
          </button>
          <button
            onClick={() => setViewMode('lyrics')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              viewMode === 'lyrics' ? 'bg-white/20 text-white shadow-sm font-bold' : 'text-white/60 hover:text-white'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Lyrics</span>
          </button>
        </div>

        {/* Queue Drawer Toggle */}
        <button
          onClick={() => setShowQueue(!showQueue)}
          className={`p-2 -mr-2 rounded-2xl transition-all border border-white/10 ${
            showQueue ? 'bg-white/20 text-white' : 'bg-white/5 hover:bg-white/10 text-white/80'
          }`}
          title="Current Queue"
        >
          <ListMusic className="w-6 h-6" />
        </button>
      </div>

      {/* Main Center Area */}
      <div className="relative z-10 flex-1 flex flex-col justify-center items-center px-6 overflow-hidden">
        {showQueue ? (
          /* Queue Drawer */
          <div className="w-full max-w-md h-full flex flex-col bg-black/40 backdrop-blur-xl rounded-3xl border border-white/10 p-4 overflow-hidden animate-fadeIn">
            <div className="flex items-center justify-between pb-3 border-b border-white/10 shrink-0">
              <h3 className="font-bold text-sm">Playing Queue ({queue.length})</h3>
              <span className="text-xs text-white/50">Tap to play track</span>
            </div>
            <div className="overflow-y-auto space-y-2 py-3 flex-1 pr-1">
              {queue.map((item, idx) => {
                const isCurrent = item.id === track.id;
                return (
                  <div
                    key={item.id + idx}
                    onClick={() => onSelectQueueTrack(item)}
                    className={`flex items-center gap-3 p-2.5 rounded-2xl cursor-pointer transition-all ${
                      isCurrent
                        ? 'bg-white/15 border border-white/20 shadow-md'
                        : 'hover:bg-white/5 border border-transparent'
                    }`}
                  >
                    <img
                      src={item.coverUrl}
                      alt={item.title}
                      className="w-10 h-10 rounded-xl object-cover shrink-0"
                    />
                    <div className="flex-1 truncate">
                      <div
                        className={`text-sm font-semibold truncate ${
                          isCurrent ? 'font-bold' : 'text-white'
                        }`}
                        style={{ color: isCurrent ? accentColor : undefined }}
                      >
                        {item.title}
                      </div>
                      <div className="text-xs text-white/50 truncate">{item.artist}</div>
                    </div>
                    <span className="text-xs font-mono text-white/40 shrink-0">
                      {formatTime(item.duration)}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        ) : viewMode === 'visualizer' ? (
          /* Full Screen Interactive Music Visualizer View */
          <div className="w-full max-w-md h-full flex flex-col justify-between py-2 space-y-3">
            <div className="text-center shrink-0">
              <h3 className="text-sm font-bold text-white flex items-center justify-center gap-1.5">
                <span>Real-Time Audio Spectrum</span>
              </h3>
              <p className="text-[11px] text-white/50">Reacts dynamically to bass, rhythm, and harmonies</p>
            </div>

            <div className="flex-1 w-full flex items-center justify-center min-h-[220px]">
              <MusicVisualizer
                isPlaying={isPlaying}
                accentColor={accentColor}
                mode={visualizerMode}
                onModeChange={(m) => setVisualizerMode(m)}
                height={240}
                showControls={true}
                className="w-full h-full border border-white/15 shadow-2xl"
              />
            </div>
          </div>
        ) : viewMode === 'lyrics' ? (
          /* Lyrics View */
          <div className="w-full max-w-md h-full bg-black/40 backdrop-blur-2xl rounded-3xl border border-white/10 overflow-hidden flex flex-col shadow-2xl">
            <LyricsViewer
              lyrics={track.lyrics}
              currentTime={currentTime}
              onSeek={onSeek}
              onUpdateLyrics={onUpdateLyrics}
              accentColor={accentColor}
              songTitle={track.title}
            />
          </div>
        ) : (
          /* Album Cover & Vinyl Record View */
          <div className="flex flex-col items-center justify-center w-full max-w-md">
            {/* Spinning Vinyl Record with Album Center */}
            <div className="relative w-64 h-64 md:w-80 md:h-80 flex items-center justify-center my-auto">
              {/* Outer Vinyl Grooves */}
              <div
                className={`w-full h-full rounded-full bg-gradient-to-tr from-[#121216] via-[#1F212E] to-[#121216] p-4 shadow-2xl border-4 border-white/15 flex items-center justify-center animate-spin-slow ${
                  !isPlaying ? 'animation-paused' : ''
                }`}
              >
                {/* Vinyl Grooves pattern */}
                <div className="w-full h-full rounded-full border border-white/10 flex items-center justify-center p-3">
                  <div className="w-full h-full rounded-full border border-white/5 flex items-center justify-center p-3">
                    {/* Center Album Art Thumbnail */}
                    <div className="relative w-36 h-36 md:w-44 md:h-44 rounded-full overflow-hidden shadow-2xl border-2 border-white/30">
                      <img
                        src={track.coverUrl}
                        alt={track.title}
                        className="w-full h-full object-cover"
                      />
                      {/* Center Spindle Hole */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-6 h-6 rounded-full bg-[#0B0D14] border-2 border-white/80 shadow-md" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Audio Spectrum Visualizer */}
            <div className="w-full px-6 mt-4">
              <MusicVisualizer
                isPlaying={isPlaying}
                accentColor={accentColor}
                height={34}
                mode="bars"
                showControls={false}
                className="bg-transparent border-0 shadow-none"
              />
            </div>
          </div>
        )}
      </div>

      {/* Bottom Player Controls Section */}
      <div className="relative z-10 w-full max-w-md mx-auto px-6 pb-6 pt-2 shrink-0 space-y-4">
        {/* Track Title & Favorite Action */}
        <div className="flex items-center justify-between">
          <div className="truncate pr-4">
            <h2 className="text-xl md:text-2xl font-bold truncate tracking-tight">{track.title}</h2>
            <p className="text-sm text-white/60 truncate font-medium mt-0.5">{track.artist}</p>
          </div>
          <button
            onClick={() => onToggleFavorite(track.id)}
            className="p-2.5 rounded-2xl bg-white/5 hover:bg-white/10 active:scale-90 transition-transform text-white/70 hover:text-white"
            title="Favorite"
          >
            <Heart
              className={`w-6 h-6 transition-colors ${
                track.isFavorite ? 'fill-rose-500 text-rose-500' : 'text-white/60'
              }`}
            />
          </button>
        </div>

        {/* Progress Scrubbing Bar */}
        <div className="space-y-1.5">
          <div className="relative flex items-center">
            <input
              type="range"
              min={0}
              max={duration || 100}
              step={0.5}
              value={currentTime}
              onChange={(e) => onSeek(parseFloat(e.target.value))}
              className="w-full h-1.5 bg-white/20 rounded-lg cursor-pointer transition-all"
              style={{
                accentColor: accentColor,
                background: `linear-gradient(to right, ${accentColor} 0%, ${accentColor} ${progressPercent}%, rgba(255, 255, 255, 0.2) ${progressPercent}%, rgba(255, 255, 255, 0.2) 100%)`
              }}
            />
          </div>
          <div className="flex justify-between text-xs text-white/50 font-mono">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        {/* Primary Playback Controls Row */}
        <div className="flex items-center justify-between pt-1">
          {/* Shuffle Mode */}
          <button
            onClick={onTogglePlaybackMode}
            className={`p-2.5 rounded-xl transition-colors ${
              playbackMode === 'shuffle' ? 'text-cyan-400 bg-white/10' : 'text-white/50 hover:text-white'
            }`}
            style={{
              color: playbackMode === 'shuffle' ? accentColor : undefined
            }}
            title={`Mode: ${playbackMode}`}
          >
            <Shuffle className="w-5 h-5" />
          </button>

          {/* Previous Track */}
          <button
            onClick={onPrev}
            className="p-3 rounded-full hover:bg-white/10 active:scale-90 transition-all text-white"
            title="Previous"
          >
            <SkipBack className="w-7 h-7" />
          </button>

          {/* Center Play/Pause Button */}
          <button
            onClick={onTogglePlay}
            style={{ backgroundColor: accentColor }}
            className="w-16 h-16 rounded-full flex items-center justify-center active:scale-95 shadow-xl transition-transform"
            title={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? (
              <Pause className="w-8 h-8 text-black fill-black" />
            ) : (
              <Play className="w-8 h-8 text-black fill-black ml-1" />
            )}
          </button>

          {/* Next Track */}
          <button
            onClick={onNext}
            className="p-3 rounded-full hover:bg-white/10 active:scale-90 transition-all text-white"
            title="Next"
          >
            <SkipForward className="w-7 h-7" />
          </button>

          {/* Repeat Mode */}
          <button
            onClick={onTogglePlaybackMode}
            className={`p-2.5 rounded-xl transition-colors ${
              playbackMode === 'repeat-one' || playbackMode === 'repeat-all'
                ? 'text-cyan-400 bg-white/10'
                : 'text-white/50 hover:text-white'
            }`}
            style={{
              color:
                playbackMode === 'repeat-one' || playbackMode === 'repeat-all'
                  ? accentColor
                  : undefined
            }}
            title={`Mode: ${playbackMode}`}
          >
            {playbackMode === 'repeat-one' ? (
              <Repeat1 className="w-5 h-5" />
            ) : (
              <Repeat className="w-5 h-5" />
            )}
          </button>
        </div>

        {/* Secondary Toolbar: Equalizer, Speed, Ringtone, Sleep Timer */}
        <div className="flex items-center justify-around pt-3 border-t border-white/10 text-white/70">
          {/* Equalizer */}
          <button
            onClick={onOpenEqualizer}
            className="flex flex-col items-center gap-1 hover:text-white transition-colors"
            title="Equalizer"
          >
            <Sliders className="w-5 h-5" />
            <span className="text-[10px]">EQ</span>
          </button>

          {/* Speed Selector */}
          <div className="relative">
            <button
              onClick={() => setShowSpeedMenu(!showSpeedMenu)}
              className="flex flex-col items-center gap-1 hover:text-white transition-colors"
              title="Playback Speed"
            >
              <Gauge className="w-5 h-5" />
              <span className="text-[10px] font-mono">{playbackRate}x</span>
            </button>

            {showSpeedMenu && (
              <div className="absolute bottom-10 left-1/2 -translate-x-1/2 bg-[#1A1D2B] border border-white/10 rounded-2xl p-1.5 shadow-2xl flex flex-col gap-1 z-50 min-w-[70px]">
                {speeds.map((rate) => (
                  <button
                    key={rate}
                    onClick={() => {
                      onChangePlaybackRate(rate);
                      setShowSpeedMenu(false);
                    }}
                    className={`px-2 py-1 text-xs font-mono rounded-lg transition-colors text-center ${
                      playbackRate === rate
                        ? 'font-bold text-black'
                        : 'text-white/70 hover:bg-white/10 hover:text-white'
                    }`}
                    style={{
                      backgroundColor: playbackRate === rate ? accentColor : undefined
                    }}
                  >
                    {rate}x
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Ringtone Cutter */}
          <button
            onClick={() => onOpenRingtoneCutter(track)}
            className="flex flex-col items-center gap-1 hover:text-white transition-colors"
            title="Ringtone Cutter"
          >
            <Scissors className="w-5 h-5" />
            <span className="text-[10px]">Ringtone</span>
          </button>

          {/* Sleep Timer */}
          <button
            onClick={onOpenSleepTimer}
            className="flex flex-col items-center gap-1 hover:text-white transition-colors"
            title="Sleep Timer"
          >
            <Moon className="w-5 h-5" />
            <span className="text-[10px]">Sleep</span>
          </button>
        </div>
      </div>
    </div>
  );
};
