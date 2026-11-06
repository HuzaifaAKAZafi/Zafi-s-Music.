import React, { useState } from 'react';
import { MediaTrack, Playlist } from '../../types/player';
import {
  Sliders,
  Scissors,
  Moon,
  Car,
  Palette,
  FolderSync,
  Heart,
  Music2,
  Clock,
  Sparkles,
  Info,
  CheckCircle,
  HardDrive,
  Cloud
} from 'lucide-react';
import { PWAInstallButton } from '../PWAInstallButton';

interface MeToolsTabProps {
  tracks: MediaTrack[];
  playlists: Playlist[];
  onOpenEqualizer: () => void;
  onOpenDriveBackup: () => void;
  onOpenRingtoneCutter: () => void;
  onOpenSleepTimer: () => void;
  onOpenDrivingMode: () => void;
  onOpenThemeStore: () => void;
  onScanLocalMedia: () => void;
  onResetDemoData: () => void;
  onOpenInstallModal?: () => void;
  accentColor: string;
}

export const MeToolsTab: React.FC<MeToolsTabProps> = ({
  tracks,
  playlists,
  onOpenEqualizer,
  onOpenDriveBackup,
  onOpenRingtoneCutter,
  onOpenSleepTimer,
  onOpenDrivingMode,
  onOpenThemeStore,
  onScanLocalMedia,
  onResetDemoData,
  onOpenInstallModal,
  accentColor
}) => {
  const [highQuality, setHighQuality] = useState(true);
  const [crossfade, setCrossfade] = useState(true);
  const [showResetNotice, setShowResetNotice] = useState(false);

  const favoriteCount = tracks.filter((t) => t.isFavorite).length;
  const totalDuration = tracks.reduce((sum, t) => sum + (t.duration || 0), 0);
  const totalMins = Math.floor(totalDuration / 60);

  const tools = [
    {
      title: 'Equalizer',
      desc: '5-band tuning & 3D sound',
      icon: Sliders,
      action: onOpenEqualizer,
      color: 'text-cyan-400',
      bg: 'bg-cyan-500/10'
    },
    {
      title: 'Drive Cloud Backup',
      desc: 'Google Drive sync & restore',
      icon: Cloud,
      action: onOpenDriveBackup,
      color: 'text-indigo-400',
      bg: 'bg-indigo-500/10'
    },
    {
      title: 'Ringtone Cutter',
      desc: 'Create custom ringtones',
      icon: Scissors,
      action: onOpenRingtoneCutter,
      color: 'text-amber-400',
      bg: 'bg-amber-500/10'
    },
    {
      title: 'Sleep Timer',
      desc: 'Auto-stop music at bedtime',
      icon: Moon,
      action: onOpenSleepTimer,
      color: 'text-purple-400',
      bg: 'bg-purple-500/10'
    },
    {
      title: 'Driving Mode',
      desc: 'Safe & large car controls',
      icon: Car,
      action: onOpenDrivingMode,
      color: 'text-emerald-400',
      bg: 'bg-emerald-500/10'
    },
    {
      title: 'Theme Store',
      desc: 'Skins, neon accents & colors',
      icon: Palette,
      action: onOpenThemeStore,
      color: 'text-pink-400',
      bg: 'bg-pink-500/10'
    },
  ];

  const handleReset = () => {
    onResetDemoData();
    setShowResetNotice(true);
    setTimeout(() => setShowResetNotice(false), 2500);
  };

  return (
    <div className="flex-1 flex flex-col overflow-y-auto pb-24 max-w-6xl mx-auto w-full px-4 pt-4 space-y-6">
      {/* Profile & Listening Stats Card */}
      <div className="p-6 rounded-3xl bg-gradient-to-br from-[#1A1D2D] to-[#121420] border border-white/10 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <img
            src="/logo.jpg"
            alt="Zafi's Music"
            className="w-16 h-16 rounded-2xl object-cover border-2 border-amber-500/50 shadow-xl shadow-orange-500/20 shrink-0"
          />
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-white">Zafi&apos;s Music VIP</h2>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-400/20 text-cyan-300 font-bold">
                PRO
              </span>
            </div>
            <p className="text-xs text-white/50 mt-0.5">High-Fidelity Audio &amp; Cloud Ready</p>
          </div>
        </div>

        {/* 3 Metric counters */}
        <div className="grid grid-cols-3 gap-6 text-center w-full md:w-auto">
          <div className="p-2">
            <div className="flex items-center justify-center gap-1 text-white/50 text-xs mb-1">
              <Music2 className="w-3.5 h-3.5 text-cyan-400" />
              <span>Tracks</span>
            </div>
            <div className="text-xl font-mono font-bold text-white">{tracks.length}</div>
          </div>

          <div className="p-2">
            <div className="flex items-center justify-center gap-1 text-white/50 text-xs mb-1">
              <Heart className="w-3.5 h-3.5 text-rose-500" />
              <span>Favorites</span>
            </div>
            <div className="text-xl font-mono font-bold text-white">{favoriteCount}</div>
          </div>

          <div className="p-2">
            <div className="flex items-center justify-center gap-1 text-white/50 text-xs mb-1">
              <Clock className="w-3.5 h-3.5 text-amber-400" />
              <span>Duration</span>
            </div>
            <div className="text-xl font-mono font-bold text-white">{totalMins}m</div>
          </div>
        </div>
      </div>

      {/* PWA App Install Banner Card */}
      <PWAInstallButton accentColor={accentColor} variant="card" />

      {/* Tools & Utilities Grid */}
      <div>
        <h3 className="font-bold text-sm text-white mb-3 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-cyan-400" />
          Music Tools &amp; Features
        </h3>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {tools.map((tool) => {
            const Icon = tool.icon;
            return (
              <div
                key={tool.title}
                onClick={tool.action}
                className="p-4 rounded-2xl bg-[#161824] hover:bg-white/10 border border-white/5 hover:border-white/20 cursor-pointer transition-all active:scale-[0.98] flex items-center gap-3.5 shadow-sm"
              >
                <div
                  className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${tool.bg} ${tool.color}`}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <h4 className="font-bold text-sm text-white truncate">{tool.title}</h4>
                  <p className="text-xs text-white/50 truncate mt-0.5">{tool.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Playback Settings */}
      <div className="p-4 rounded-2xl bg-[#161824] border border-white/5 space-y-3">
        <h3 className="font-bold text-sm text-white mb-2">Audio Preferences</h3>

        <label className="flex items-center justify-between py-1 cursor-pointer">
          <div>
            <div className="text-xs font-semibold text-white">Lossless HD Processing</div>
            <div className="text-[11px] text-white/40">320kbps audio buffer rendering</div>
          </div>
          <input
            type="checkbox"
            checked={highQuality}
            onChange={(e) => setHighQuality(e.target.checked)}
            className="w-4 h-4 rounded cursor-pointer"
            style={{ accentColor: accentColor }}
          />
        </label>

        <div className="h-[1px] bg-white/5" />

        <label className="flex items-center justify-between py-1 cursor-pointer">
          <div>
            <div className="text-xs font-semibold text-white">Audio Crossfade</div>
            <div className="text-[11px] text-white/40">Smooth transition between ending songs</div>
          </div>
          <input
            type="checkbox"
            checked={crossfade}
            onChange={(e) => setCrossfade(e.target.checked)}
            className="w-4 h-4 rounded cursor-pointer"
            style={{ accentColor: accentColor }}
          />
        </label>
      </div>

      {/* Storage & Demo Data Maintenance */}
      <div className="p-4 rounded-2xl bg-[#161824] border border-white/5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <HardDrive className="w-5 h-5 text-white/50" />
          <div>
            <div className="text-xs font-semibold text-white">Device Cache &amp; Storage</div>
            <div className="text-[11px] text-white/40">
              {tracks.length} cached items · Storage healthy
            </div>
          </div>
        </div>
        <button
          onClick={handleReset}
          className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-white/70 hover:text-white text-xs font-medium transition-colors"
        >
          {showResetNotice ? 'Reset Done!' : 'Reset Demo Media'}
        </button>
      </div>

      {/* About Box */}
      <div className="p-4 rounded-2xl bg-white/5 border border-white/5 flex items-center gap-3 text-xs text-white/50">
        <Info className="w-5 h-5 text-cyan-400 shrink-0" />
        <p>
          <strong className="text-white">Zafi&apos;s Music Player v5.8.0</strong> — Complete with
          offline playback, 5-band equalizer, bass boost, synchronized lyrics, ringtone maker,
          floating video player, themes, and Google Drive cloud backup.
        </p>
      </div>
    </div>
  );
};
