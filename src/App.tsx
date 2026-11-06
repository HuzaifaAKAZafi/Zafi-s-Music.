import React, { useState, useEffect, useRef } from 'react';
import {
  MediaTrack,
  Playlist,
  ActiveTab,
  PlaybackMode,
  EqualizerSettings,
  AppTheme,
  LyricLine
} from './types/player';
import {
  INITIAL_TRACKS,
  INITIAL_VIDEOS,
  INITIAL_PLAYLISTS,
  DEFAULT_EQ_SETTINGS,
  LARK_THEMES
} from './data/initialMedia';
import { larkAudioEngine } from './utils/audioEngine';
import { MusicTab } from './components/tabs/MusicTab';
import { VideoTab } from './components/tabs/VideoTab';
import { TrendingTab } from './components/tabs/TrendingTab';
import { MeToolsTab } from './components/tabs/MeToolsTab';
import { MiniPlayer } from './components/MiniPlayer';
import { NowPlayingModal } from './components/NowPlayingModal';
import { EqualizerModal } from './components/EqualizerModal';
import { RingtoneCutterModal } from './components/RingtoneCutterModal';
import { SleepTimerModal } from './components/SleepTimerModal';
import { DrivingModeModal } from './components/DrivingModeModal';
import { ThemeStoreModal } from './components/ThemeStoreModal';
import { FloatingVideoPlayer } from './components/FloatingVideoPlayer';
import { GoogleDriveBackupModal } from './components/GoogleDriveBackupModal';
import { LarkBackupData } from './services/googleDriveService';
import { PWAInstallButton, OfflineIndicator } from './components/PWAInstallButton';
import { AppDownloadModal } from './components/AppDownloadModal';
import {
  Music,
  Film,
  TrendingUp,
  User,
  FolderPlus,
  Sliders,
  Cloud,
  Download
} from 'lucide-react';

