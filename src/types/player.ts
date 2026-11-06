export interface LyricLine {
  time: number; // in seconds
  text: string;
}

export interface MediaTrack {
  id: string;
  title: string;
  artist: string;
  album?: string;
  duration: number; // in seconds
  coverUrl: string;
  audioUrl: string;
  lyrics?: LyricLine[];
  isVideo?: boolean;
  videoUrl?: string;
  genre?: string;
  addedAt: number;
  isFavorite: boolean;
  source: 'demo' | 'local' | 'trending';
  plays: number;
  fileSize?: string;
}

export interface Playlist {
  id: string;
  title: string;
  description?: string;
  coverUrl: string;
  trackIds: string[];
  createdAt: number;
  isSystem?: boolean;
}

export type PlaybackMode = 'sequence' | 'repeat-all' | 'repeat-one' | 'shuffle';

export interface EqualizerSettings {
  enabled: boolean;
  preset: string;
  gains: number[]; // 5 bands: 60Hz, 230Hz, 910Hz, 3.6kHz, 14kHz (-12 to +12 dB)
  bassBoost: number; // 0 to 100
  surround3D: number; // 0 to 100
  volumeBoost: number; // 1.0 to 1.5
}

export type ActiveTab = 'music' | 'video' | 'trending' | 'me';
export type MusicSubTab = 'songs' | 'playlists' | 'artists' | 'albums' | 'favorites';

export interface AppTheme {
  id: string;
  name: string;
  color: string;
  previewGradient: string;
  primaryAccent: string;
  accentBg: string;
  bodyBg: string;
  cardBg: string;
  borderCol: string;
  textCol: string;
  isGlass?: boolean;
}

export type VisualizerMode = 'bars' | 'wave' | 'circle' | 'fire';

export interface CustomBackgroundConfig {
  id: string;
  name: string;
  type: 'preset' | 'upload' | 'url';
  presetId?: string;
  imageUrl?: string;
  gradient?: string;
  blur: 'none' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  glassOpacity: number; // 0.1 to 0.7
  ambientBeatGlow: boolean;
  vignette: boolean;
}

