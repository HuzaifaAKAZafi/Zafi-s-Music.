import React, { useState, useRef, useEffect } from 'react';
import { MediaTrack } from '../types/player';
import { formatTime } from '../utils/formatters';
import { X, Scissors, Play, Pause, Bell, Check, RotateCcw } from 'lucide-react';

interface RingtoneCutterModalProps {
  isOpen: boolean;
  onClose: () => void;
  track: MediaTrack | null;
  accentColor: string;
}

export const RingtoneCutterModal: React.FC<RingtoneCutterModalProps> = ({
  isOpen,
  onClose,
  track,
  accentColor
}) => {
  const [startTime, setStartTime] = useState(0);
  const [endTime, setEndTime] = useState(30);
  const [isPreviewing, setIsPreviewing] = useState(false);
  const [currentPlayTime, setCurrentPlayTime] = useState(0);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const previewAudioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (track) {
      setStartTime(0);
      setEndTime(Math.min(30, track.duration));
      setIsPreviewing(false);
      setSavedSuccess(false);
    }
  }, [track?.id]);

  if (!isOpen || !track) return null;

  const handleTogglePreview = () => {
    if (!previewAudioRef.current) return;

    if (isPreviewing) {
      previewAudioRef.current.pause();
      setIsPreviewing(false);
    } else {
      previewAudioRef.current.currentTime = startTime;
      previewAudioRef.current.play().catch(() => {});
      setIsPreviewing(true);
    }
  };

  const handleTimeUpdate = () => {
    if (!previewAudioRef.current) return;
    const cur = previewAudioRef.current.currentTime;
    setCurrentPlayTime(cur);
    if (cur >= endTime) {
      previewAudioRef.current.pause();
      setIsPreviewing(false);
      previewAudioRef.current.currentTime = startTime;
    }
  };

  const handleSetDuration = (durationSec: number) => {
    const newEnd = Math.min(track.duration, startTime + durationSec);
    setEndTime(newEnd);
  };

  const handleSaveRingtone = () => {
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 1800);
  };

  const cutDuration = Math.max(0, endTime - startTime);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fadeIn">
      {/* Hidden preview audio */}
      <audio
        ref={previewAudioRef}
        src={track.audioUrl}
        onTimeUpdate={handleTimeUpdate}
        onEnded={() => setIsPreviewing(false)}
      />

      <div className="relative w-full max-w-md bg-[#131520] border border-[#272B3E] rounded-3xl p-6 text-white shadow-2xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center"
              style={{ backgroundColor: `${accentColor}25`, color: accentColor }}
            >
              <Scissors className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold">Ringtone Cutter</h3>
              <p className="text-xs text-white/50">Trim &amp; create custom phone ringtones</p>
            </div>
          </div>
          <button
            onClick={() => {
              if (previewAudioRef.current) previewAudioRef.current.pause();
              onClose();
            }}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Track Info Card */}
        <div className="flex items-center gap-3 my-4 p-3 bg-white/5 rounded-2xl border border-white/5">
          <img
            src={track.coverUrl}
            alt={track.title}
            className="w-12 h-12 rounded-xl object-cover"
          />
          <div className="truncate flex-1">
            <h4 className="font-semibold text-sm truncate">{track.title}</h4>
            <p className="text-xs text-white/50 truncate">{track.artist}</p>
          </div>
          <span className="text-xs font-mono text-white/40">
            {formatTime(track.duration)}
          </span>
        </div>

        {/* Waveform Visualization Mockup */}
        <div className="my-2 p-4 bg-black/40 rounded-2xl border border-white/5 flex flex-col gap-2">
          <div className="flex justify-between text-xs text-white/50 font-mono">
            <span>Start: {formatTime(startTime)}</span>
            <span style={{ color: accentColor }} className="font-bold">
              Duration: {cutDuration.toFixed(1)}s
            </span>
            <span>End: {formatTime(endTime)}</span>
          </div>

          {/* Waveform graphic bars with selection highlight */}
          <div className="relative h-16 w-full flex items-center gap-[2px] overflow-hidden my-2 px-1">
            {Array.from({ length: 48 }).map((_, idx) => {
              const barTime = (idx / 48) * track.duration;
              const isSelected = barTime >= startTime && barTime <= endTime;
              const isPlayingHere = isPreviewing && Math.abs(currentPlayTime - barTime) < (track.duration / 48);

              // Waveform pseudo-height
              const heightPct = 25 + Math.sin(idx * 0.4) * 35 + ((idx % 5) * 8);

              return (
                <div
                  key={idx}
                  className="flex-1 rounded-full transition-all"
                  style={{
                    height: `${heightPct}%`,
                    backgroundColor: isPlayingHere
                      ? '#FFFFFF'
                      : isSelected
                      ? accentColor
                      : 'rgba(255, 255, 255, 0.15)'
                  }}
                />
              );
            })}
          </div>

          {/* Range sliders */}
          <div className="space-y-3 pt-2">
            <div>
              <div className="flex justify-between text-[11px] text-white/60 mb-1">
                <span>Start Point</span>
                <span className="font-mono">{formatTime(startTime)}</span>
              </div>
              <input
                type="range"
                min={0}
                max={Math.max(0, endTime - 2)}
                step={0.5}
                value={startTime}
                onChange={(e) => setStartTime(parseFloat(e.target.value))}
                className="w-full h-1.5 bg-white/20 rounded-lg cursor-pointer"
                style={{ accentColor: accentColor }}
              />
            </div>

            <div>
              <div className="flex justify-between text-[11px] text-white/60 mb-1">
                <span>End Point</span>
                <span className="font-mono">{formatTime(endTime)}</span>
              </div>
              <input
                type="range"
                min={startTime + 2}
                max={track.duration}
                step={0.5}
                value={endTime}
                onChange={(e) => setEndTime(parseFloat(e.target.value))}
                className="w-full h-1.5 bg-white/20 rounded-lg cursor-pointer"
                style={{ accentColor: accentColor }}
              />
            </div>
          </div>
        </div>

        {/* Quick Duration Shortcuts */}
        <div className="flex items-center justify-between my-3 text-xs">
          <span className="text-white/50">Quick Length:</span>
          <div className="flex gap-1.5">
            {[15, 30, 45].map((sec) => (
              <button
                key={sec}
                onClick={() => handleSetDuration(sec)}
                className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition-colors"
              >
                {sec}s
              </button>
            ))}
            <button
              onClick={() => {
                setStartTime(0);
                setEndTime(Math.min(30, track.duration));
              }}
              className="p-1 rounded-lg bg-white/5 hover:bg-white/10 text-white/60"
              title="Reset range"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex gap-2.5 mt-2 pt-3 border-t border-white/10">
          <button
            onClick={handleTogglePreview}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white font-medium text-xs transition-colors"
          >
            {isPreviewing ? (
              <>
                <Pause className="w-4 h-4 text-cyan-400" />
                <span>Pause</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 text-cyan-400" />
                <span>Play Segment</span>
              </>
            )}
          </button>

          <button
            onClick={handleSaveRingtone}
            disabled={savedSuccess}
            style={{ backgroundColor: savedSuccess ? '#10B981' : accentColor }}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl font-bold text-black text-xs hover:opacity-95 transition-all"
          >
            {savedSuccess ? (
              <>
                <Check className="w-4 h-4 text-black" />
                <span>Ringtone Set!</span>
              </>
            ) : (
              <>
                <Bell className="w-4 h-4 text-black" />
                <span>Set as Ringtone</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
