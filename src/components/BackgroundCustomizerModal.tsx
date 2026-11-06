import React, { useState, useRef } from 'react';
import { CustomBackgroundConfig } from '../types/player';
import { PRESET_BACKGROUNDS, PresetBackground } from '../data/initialMedia';
import {
  X,
  Sparkles,
  Upload,
  Link,
  Check,
  RotateCcw,
  Sliders,
  Layers,
  Image as ImageIcon,
  Flame,
  SunMedium
} from 'lucide-react';

interface BackgroundCustomizerModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: CustomBackgroundConfig;
  onUpdateConfig: (newConfig: CustomBackgroundConfig) => void;
  accentColor: string;
}

const QUICK_WALLPAPER_URLS = [
  {
    name: 'Fiery Embers',
    url: 'https://images.unsplash.com/photo-1542281286-9e0a16bb7366?w=1600&auto=format&fit=crop&q=80'
  },
  {
    name: 'Neon Cyber City',
    url: 'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?w=1600&auto=format&fit=crop&q=80'
  },
  {
    name: 'Deep Cosmos',
    url: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?w=1600&auto=format&fit=crop&q=80'
  },
  {
    name: 'Midnight Ocean',
    url: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1600&auto=format&fit=crop&q=80'
  }
];

export const BackgroundCustomizerModal: React.FC<BackgroundCustomizerModalProps> = ({
  isOpen,
  onClose,
  config,
  onUpdateConfig,
  accentColor
}) => {
  const [activeTab, setActiveTab] = useState<'presets' | 'upload' | 'url' | 'glass'>('presets');
  const [customUrlInput, setCustomUrlInput] = useState('');
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  if (!isOpen) return null;

  const handleSelectPreset = (preset: PresetBackground) => {
    onUpdateConfig({
      ...config,
      type: 'preset',
      presetId: preset.id,
      name: preset.name,
      imageUrl: undefined,
      gradient: preset.cssBackground
    });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (loadEvent) => {
      const dataUrl = loadEvent.target?.result as string;
      if (dataUrl) {
        onUpdateConfig({
          ...config,
          type: 'upload',
          name: file.name.replace(/\.[^/.]+$/, ''),
          imageUrl: dataUrl,
          presetId: undefined
        });
      }
    };
    reader.readAsDataURL(file);
  };

  const handleApplyUrl = () => {
    if (!customUrlInput.trim()) return;
    onUpdateConfig({
      ...config,
      type: 'url',
      name: 'Custom Wallpaper',
      imageUrl: customUrlInput.trim(),
      presetId: undefined
    });
  };

  const handleResetToDefault = () => {
    const defaultPreset = PRESET_BACKGROUNDS[0];
    onUpdateConfig({
      id: defaultPreset.id,
      name: defaultPreset.name,
      type: 'preset',
      presetId: defaultPreset.id,
      blur: 'xl',
      glassOpacity: 0.35,
      ambientBeatGlow: true,
      vignette: true,
      imageUrl: undefined,
      gradient: defaultPreset.cssBackground
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-lg bg-[#0e101b]/80 backdrop-blur-3xl border border-white/15 rounded-3xl p-6 text-white shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
        {/* Glow ambient highlight */}
        <div
          className="absolute -top-20 -right-20 w-44 h-44 rounded-full blur-3xl opacity-25 pointer-events-none"
          style={{ backgroundColor: accentColor }}
        />

        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10 shrink-0">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-2xl flex items-center justify-center border border-white/15 shadow-inner"
              style={{ backgroundColor: `${accentColor}25`, color: accentColor }}
            >
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold">Customize Background &amp; Glass</h3>
              <p className="text-xs text-white/50">Personalize wallpaper, frosted glass, and transparency</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Sub-tabs: Presets | Upload Photo | Image URL | Glass Sliders */}
        <div className="flex items-center gap-1.5 border-b border-white/10 pb-3 my-3 shrink-0 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveTab('presets')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              activeTab === 'presets'
                ? 'bg-white/20 text-white font-bold shadow-sm'
                : 'text-white/60 hover:text-white'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Glass Presets</span>
          </button>

          <button
            onClick={() => setActiveTab('upload')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              activeTab === 'upload'
                ? 'bg-white/20 text-white font-bold shadow-sm'
                : 'text-white/60 hover:text-white'
            }`}
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Upload Wallpaper</span>
          </button>

          <button
            onClick={() => setActiveTab('url')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              activeTab === 'url'
                ? 'bg-white/20 text-white font-bold shadow-sm'
                : 'text-white/60 hover:text-white'
            }`}
          >
            <Link className="w-3.5 h-3.5" />
            <span>Image URL</span>
          </button>

          <button
            onClick={() => setActiveTab('glass')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              activeTab === 'glass'
                ? 'bg-white/20 text-white font-bold shadow-sm'
                : 'text-white/60 hover:text-white'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Glass Transparency</span>
          </button>
        </div>

        {/* Tab Content Area */}
        <div className="overflow-y-auto pr-1 flex-1 space-y-4">
          {/* TAB 1: CURATED GLASS PRESETS */}
          {activeTab === 'presets' && (
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-2.5">
                {PRESET_BACKGROUNDS.map((preset) => {
                  const isSelected =
                    config.type === 'preset' && config.presetId === preset.id;
                  return (
                    <div
                      key={preset.id}
                      onClick={() => handleSelectPreset(preset)}
                      className={`relative p-3 rounded-2xl cursor-pointer transition-all border overflow-hidden group ${
                        isSelected
                          ? 'border-white/50 shadow-lg scale-[1.02]'
                          : 'border-white/10 hover:border-white/25 bg-white/[0.03]'
                      }`}
                      style={{
                        background: preset.cssBackground
                      }}
                    >
                      {/* Gradient overlay */}
                      <div className="absolute inset-0 bg-black/25 backdrop-blur-[2px] pointer-events-none" />

                      <div className="relative z-10 flex flex-col justify-between h-24">
                        <div className="flex items-center justify-between">
                          <span
                            className="w-3 h-3 rounded-full shadow-md"
                            style={{ backgroundColor: preset.accentColor }}
                          />
                          {isSelected && (
                            <span
                              style={{ backgroundColor: accentColor }}
                              className="w-5 h-5 rounded-full flex items-center justify-center text-black font-extrabold shadow-md"
                            >
                              <Check className="w-3 h-3 stroke-[3]" />
                            </span>
                          )}
                        </div>

                        <div>
                          <div className="text-xs font-bold text-white drop-shadow">
                            {preset.name}
                          </div>
                          <div className="text-[10px] text-white/70 line-clamp-1">
                            {preset.subtitle}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 2: UPLOAD WALLPAPER FROM DEVICE */}
          {activeTab === 'upload' && (
            <div className="space-y-4">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />

              <div
                onClick={() => fileInputRef.current?.click()}
                className="p-8 border-2 border-dashed border-white/20 hover:border-white/40 rounded-3xl text-center cursor-pointer bg-white/[0.02] hover:bg-white/[0.05] transition-all flex flex-col items-center justify-center gap-3"
              >
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg"
                  style={{ backgroundColor: `${accentColor}25`, color: accentColor }}
                >
                  <Upload className="w-7 h-7" />
                </div>
                <div>
                  <div className="text-sm font-bold text-white">Choose an image from your device</div>
                  <div className="text-xs text-white/50 mt-1">
                    Supports JPG, PNG, WEBP wallpapers. Instant transparent frosted glass effect!
                  </div>
                </div>
                <button
                  type="button"
                  style={{ backgroundColor: accentColor }}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-black shadow-md mt-1 pointer-events-none"
                >
                  Select Photo / Wallpaper
                </button>
              </div>

              {config.type === 'upload' && config.imageUrl && (
                <div className="p-3 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      src={config.imageUrl}
                      alt="Uploaded wallpaper"
                      className="w-12 h-12 rounded-xl object-cover border border-white/10 shadow"
                    />
                    <div>
                      <div className="text-xs font-bold text-white">Active Custom Wallpaper</div>
                      <div className="text-[10px] text-emerald-400 font-medium">Applied to glass background</div>
                    </div>
                  </div>
                  <button
                    onClick={handleResetToDefault}
                    className="p-2 text-rose-400 hover:text-rose-300 text-xs font-medium"
                    title="Remove custom wallpaper"
                  >
                    Reset
                  </button>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: IMAGE URL / ONLINE WALLPAPERS */}
          {activeTab === 'url' && (
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-semibold text-white/70">Paste Image Web Address</label>
                <div className="flex items-center gap-2">
                  <input
                    type="url"
                    placeholder="https://example.com/wallpaper.jpg"
                    value={customUrlInput}
                    onChange={(e) => setCustomUrlInput(e.target.value)}
                    className="flex-1 px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs placeholder-white/30 focus:outline-none focus:border-cyan-400"
                  />
                  <button
                    onClick={handleApplyUrl}
                    style={{ backgroundColor: accentColor }}
                    className="px-4 py-2.5 rounded-xl text-xs font-bold text-black whitespace-nowrap shadow-md hover:opacity-95"
                  >
                    Apply
                  </button>
                </div>
              </div>

              {/* Quick Suggestions */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-white/50">Curated Wallpapers</label>
                <div className="grid grid-cols-2 gap-2">
                  {QUICK_WALLPAPER_URLS.map((item) => (
                    <button
                      key={item.name}
                      onClick={() => {
                        onUpdateConfig({
                          ...config,
                          type: 'url',
                          name: item.name,
                          imageUrl: item.url,
                          presetId: undefined
                        });
                      }}
                      className="relative h-16 rounded-xl overflow-hidden border border-white/10 hover:border-white/30 transition-all text-left group"
                    >
                      <img
                        src={item.url}
                        alt={item.name}
                        className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                      <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px] flex items-end p-2">
                        <span className="text-[11px] font-bold text-white drop-shadow">
                          {item.name}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: GLASS TRANSPARENCY & FROSTED BLUR CONTROLS */}
          {activeTab === 'glass' && (
            <div className="space-y-4">
              {/* Blur Level */}
              <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 space-y-2.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-white">Frosted Glass Blur</span>
                  <span className="font-mono text-cyan-400 capitalize">{config.blur}</span>
                </div>
                <div className="grid grid-cols-5 gap-1.5">
                  {(['none', 'sm', 'md', 'lg', 'xl', '2xl'] as const).slice(1).map((b) => (
                    <button
                      key={b}
                      onClick={() => onUpdateConfig({ ...config, blur: b })}
                      className={`py-1.5 rounded-xl text-xs font-medium uppercase transition-all ${
                        config.blur === b
                          ? 'bg-white/20 text-white font-bold border border-white/30 shadow-sm'
                          : 'bg-white/5 text-white/50 hover:text-white'
                      }`}
                    >
                      {b}
                    </button>
                  ))}
                </div>
              </div>

              {/* Glass Tint Opacity */}
              <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 space-y-2.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-white">Glass Surface Tint</span>
                  <span className="font-mono text-cyan-400">
                    {Math.round(config.glassOpacity * 100)}%
                  </span>
                </div>
                <input
                  type="range"
                  min="0.10"
                  max="0.75"
                  step="0.05"
                  value={config.glassOpacity}
                  onChange={(e) =>
                    onUpdateConfig({ ...config, glassOpacity: parseFloat(e.target.value) })
                  }
                  className="w-full accent-cyan-400 h-1.5 bg-white/10 rounded-lg cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-white/40">
                  <span>Ultra-Transparent Glass (10%)</span>
                  <span>Deep Smoked Glass (75%)</span>
                </div>
              </div>

              {/* Ambient Beat Glow Toggle */}
              <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <SunMedium className="w-5 h-5 text-amber-400" />
                  <div>
                    <div className="text-xs font-semibold text-white">Audio Reactive Beat Glow</div>
                    <div className="text-[10px] text-white/40">
                      Ambient backlight pulses with music bass kicks
                    </div>
                  </div>
                </div>
                <button
                  onClick={() =>
                    onUpdateConfig({ ...config, ambientBeatGlow: !config.ambientBeatGlow })
                  }
                  className={`w-11 h-6 rounded-full transition-colors relative p-0.5 ${
                    config.ambientBeatGlow ? 'bg-cyan-500' : 'bg-white/10'
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-full bg-white transition-transform ${
                      config.ambientBeatGlow ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {/* Edge Vignette Toggle */}
              <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <Flame className="w-5 h-5 text-orange-400" />
                  <div>
                    <div className="text-xs font-semibold text-white">Cinematic Edge Vignette</div>
                    <div className="text-[10px] text-white/40">
                      Deepens outer borders for high readability
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => onUpdateConfig({ ...config, vignette: !config.vignette })}
                  className={`w-11 h-6 rounded-full transition-colors relative p-0.5 ${
                    config.vignette ? 'bg-cyan-500' : 'bg-white/10'
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-full bg-white transition-transform ${
                      config.vignette ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="pt-4 border-t border-white/10 flex items-center justify-between shrink-0">
          <button
            onClick={handleResetToDefault}
            className="flex items-center gap-1.5 text-xs text-white/50 hover:text-white transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset to Fiery Glass</span>
          </button>

          <button
            onClick={onClose}
            style={{ backgroundColor: accentColor }}
            className="px-5 py-2 rounded-xl text-xs font-bold text-black shadow-md hover:opacity-95 active:scale-95 transition-all"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