export default function App() {
  // Theme state
  const [activeTheme, setActiveTheme] = useState<AppTheme>(() => {
    const saved = localStorage.getItem('lark_theme');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        const match = LARK_THEMES.find((t) => t.id === parsed.id);
        if (match) return match;
      } catch (e) {
        console.error(e);
      }
    }
    return LARK_THEMES[0];
  });

  // Navigation tab state
  const [activeTab, setActiveTab] = useState<ActiveTab>('music');

  // Media Library state
  const [tracks, setTracks] = useState<MediaTrack[]>(() => {
    const saved = localStorage.getItem('lark_tracks');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return INITIAL_TRACKS;
  });

  const [videos, setVideos] = useState<MediaTrack[]>(() => {
    const saved = localStorage.getItem('lark_videos');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return INITIAL_VIDEOS;
  });

  const [playlists, setPlaylists] = useState<Playlist[]>(() => {
    const saved = localStorage.getItem('lark_playlists');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return INITIAL_PLAYLISTS;
  });

  // Current Playback state
  const [currentTrack, setCurrentTrack] = useState<MediaTrack | null>(() => tracks[0] || null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(currentTrack?.duration || 184);
  const [playbackMode, setPlaybackMode] = useState<PlaybackMode>('sequence');
  const [playbackRate, setPlaybackRate] = useState<number>(1.0);
  const [queue, setQueue] = useState<MediaTrack[]>(tracks);

  // Equalizer settings
  const [eqSettings, setEqSettings] = useState<EqualizerSettings>(() => {
    const saved = localStorage.getItem('lark_eq');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return DEFAULT_EQ_SETTINGS;
  });

  // Modal Visibility states
  const [isNowPlayingOpen, setIsNowPlayingOpen] = useState(false);
  const [isEqualizerOpen, setIsEqualizerOpen] = useState(false);
  const [isSleepTimerOpen, setIsSleepTimerOpen] = useState(false);
  const [isDrivingModeOpen, setIsDrivingModeOpen] = useState(false);
  const [isThemeStoreOpen, setIsThemeStoreOpen] = useState(false);
  const [isDriveBackupOpen, setIsDriveBackupOpen] = useState(false);
  const [isDownloadAppOpen, setIsDownloadAppOpen] = useState(false);
  const [ringtoneTrack, setRingtoneTrack] = useState<MediaTrack | null>(null);

  // Floating Video state
  const [floatingVideo, setFloatingVideo] = useState<MediaTrack | null>(null);

  // Sleep Timer state
  const [sleepTimerSeconds, setSleepTimerSeconds] = useState<number | null>(null);
  const [sleepFadeOut, setSleepFadeOut] = useState<boolean>(true);

  // Audio HTML Element Ref
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Persist tracks, playlists, theme, eq in localStorage
  useEffect(() => {
    localStorage.setItem('lark_tracks', JSON.stringify(tracks));
  }, [tracks]);

  useEffect(() => {
    localStorage.setItem('lark_videos', JSON.stringify(videos));
  }, [videos]);

  useEffect(() => {
    localStorage.setItem('lark_playlists', JSON.stringify(playlists));
  }, [playlists]);

  useEffect(() => {
    localStorage.setItem('lark_theme', JSON.stringify(activeTheme));
  }, [activeTheme]);

  useEffect(() => {
    localStorage.setItem('lark_eq', JSON.stringify(eqSettings));
    larkAudioEngine.applySettings(eqSettings);
  }, [eqSettings]);

  // Initialize Web Audio Engine once audio element mounts
  useEffect(() => {
    if (audioRef.current) {
      larkAudioEngine.initialize(audioRef.current);
      larkAudioEngine.applySettings(eqSettings);
    }
  }, []);

  // Sleep Timer countdown interval
  useEffect(() => {
    if (sleepTimerSeconds === null) return;

    if (sleepTimerSeconds <= 0) {
      if (audioRef.current) {
        audioRef.current.pause();
        setIsPlaying(false);
      }
      setSleepTimerSeconds(null);
      return;
    }

    const timer = setInterval(() => {
      setSleepTimerSeconds((prev) => {
        if (prev === null || prev <= 1) {
          if (audioRef.current) {
            audioRef.current.pause();
            setIsPlaying(false);
          }
          return null;
        }

        // Apply smooth volume fade out during final 60 seconds if option enabled
        if (sleepFadeOut && prev <= 60 && audioRef.current) {
          audioRef.current.volume = Math.max(0.05, prev / 60);
        }

        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [sleepTimerSeconds, sleepFadeOut]);

  // Update Media Session API for Lockscreen and Hardware controls
  useEffect(() => {
    if ('mediaSession' in navigator && currentTrack) {
      navigator.mediaSession.metadata = new MediaMetadata({
        title: currentTrack.title,
        artist: currentTrack.artist,
        album: currentTrack.album || "Zafi's Music",
        artwork: [{ src: currentTrack.coverUrl, sizes: '512x512', type: 'image/jpeg' }]
      });

      navigator.mediaSession.setActionHandler('play', handleTogglePlay);
      navigator.mediaSession.setActionHandler('pause', handleTogglePlay);
      navigator.mediaSession.setActionHandler('previoustrack', handlePrevTrack);
      navigator.mediaSession.setActionHandler('nexttrack', handleNextTrack);
    }
  }, [currentTrack]);

  // Playback Control Handlers
  const handleTogglePlay = () => {
    if (!audioRef.current || !currentTrack) return;

    larkAudioEngine.resume();

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch((e) => {
          console.warn('Playback gesture required:', e);
          setIsPlaying(false);
        });
    }
  };

  const handleSelectTrack = (track: MediaTrack) => {
    setCurrentTrack(track);
    // increment plays
    setTracks((prev) =>
      prev.map((t) => (t.id === track.id ? { ...t, plays: (t.plays || 0) + 1 } : t))
    );

    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.src = track.audioUrl;
      larkAudioEngine.resume();
      audioRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch(() => setIsPlaying(false));
    }
  };

  const handleNextTrack = () => {
    if (queue.length === 0) return;
    let nextIndex = 0;

    if (playbackMode === 'shuffle') {
      nextIndex = Math.floor(Math.random() * queue.length);
    } else {
      const currentIndex = queue.findIndex((t) => t.id === currentTrack?.id);
      nextIndex = (currentIndex + 1) % queue.length;
    }

    const next = queue[nextIndex];
    if (next) handleSelectTrack(next);
  };

  const handlePrevTrack = () => {
    if (queue.length === 0) return;
    const currentIndex = queue.findIndex((t) => t.id === currentTrack?.id);
    const prevIndex = (currentIndex - 1 + queue.length) % queue.length;
    const prev = queue[prevIndex];
    if (prev) handleSelectTrack(prev);
  };

  const handleTrackEnded = () => {
    if (playbackMode === 'repeat-one') {
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.play();
      }
    } else {
      handleNextTrack();
    }
  };

  const handleSeek = (time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const handleTogglePlaybackMode = () => {
    const modes: PlaybackMode[] = ['sequence', 'repeat-all', 'repeat-one', 'shuffle'];
    const nextIdx = (modes.indexOf(playbackMode) + 1) % modes.length;
    setPlaybackMode(modes[nextIdx]);
  };

  const handleChangePlaybackRate = (rate: number) => {
    setPlaybackRate(rate);
    if (audioRef.current) {
      audioRef.current.playbackRate = rate;
    }
  };

  const handleShuffleAll = () => {
    const shuffled = [...tracks].sort(() => Math.random() - 0.5);
    setQueue(shuffled);
    if (shuffled[0]) {
      handleSelectTrack(shuffled[0]);
    }
  };

  const handleToggleFavorite = (trackId: string) => {
    setTracks((prev) =>
      prev.map((t) => (t.id === trackId ? { ...t, isFavorite: !t.isFavorite } : t))
    );
    setVideos((prev) =>
      prev.map((v) => (v.id === trackId ? { ...v, isFavorite: !v.isFavorite } : v))
    );
    if (currentTrack?.id === trackId) {
      setCurrentTrack((prev) => (prev ? { ...prev, isFavorite: !prev.isFavorite } : null));
    }
  };

  const handleUpdateLyrics = (newLyrics: LyricLine[]) => {
    if (!currentTrack) return;
    const updated = { ...currentTrack, lyrics: newLyrics };
    setCurrentTrack(updated);
    setTracks((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
  };

  // Local File Import Handler
  const handleImportMediaFiles = (files: FileList) => {
    const newAudioTracks: MediaTrack[] = [];
    const newVideoTracks: MediaTrack[] = [];

    Array.from(files).forEach((file) => {
      const blobUrl = URL.createObjectURL(file);
      const isVideo = file.type.startsWith('video');
      const cleanName = file.name.replace(/\.[^/.]+$/, '');
      const parts = cleanName.split('-');

      const title = parts.length > 1 ? parts[1].trim() : cleanName;
      const artist = parts.length > 1 ? parts[0].trim() : 'Local Device Audio';

      const trackItem: MediaTrack = {
        id: `local-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
        title,
        artist,
        duration: 180, // estimated until metadata loads
        coverUrl: isVideo
          ? 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=600&auto=format&fit=crop&q=80'
          : 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=600&auto=format&fit=crop&q=80',
        audioUrl: isVideo ? '' : blobUrl,
        isVideo,
        videoUrl: isVideo ? blobUrl : undefined,
        addedAt: Date.now(),
        isFavorite: false,
        source: 'local',
        plays: 0,
        fileSize: `${(file.size / (1024 * 1024)).toFixed(1)} MB`
      };

      if (isVideo) {
        newVideoTracks.push(trackItem);
      } else {
        newAudioTracks.push(trackItem);
      }
    });

    if (newAudioTracks.length > 0) {
      setTracks((prev) => [...newAudioTracks, ...prev]);
      setQueue((prev) => [...newAudioTracks, ...prev]);
      handleSelectTrack(newAudioTracks[0]);
    }

    if (newVideoTracks.length > 0) {
      setVideos((prev) => [...newVideoTracks, ...prev]);
      setFloatingVideo(newVideoTracks[0]);
    }
  };

  const handleCreatePlaylist = (title: string) => {
    const newPl: Playlist = {
      id: `pl-${Date.now()}`,
      title,
      coverUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600&auto=format&fit=crop&q=80',
      trackIds: [],
      createdAt: Date.now()
    };
    setPlaylists((prev) => [...prev, newPl]);
  };

  const handleAddToPlaylist = (playlistId: string, trackId: string) => {
    setPlaylists((prev) =>
      prev.map((pl) => {
        if (pl.id === playlistId && !pl.trackIds.includes(trackId)) {
          return { ...pl, trackIds: [...pl.trackIds, trackId] };
        }
        return pl;
      })
    );
  };

  const handleDeleteTrack = (trackId: string) => {
    setTracks((prev) => prev.filter((t) => t.id !== trackId));
    setQueue((prev) => prev.filter((t) => t.id !== trackId));
    if (currentTrack?.id === trackId) {
      const remaining = tracks.filter((t) => t.id !== trackId);
      if (remaining.length > 0) {
        handleSelectTrack(remaining[0]);
      } else {
        setCurrentTrack(null);
        setIsPlaying(false);
      }
    }
  };

  const handleResetDemoData = () => {
    setTracks(INITIAL_TRACKS);
    setVideos(INITIAL_VIDEOS);
    setPlaylists(INITIAL_PLAYLISTS);
    setEqSettings(DEFAULT_EQ_SETTINGS);
    setCurrentTrack(INITIAL_TRACKS[0]);
  };

  const handleStartSleepTimer = (minutes: number, fade: boolean) => {
    setSleepTimerSeconds(minutes * 60);
    setSleepFadeOut(fade);
  };

  const handleRestoreBackup = (backup: LarkBackupData) => {
    if (backup.tracks && backup.tracks.length > 0) {
      setTracks(backup.tracks);
      setQueue(backup.tracks);
      setCurrentTrack(backup.tracks[0]);
    }
    if (backup.playlists && backup.playlists.length > 0) {
      setPlaylists(backup.playlists);
    }
    if (backup.eqSettings) {
      setEqSettings(backup.eqSettings);
    }
  };

  const handleImportDriveTrack = (driveTrack: MediaTrack) => {
    setTracks((prev) => [driveTrack, ...prev.filter((t) => t.id !== driveTrack.id)]);
    setQueue((prev) => [driveTrack, ...prev.filter((t) => t.id !== driveTrack.id)]);
    handleSelectTrack(driveTrack);
  };

  return (
    <div
      className={`min-h-screen ${activeTheme.bodyBg} ${activeTheme.textCol} flex flex-col font-sans transition-colors duration-300 relative select-none overflow-x-hidden`}
    >
      {/* Hidden Master Audio Element */}
      <audio
        ref={audioRef}
        src={currentTrack?.audioUrl}
        onTimeUpdate={() => {
          if (audioRef.current) setCurrentTime(audioRef.current.currentTime);
        }}
        onLoadedMetadata={() => {
          if (audioRef.current) setDuration(audioRef.current.duration);
        }}
        onEnded={handleTrackEnded}
      />

      {/* Hidden File Input for Device Media Scan */}
      <input
        ref={fileInputRef}
        type="file"
        accept="audio/*,video/*"
        multiple
        onChange={(e) => {
          if (e.target.files) handleImportMediaFiles(e.target.files);
        }}
        className="hidden"
      />

      {/* TOP BAR CONTRACT: Zone 1 (Wordmark) — Zone 2 (4 single-line nav links) — Zone 3 (1 primary CTA) */}
      <header className="sticky top-0 z-30 flex items-center justify-between gap-8 px-6 py-3.5 bg-[#0E1017]/90 backdrop-blur-xl border-b border-white/10 shrink-0">
        {/* Zone 1: Single text element wordmark with Zafi's Music Logo */}
        <div className="flex items-center gap-2.5 whitespace-nowrap shrink-0">
          <img
            src="/logo.jpg"
            alt="Zafi's Music"
            className="w-8 h-8 rounded-xl object-cover border border-amber-500/40 shadow-lg shadow-orange-500/20"
          />
          <span className="text-lg font-extrabold tracking-tight text-white">
            Zafi&apos;s Music
          </span>
        </div>

        {/* Zone 2: 4 single-line nav links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-white/70">
          <button
            onClick={() => setActiveTab('music')}
            className={`transition-colors whitespace-nowrap shrink-0 hover:text-white ${
              activeTab === 'music' ? 'text-white' : ''
            }`}
            style={{ color: activeTab === 'music' ? activeTheme.primaryAccent : undefined }}
          >
            Music
          </button>
          <button
            onClick={() => setActiveTab('video')}
            className={`transition-colors whitespace-nowrap shrink-0 hover:text-white ${
              activeTab === 'video' ? 'text-white' : ''
            }`}
            style={{ color: activeTab === 'video' ? activeTheme.primaryAccent : undefined }}
          >
            Video
          </button>
          <button
            onClick={() => setActiveTab('trending')}
            className={`transition-colors whitespace-nowrap shrink-0 hover:text-white ${
              activeTab === 'trending' ? 'text-white' : ''
            }`}
            style={{ color: activeTab === 'trending' ? activeTheme.primaryAccent : undefined }}
          >
            Trending
          </button>
          <button
            onClick={() => setActiveTab('me')}
            className={`transition-colors whitespace-nowrap shrink-0 hover:text-white ${
              activeTab === 'me' ? 'text-white' : ''
            }`}
            style={{ color: activeTab === 'me' ? activeTheme.primaryAccent : undefined }}
          >
            Tools
          </button>
        </nav>

        {/* Zone 3: 1 primary action */}
        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={() => setIsDownloadAppOpen(true)}
            style={{ backgroundColor: activeTheme.primaryAccent }}
            className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-extrabold text-black rounded-xl hover:opacity-95 active:scale-95 transition-all whitespace-nowrap shadow-md cursor-pointer"
            title="Install Zafi's Music App"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Install App</span>
          </button>

          <button
            onClick={() => setIsDriveBackupOpen(true)}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-semibold whitespace-nowrap transition-colors"
            title="Google Drive Music Backup & Restore"
          >
            <Cloud className="w-3.5 h-3.5 text-cyan-400" />
            <span>Drive Backup</span>
          </button>

          <button
            onClick={() => setIsEqualizerOpen(true)}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-semibold whitespace-nowrap transition-colors"
          >
            <Sliders className="w-3.5 h-3.5" style={{ color: activeTheme.primaryAccent }} />
            <span>Equalizer</span>
          </button>

          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-white/10 hover:bg-white/15 rounded-xl active:scale-95 transition-all whitespace-nowrap"
          >
            <FolderPlus className="w-3.5 h-3.5 text-cyan-400" />
            <span>Scan Device</span>
          </button>
        </div>
      </header>

      {/* Connectivity Offline Banner */}
      <OfflineIndicator />

      {/* Main View Area based on Active Tab */}
      <main className="flex-1 flex flex-col overflow-hidden relative">
        {activeTab === 'music' && (
          <MusicTab
            tracks={tracks}
            playlists={playlists}
            currentTrack={currentTrack}
            isPlaying={isPlaying}
            onSelectTrack={handleSelectTrack}
            onShuffleAll={handleShuffleAll}
            onToggleFavorite={handleToggleFavorite}
            onOpenRingtoneCutter={(t) => setRingtoneTrack(t)}
            onImportFiles={handleImportMediaFiles}
            onCreatePlaylist={handleCreatePlaylist}
            onAddToPlaylist={handleAddToPlaylist}
            onDeleteTrack={handleDeleteTrack}
            accentColor={activeTheme.primaryAccent}
          />
        )}

        {activeTab === 'video' && (
          <VideoTab
            videos={videos}
            onPlayFloatingVideo={(v) => setFloatingVideo(v)}
            onImportVideos={handleImportMediaFiles}
            onToggleFavorite={handleToggleFavorite}
            accentColor={activeTheme.primaryAccent}
          />
        )}

        {activeTab === 'trending' && (
          <TrendingTab
            tracks={tracks}
            onSelectTrack={handleSelectTrack}
            accentColor={activeTheme.primaryAccent}
          />
        )}

        {activeTab === 'me' && (
          <MeToolsTab
            tracks={tracks}
            playlists={playlists}
            onOpenEqualizer={() => setIsEqualizerOpen(true)}
            onOpenDriveBackup={() => setIsDriveBackupOpen(true)}
            onOpenRingtoneCutter={() => setRingtoneTrack(currentTrack || tracks[0])}
            onOpenSleepTimer={() => setIsSleepTimerOpen(true)}
            onOpenDrivingMode={() => setIsDrivingModeOpen(true)}
            onOpenThemeStore={() => setIsThemeStoreOpen(true)}
            onScanLocalMedia={() => fileInputRef.current?.click()}
            onResetDemoData={handleResetDemoData}
            onOpenInstallModal={() => setIsDownloadAppOpen(true)}
            accentColor={activeTheme.primaryAccent}
          />
        )}
      </main>

      {/* Floating Video Player Window */}
      {floatingVideo && (
        <FloatingVideoPlayer
          video={floatingVideo}
          onClose={() => setFloatingVideo(null)}
          accentColor={activeTheme.primaryAccent}
        />
      )}

      {/* Persistent MiniPlayer Bar */}
      <MiniPlayer
        track={currentTrack}
        isPlaying={isPlaying}
        currentTime={currentTime}
        duration={duration}
        onTogglePlay={handleTogglePlay}
        onNext={handleNextTrack}
        onExpand={() => setIsNowPlayingOpen(true)}
        onOpenEqualizer={() => setIsEqualizerOpen(true)}
        accentColor={activeTheme.primaryAccent}
      />

      {/* Mobile-First Fixed Bottom Navigation Bar */}
      <footer className="md:hidden fixed bottom-0 left-0 right-0 z-30 bg-[#0E1017]/95 backdrop-blur-xl border-t border-white/10 h-16 grid grid-cols-4 items-center">
        <button
          onClick={() => setActiveTab('music')}
          className={`flex flex-col items-center justify-center h-full transition-colors ${
            activeTab === 'music' ? 'font-bold' : 'text-white/50'
          }`}
          style={{ color: activeTab === 'music' ? activeTheme.primaryAccent : undefined }}
        >
          <Music className="w-5 h-5" />
          <span className="text-[10px] mt-1 tracking-tight">Music</span>
        </button>

        <button
          onClick={() => setActiveTab('video')}
          className={`flex flex-col items-center justify-center h-full transition-colors ${
            activeTab === 'video' ? 'font-bold' : 'text-white/50'
          }`}
          style={{ color: activeTab === 'video' ? activeTheme.primaryAccent : undefined }}
        >
          <Film className="w-5 h-5" />
          <span className="text-[10px] mt-1 tracking-tight">Video</span>
        </button>

        <button
          onClick={() => setActiveTab('trending')}
          className={`flex flex-col items-center justify-center h-full transition-colors ${
            activeTab === 'trending' ? 'font-bold' : 'text-white/50'
          }`}
          style={{ color: activeTab === 'trending' ? activeTheme.primaryAccent : undefined }}
        >
          <TrendingUp className="w-5 h-5" />
          <span className="text-[10px] mt-1 tracking-tight">Trending</span>
        </button>

        <button
          onClick={() => setActiveTab('me')}
          className={`flex flex-col items-center justify-center h-full transition-colors ${
            activeTab === 'me' ? 'font-bold' : 'text-white/50'
          }`}
          style={{ color: activeTab === 'me' ? activeTheme.primaryAccent : undefined }}
        >
          <User className="w-5 h-5" />
          <span className="text-[10px] mt-1 tracking-tight">Me</span>
        </button>
      </footer>

      {/* Full-Screen Now Playing Modal */}
      <NowPlayingModal
        isOpen={isNowPlayingOpen}
        onClose={() => setIsNowPlayingOpen(false)}
        track={currentTrack}
        isPlaying={isPlaying}
        currentTime={currentTime}
        duration={duration}
        playbackMode={playbackMode}
        playbackRate={playbackRate}
        queue={queue}
        onTogglePlay={handleTogglePlay}
        onSeek={handleSeek}
        onNext={handleNextTrack}
        onPrev={handlePrevTrack}
        onToggleFavorite={handleToggleFavorite}
        onTogglePlaybackMode={handleTogglePlaybackMode}
        onChangePlaybackRate={handleChangePlaybackRate}
        onSelectQueueTrack={handleSelectTrack}
        onOpenEqualizer={() => setIsEqualizerOpen(true)}
        onOpenSleepTimer={() => setIsSleepTimerOpen(true)}
        onOpenRingtoneCutter={(t) => setRingtoneTrack(t)}
        onUpdateLyrics={handleUpdateLyrics}
        accentColor={activeTheme.primaryAccent}
      />

      {/* Equalizer Modal */}
      <EqualizerModal
        isOpen={isEqualizerOpen}
        onClose={() => setIsEqualizerOpen(false)}
        settings={eqSettings}
        onChange={setEqSettings}
        accentColor={activeTheme.primaryAccent}
        isPlaying={isPlaying}
      />

      {/* Ringtone Cutter Modal */}
      <RingtoneCutterModal
        isOpen={!!ringtoneTrack}
        onClose={() => setRingtoneTrack(null)}
        track={ringtoneTrack}
        accentColor={activeTheme.primaryAccent}
      />

      {/* Sleep Timer Modal */}
      <SleepTimerModal
        isOpen={isSleepTimerOpen}
        onClose={() => setIsSleepTimerOpen(false)}
        activeTimerRemaining={sleepTimerSeconds}
        onStartTimer={handleStartSleepTimer}
        onCancelTimer={() => setSleepTimerSeconds(null)}
        accentColor={activeTheme.primaryAccent}
      />

      {/* Driving Mode Modal */}
      <DrivingModeModal
        isOpen={isDrivingModeOpen}
        onClose={() => setIsDrivingModeOpen(false)}
        currentTrack={currentTrack}
        isPlaying={isPlaying}
        onTogglePlay={handleTogglePlay}
        onNext={handleNextTrack}
        onPrev={handlePrevTrack}
        onToggleFavorite={handleToggleFavorite}
        accentColor={activeTheme.primaryAccent}
      />

      {/* Theme Store Modal */}
      <ThemeStoreModal
        isOpen={isThemeStoreOpen}
        onClose={() => setIsThemeStoreOpen(false)}
        activeThemeId={activeTheme.id}
        onSelectTheme={(t) => setActiveTheme(t)}
        accentColor={activeTheme.primaryAccent}
      />

      {/* Google Drive Backup & Cloud Music Modal */}
      <GoogleDriveBackupModal
        isOpen={isDriveBackupOpen}
        onClose={() => setIsDriveBackupOpen(false)}
        tracks={tracks}
        playlists={playlists}
        eqSettings={eqSettings}
        onRestoreBackup={handleRestoreBackup}
        onImportDriveTrack={handleImportDriveTrack}
        accentColor={activeTheme.primaryAccent}
      />

      {/* Lark Player App Download & Install Modal */}
      <AppDownloadModal
        isOpen={isDownloadAppOpen}
        onClose={() => setIsDownloadAppOpen(false)}
        accentColor={activeTheme.primaryAccent}
      />
    </div>
  );
}
