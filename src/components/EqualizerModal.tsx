import React from 'react';
import { EqualizerSettings } from '../types/player';
import { EQUALIZER_PRESETS, DEFAULT_EQ_SETTINGS } from '../data/initialMedia';
import { X, Sliders, Volume2, Sparkles, RotateCcw } from 'lucide-react';
import { AudioVisualizer } from './AudioVisualizer';

interface EqualizerModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: EqualizerSettings;
  onChange: (settings: EqualizerSettings) => void;
  accentColor: string;
  isPlaying: boolean;
}

const FREQUENCY_LABELS = ['60Hz', '230Hz', '910Hz', '3.6kHz', '14kHz'];

export const EqualizerModal: React.FC<EqualizerModalProps> = ({
  isOpen,
  onClose,
  settings,
  onChange,
  accentColor,
  isPlaying
}) => {
  if (!isOpen) return null;

  const handleToggle = () => {
    onChange({
      ...settings,
      enabled: !settings.enabled
    });
  };

  const handlePresetSelect = (presetName: string) => {
    const presetGains = EQUALIZER_PRESETS[presetName] || [0, 0, 0, 0, 0];
    onChange({
      ...settings,
      preset: presetName,
      gains: [...presetGains]
    });
  };

  const handleGainChange = (index: number, val: number) => {
    const newGains = [...settings.gains];
    newGains[index] = val;
    onChange({
      ...settings,
      preset: 'Custom',
      gains: newGains
    });
  };

  const handleBassBoostChange = (val: number) => {
    onChange({
      ...settings,
      bassBoost: val
    });
  };

  const handleSurroundChange = (val: number) => {
    onChange({
      ...settings,
      surround3D: val
    });
  };

  const handleReset = () => {
    onChange({ ...DEFAULT_EQ_SETTINGS });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-lg bg-[#141622] border border-[#272B3E] rounded-3xl p-6 text-white shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Glow backdrop effect */}
        <div
          className="absolute -top-24 -right-24 w-48 h-48 rounded-full blur-3xl opacity-20 pointer-events-none"
          style={{ backgroundColor: accentColor }}
        />

        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10 shrink-0">
          <div className="flex items-center gap-2.5">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center"
              style={{ backgroundColor: `${accentColor}25`, color: accentColor }}
            >
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold">Lark Equalizer</h3>
              <p className="text-xs text-white/50">Pro 5-band sound tuning &amp; 3D effects</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Reset button */}
            <button
              onClick={handleReset}
              title="Reset Equalizer"
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            {/* Power Switch */}
            <button
              onClick={handleToggle}
              className={`relative inline-flex h-6 w-12 items-center rounded-full transition-colors focus:outline-none ${
                settings.enabled ? 'bg-cyan-500' : 'bg-white/20'
              }`}
              style={{
                backgroundColor: settings.enabled ? accentColor : undefined
              }}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  settings.enabled ? 'translate-x-7' : 'translate-x-1'
                }`}
              />
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-colors ml-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Real-time Visualizer strip */}
        <div className="my-3 px-2 py-1 bg-black/30 rounded-xl border border-white/5 shrink-0">
          <AudioVisualizer isPlaying={isPlaying && settings.enabled} barColor={accentColor} height={32} />
        </div>

        <div className="overflow-y-auto pr-1 space-y-6 flex-1 py-1">
          {/* Preset Selector */}
          <div>
            <div className="text-xs font-semibold text-white/60 uppercase tracking-wider mb-2">
              Presets
            </div>
            <div className="flex flex-wrap gap-1.5">
              {Object.keys(EQUALIZER_PRESETS).map((pName) => {
                const isSelected = settings.preset === pName;
                return (
                  <button
                    key={pName}
                    disabled={!settings.enabled}
                    onClick={() => handlePresetSelect(pName)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                      isSelected
                        ? 'font-bold text-black shadow-md'
                        : 'bg-white/5 text-white/70 hover:bg-white/10'
                    } ${!settings.enabled ? 'opacity-40 cursor-not-allowed' : ''}`}
                    style={{
                      backgroundColor: isSelected ? accentColor : undefined
                    }}
                  >
                    {pName}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 5-Band Vertical EQ Sliders */}
          <div className="p-4 bg-black/40 rounded-2xl border border-white/5">
            <div className="flex justify-between items-center text-xs text-white/40 mb-3 font-mono">
              <span>+12 dB</span>
              <span className="text-[10px] text-white/30">0 dB (Flat)</span>
              <span>-12 dB</span>
            </div>

            <div className="grid grid-cols-5 gap-2 h-44 items-center">
              {settings.gains.map((gain, i) => (
                <div key={i} className="flex flex-col items-center h-full justify-between">
                  <span className="text-[11px] font-mono font-medium text-white/80">
                    {gain > 0 ? `+${gain}` : gain}
                  </span>

                  {/* Vertical Range Slider Container */}
                  <div className="relative w-8 h-32 flex items-center justify-center">
                    {/* Zero center guide */}
                    <div className="absolute w-full h-[1px] bg-white/20 pointer-events-none" />

                    <input
                      type="range"
                      min={-12}
                      max={12}
                      step={1}
                      disabled={!settings.enabled}
                      value={gain}
                      onChange={(e) => handleGainChange(i, parseInt(e.target.value, 10))}
                      style={{
                        writingMode: 'vertical-lr',
                        direction: 'rtl',
                        accentColor: accentColor
                      }}
                      className="w-2.5 h-28 cursor-pointer disabled:opacity-40"
                    />
                  </div>

                  <span className="text-[11px] font-medium text-white/60">
                    {FREQUENCY_LABELS[i]}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Bass Boost & 3D Surround FX */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Bass Boost */}
            <div className="p-4 bg-black/40 rounded-2xl border border-white/5 flex flex-col justify-between">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Volume2 className="w-4 h-4 text-cyan-400" />
                  <span className="text-sm font-semibold">Bass Boost</span>
                </div>
                <span className="text-xs font-mono font-bold" style={{ color: accentColor }}>
                  {settings.bassBoost}%
                </span>
              </div>
              <input
                type="range"
                min={0}
                max={100}
                disabled={!settings.enabled}
                value={settings.bassBoost}
                onChange={(e) => handleBassBoostChange(parseInt(e.target.value, 10))}
                className="w-full h-2 rounded-lg cursor-pointer disabled:opacity-40"
                style={{ accentColor: accentColor }}
              />
              <p className="text-[11px] text-white/40 mt-2">
                Enhance low-end punch &amp; sub-bass clarity
              </p>
            </div>

            {/* 3D Surround / Virtualizer */}
            <div className="p-4 bg-black/40 rounded-2xl border border-white/5 flex flex-col justify-between">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-purple-400" />
                  <span className="text-sm font-semibold">3D Surround</span>
                </div>
                <span className="text-xs font-mono font-bold" style={{ color: accentColor }}>
                  {settings.surround3D}%
                </span>
              </div>
              <input
                type="range"
                min={0}
                max={100}
                disabled={!settings.enabled}
                value={settings.surround3D}
                onChange={(e) => handleSurroundChange(parseInt(e.target.value, 10))}
                className="w-full h-2 rounded-lg cursor-pointer disabled:opacity-40"
                style={{ accentColor: accentColor }}
              />
              <p className="text-[11px] text-white/40 mt-2">
                Widens stereo soundstage and concert ambience
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-4 mt-2 border-t border-white/10 flex justify-end shrink-0">
          <button
            onClick={onClose}
            style={{ backgroundColor: accentColor }}
            className="w-full py-2.5 rounded-xl font-bold text-black text-sm hover:opacity-90 transition-opacity"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
