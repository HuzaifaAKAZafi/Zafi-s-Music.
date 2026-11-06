import React, { useState } from 'react';
import { X, Moon, Clock, Check, StopCircle } from 'lucide-react';
import { formatTime } from '../utils/formatters';

interface SleepTimerModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeTimerRemaining: number | null; // in seconds
  onStartTimer: (minutes: number, fadeOut: boolean) => void;
  onCancelTimer: () => void;
  accentColor: string;
}

export const SleepTimerModal: React.FC<SleepTimerModalProps> = ({
  isOpen,
  onClose,
  activeTimerRemaining,
  onStartTimer,
  onCancelTimer,
  accentColor
}) => {
  const [selectedMinutes, setSelectedMinutes] = useState<number>(30);
  const [fadeOut, setFadeOut] = useState<boolean>(true);

  if (!isOpen) return null;

  const presets = [15, 30, 45, 60, 90];

  const handleStart = () => {
    onStartTimer(selectedMinutes, fadeOut);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-sm bg-[#131520] border border-[#272B3E] rounded-3xl p-6 text-white shadow-2xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center"
              style={{ backgroundColor: `${accentColor}25`, color: accentColor }}
            >
              <Moon className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold">Sleep Timer</h3>
              <p className="text-xs text-white/50">Stop music when you fall asleep</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Active Timer Status Banner */}
        {activeTimerRemaining !== null && (
          <div className="my-3 p-3.5 bg-cyan-950/40 border border-cyan-500/30 rounded-2xl flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Clock className="w-5 h-5 text-cyan-400 animate-pulse" />
              <div>
                <div className="text-xs text-white/60">Music stops in</div>
                <div className="text-lg font-mono font-bold text-white">
                  {formatTime(activeTimerRemaining)}
                </div>
              </div>
            </div>
            <button
              onClick={() => {
                onCancelTimer();
                onClose();
              }}
              className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 text-xs font-semibold transition-colors"
            >
              <StopCircle className="w-3.5 h-3.5" />
              Cancel
            </button>
          </div>
        )}

        {/* Preset Minutes Selection */}
        <div className="my-4 space-y-2">
          <div className="text-xs text-white/50 font-medium uppercase tracking-wider mb-2">
            Select Duration
          </div>
          <div className="grid grid-cols-3 gap-2">
            {presets.map((mins) => {
              const isSelected = selectedMinutes === mins;
              return (
                <button
                  key={mins}
                  onClick={() => setSelectedMinutes(mins)}
                  className={`py-3 rounded-xl text-xs font-semibold transition-all border ${
                    isSelected
                      ? 'border-transparent text-black font-bold shadow-lg'
                      : 'border-white/5 bg-white/5 text-white/80 hover:bg-white/10'
                  }`}
                  style={{
                    backgroundColor: isSelected ? accentColor : undefined
                  }}
                >
                  {mins} min
                </button>
              );
            })}
          </div>

          {/* Custom Slider */}
          <div className="pt-4 px-1">
            <div className="flex justify-between text-xs text-white/60 mb-2">
              <span>Custom:</span>
              <span className="font-mono font-bold text-white">{selectedMinutes} Minutes</span>
            </div>
            <input
              type="range"
              min={5}
              max={180}
              step={5}
              value={selectedMinutes}
              onChange={(e) => setSelectedMinutes(parseInt(e.target.value, 10))}
              className="w-full h-1.5 bg-white/20 rounded-lg cursor-pointer"
              style={{ accentColor: accentColor }}
            />
          </div>
        </div>

        {/* Fade Out Toggle */}
        <label className="flex items-center justify-between p-3 bg-white/5 rounded-xl cursor-pointer hover:bg-white/10 transition-colors my-2">
          <div className="flex flex-col">
            <span className="text-xs font-medium text-white">Gentle Fade-Out</span>
            <span className="text-[10px] text-white/40">Smoothly reduces volume in the last minute</span>
          </div>
          <input
            type="checkbox"
            checked={fadeOut}
            onChange={(e) => setFadeOut(e.target.checked)}
            className="w-4 h-4 rounded text-cyan-500 cursor-pointer"
            style={{ accentColor: accentColor }}
          />
        </label>

        {/* Action Button */}
        <div className="pt-3 mt-2 border-t border-white/10">
          <button
            onClick={handleStart}
            style={{ backgroundColor: accentColor }}
            className="w-full py-2.5 rounded-xl font-bold text-black text-sm hover:opacity-90 transition-opacity flex items-center justify-center gap-1.5"
          >
            <Check className="w-4 h-4" />
            Start Sleep Timer ({selectedMinutes}m)
          </button>
        </div>
      </div>
    </div>
  );
};
