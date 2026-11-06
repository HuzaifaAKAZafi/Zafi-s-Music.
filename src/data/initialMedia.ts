import { MediaTrack, Playlist, EqualizerSettings, AppTheme } from '../types/player';

export const INITIAL_TRACKS: MediaTrack[] = [
  {
    id: 'track-1',
    title: 'Neon Horizon',
    artist: 'Lark Waves',
    album: 'Cyber Echoes Vol. 1',
    duration: 184,
    coverUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80',
    audioUrl: 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=lofi-study-112191.mp3',
    genre: 'Synthwave / Lo-Fi',
    addedAt: Date.now() - 1000 * 60 * 60 * 24 * 3,
    isFavorite: true,
    source: 'demo',
    plays: 142,
    fileSize: '4.2 MB',
    lyrics: [
      { time: 0, text: '♪ (Smooth Synthwave Intro) ♪' },
      { time: 8, text: 'Cruising through the city neon glow' },
      { time: 14, text: 'Streetlights flashing by as shadows slow' },
      { time: 21, text: 'Drifting in the midnight rain tonight' },
      { time: 28, text: 'Everything is bathed in electric light' },
      { time: 36, text: 'Turn the volume up and let it roll' },
      { time: 43, text: 'Feel the rhythm deep inside your soul' },
      { time: 51, text: '♪ (Bass Drop & Melodic Synth) ♪' },
      { time: 66, text: 'Echoes of the dream we used to chase' },
      { time: 73, text: 'Lost within this futuristic space' },
      { time: 82, text: 'Higher than the clouds above the skyline' },
      { time: 90, text: 'Watching every star and constellation shine' },
      { time: 99, text: '♪ (Synthesizer Solo) ♪' },
      { time: 118, text: 'Never looking back, we run the night' },
      { time: 126, text: 'Bathed forever in this vibrant light' },
      { time: 135, text: 'Turn the volume up and let it roll' },
      { time: 142, text: 'Feel the rhythm deep inside your soul' },
      { time: 155, text: '♪ (Smooth Outro Fade) ♪' }
    ]
  },
  {
    id: 'track-2',
    title: 'Midnight Chill Beats',
    artist: 'Coffee & Rain',
    album: 'Lofi Study Session',
    duration: 145,
    coverUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&auto=format&fit=crop&q=80',
    audioUrl: 'https://cdn.pixabay.com/download/audio/2022/01/18/audio_d0a13f69d2.mp3?filename=chill-abstract-intention-12099.mp3',
    genre: 'Chillhop',
    addedAt: Date.now() - 1000 * 60 * 60 * 24 * 5,
    isFavorite: true,
    source: 'demo',
    plays: 89,
    fileSize: '3.4 MB',
    lyrics: [
      { time: 0, text: '♪ (Gentle Vinyl Crackle & Piano Chords) ♪' },
      { time: 10, text: 'Rain drops falling on the window glass' },
      { time: 18, text: 'Watching peaceful afternoon time pass' },
      { time: 26, text: 'A warm cup in my hands, a steady mind' },
      { time: 35, text: 'Leaving all the noisy world behind' },
      { time: 45, text: '♪ (Snare & Hip-Hop Kick Groove) ♪' },
      { time: 60, text: 'Pages turning slowly in the quiet room' },
      { time: 69, text: 'Flowers in the evening start to bloom' },
      { time: 80, text: 'Deep breath in, let the worries fade away' },
      { time: 92, text: 'Finding peace at the closing of the day' },
      { time: 105, text: '♪ (Rhodes Piano Solitude) ♪' },
      { time: 125, text: 'Drifting softly into sweet dreamland' },
      { time: 135, text: '♪ (Vinyl Fade Out) ♪' }
    ]
  },
  {
    id: 'track-3',
    title: 'Electric Velocity',
    artist: 'Cyber Pulse',
    album: 'Hyperdrive Future',
    duration: 172,
    coverUrl: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=600&auto=format&fit=crop&q=80',
    audioUrl: 'https://cdn.pixabay.com/download/audio/2022/03/15/audio_c8c8a73467.mp3?filename=electronic-future-beats-117997.mp3',
    genre: 'EDM / Dance',
    addedAt: Date.now() - 1000 * 60 * 60 * 24 * 1,
    isFavorite: false,
    source: 'demo',
    plays: 215,
    fileSize: '4.8 MB',
    lyrics: [
      { time: 0, text: '♪ (Arpeggiated Synth Build-Up) ♪' },
      { time: 12, text: '3... 2... 1... Accelerate!' },
      { time: 16, text: 'Can you feel the pulse begin to rise?' },
      { time: 22, text: 'Laser beams reflect across your eyes' },
      { time: 28, text: 'Speed of sound, breaking through the wall' },
      { time: 33, text: 'When the bass hits, we will never fall' },
      { time: 38, text: '♪ [BUILD UP] ♪' },
      { time: 44, text: 'LET THE BASS DROP!' },
      { time: 46, text: '♪ (Heavy Electro Drop & Wobble) ♪' },
      { time: 68, text: 'Hands up high, reach into the sky' },
      { time: 74, text: 'Watch the energetic spark ignite' },
      { time: 82, text: 'Velocity is taking over now' },
      { time: 88, text: 'No stopping us, no question how' },
      { time: 96, text: '♪ (High Energy Second Drop) ♪' },
      { time: 125, text: 'Electric shock, electric fire!' },
      { time: 140, text: 'Pushing all the frequencies higher!' },
      { time: 155, text: '♪ (Filter Sweep Outro) ♪' }
    ]
  },
  {
    id: 'track-4',
    title: 'Acoustic Sunset',
    artist: 'Elena Cruz',
    album: 'Wooden Strings',
    duration: 162,
    coverUrl: 'https://images.unsplash.com/photo-1510915361894-db8b60106cb1?w=600&auto=format&fit=crop&q=80',
    audioUrl: 'https://cdn.pixabay.com/download/audio/2022/01/26/audio_d0c6ff1101.mp3?filename=acoustic-guitars-ambient-uplifting-112187.mp3',
    genre: 'Acoustic Folk',
    addedAt: Date.now() - 1000 * 60 * 60 * 24 * 8,
    isFavorite: true,
    source: 'demo',
    plays: 64,
    fileSize: '3.8 MB',
    lyrics: [
      { time: 0, text: '♪ (Gentle Fingerpicking Acoustic Guitar) ♪' },
      { time: 12, text: 'Golden hour painting all the sea' },
      { time: 19, text: 'Salty breezes blowing wild and free' },
      { time: 27, text: 'Sitting on the dock as day turns dusk' },
      { time: 34, text: 'In the simple moments that we trust' },
      { time: 42, text: 'Sing a song for all the days gone by' },
      { time: 50, text: 'Watch the orange fire in the sky' },
      { time: 58, text: '♪ (Harmonica & Guitar Strumming) ♪' },
      { time: 75, text: 'Whisper words of love into the wind' },
      { time: 83, text: 'Knowing where tomorrow will begin' },
      { time: 91, text: 'Take my hand and let the world stand still' },
      { time: 99, text: 'Echoing across the ocean hill' },
      { time: 110, text: '♪ (Warm Acoustic Cadence) ♪' },
      { time: 135, text: 'Goodnight golden sun, till morning light' },
      { time: 148, text: '♪ (Final Guitar Chord Ring) ♪' }
    ]
  },
  {
    id: 'track-5',
    title: 'Urban Flow & Rhymes',
    artist: 'DJ Skyline',
    album: 'Downtown Streets',
    duration: 150,
    coverUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=600&auto=format&fit=crop&q=80',
    audioUrl: 'https://cdn.pixabay.com/download/audio/2022/10/14/audio_9939f777a3.mp3?filename=tuesday-glitch-122413.mp3',
    genre: 'Hip Hop / Trap',
    addedAt: Date.now() - 1000 * 60 * 60 * 24 * 2,
    isFavorite: false,
    source: 'demo',
    plays: 178,
    fileSize: '4.1 MB',
    lyrics: [
      { time: 0, text: '♪ (Boom Bap Drum Kick & Brass Stabs) ♪' },
      { time: 8, text: 'Yeah, Lark Player in the ride, let’s go' },
      { time: 14, text: 'Rolling through the downtown avenue slow' },
      { time: 20, text: 'Got the heavy 808 kicking in the trunk' },
      { time: 26, text: 'Real sound quality, no fake and no junk' },
      { time: 33, text: 'Equalizer dialed in, bass boost on ten' },
      { time: 39, text: 'Play that favorite record back around again' },
      { time: 46, text: '♪ (Scratch Hook & Chorus) ♪' },
      { time: 60, text: 'From the morning hustle to the late night grind' },
      { time: 66, text: 'Only positive vibrations on my mind' },
      { time: 74, text: 'Turn the track up, let the speakers sing' },
      { time: 81, text: 'Music is the crown and the rhythm is the king' },
      { time: 90, text: '♪ (Trap Hi-Hats & Synth Groove) ♪' },
      { time: 115, text: 'Lark style forever, keeping it true' },
      { time: 125, text: 'Every beat engineered just for you' },
      { time: 138, text: '♪ (Fade Out with 808 sub) ♪' }
    ]
  }
];

export const INITIAL_VIDEOS: MediaTrack[] = [
  {
    id: 'video-1',
    title: 'Cyberpunk City Neon Flythrough',
    artist: 'Future Visuals 4K',
    duration: 30,
    coverUrl: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=600&auto=format&fit=crop&q=80',
    audioUrl: '',
    isVideo: true,
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    genre: 'Sci-Fi / 4K',
    addedAt: Date.now() - 1000 * 60 * 60 * 24 * 4,
    isFavorite: true,
    source: 'demo',
    plays: 540,
    fileSize: '12.4 MB'
  },
  {
    id: 'video-2',
    title: 'Big Buck Bunny (Animation Clip)',
    artist: 'Blender Open Studio',
    duration: 60,
    coverUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=600&auto=format&fit=crop&q=80',
    audioUrl: '',
    isVideo: true,
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    genre: 'Animation / 1080p',
    addedAt: Date.now() - 1000 * 60 * 60 * 24 * 7,
    isFavorite: false,
    source: 'demo',
    plays: 920,
    fileSize: '24.8 MB'
  },
  {
    id: 'video-3',
    title: 'Tears of Steel Sci-Fi VFX',
    artist: 'Mango Open VFX Project',
    duration: 45,
    coverUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&auto=format&fit=crop&q=80',
    audioUrl: '',
    isVideo: true,
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
    genre: 'Cinematic Cinema',
    addedAt: Date.now() - 1000 * 60 * 60 * 24 * 12,
    isFavorite: true,
    source: 'demo',
    plays: 1340,
    fileSize: '18.2 MB'
  }
];

export const INITIAL_PLAYLISTS: Playlist[] = [
  {
    id: 'pl-favorites',
    title: 'Favorites',
    description: 'Your favorite tracks in one place',
    coverUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600&auto=format&fit=crop&q=80',
    trackIds: ['track-1', 'track-2', 'track-4'],
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 30,
    isSystem: true
  },
  {
    id: 'pl-lark-top',
    title: 'Lark Global Top Hits',
    description: 'Trending chart toppers this week',
    coverUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=600&auto=format&fit=crop&q=80',
    trackIds: ['track-3', 'track-1', 'track-5'],
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 15
  },
  {
    id: 'pl-chill-relax',
    title: 'Midnight Focus & Chill',
    description: 'Lo-Fi beats, soft rain, and ambient study vibes',
    coverUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&auto=format&fit=crop&q=80',
    trackIds: ['track-2', 'track-4'],
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 10
  }
];

export const EQUALIZER_PRESETS: Record<string, number[]> = {
  'Normal': [0, 0, 0, 0, 0],
  'Pop': [-1, 2, 5, 2, -1],
  'Rock': [4, 2, -1, 3, 5],
  'Jazz': [3, 1, 2, 3, 4],
  'Classical': [4, 2, -1, 2, 4],
  'Hip Hop': [5, 3, 0, 1, 3],
  'Electronic': [5, 3, 0, 2, 4],
  'Dance': [4, 2, 1, 3, 4],
  'Heavy Metal': [4, 1, -2, 4, 3],
  'Bass Boost': [8, 5, 1, 0, 0],
  'Vocal Boost': [-2, 1, 4, 3, 1],
  'Flat': [0, 0, 0, 0, 0]
};

export const DEFAULT_EQ_SETTINGS: EqualizerSettings = {
  enabled: true,
  preset: 'Pop',
  gains: [-1, 2, 5, 2, -1],
  bassBoost: 35,
  surround3D: 25,
  volumeBoost: 1.0
};

export interface PresetBackground {
  id: string;
  name: string;
  subtitle: string;
  category: 'fiery' | 'cosmic' | 'glass' | 'nature' | 'cyber';
  preview: string;
  cssBackground: string;
  ambientGlowColor: string;
  accentColor: string;
}

export const PRESET_BACKGROUNDS: PresetBackground[] = [
  {
    id: 'zafi-fiery-inferno',
    name: "Zafi Fiery Inferno",
    subtitle: 'Signature Glass with Flame Embers & Obsidian',
    category: 'fiery',
    preview: '/logo.jpg',
    cssBackground: 'radial-gradient(circle at 50% 25%, rgba(255, 94, 0, 0.35) 0%, rgba(220, 38, 38, 0.2) 40%, rgba(10, 6, 8, 0.96) 75%), #080406',
    ambientGlowColor: 'rgba(255, 107, 0, 0.55)',
    accentColor: '#FF6B00'
  },
  {
    id: 'cosmic-aurora',
    name: 'Cosmic Nebula Aurora',
    subtitle: 'Deep Space Cyan, Indigo & Starlight Glass',
    category: 'cosmic',
    preview: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?w=600&auto=format&fit=crop&q=80',
    cssBackground: 'radial-gradient(circle at 20% 30%, rgba(0, 229, 255, 0.3) 0%, rgba(99, 102, 241, 0.22) 40%, rgba(6, 9, 20, 0.96) 80%), #040711',
    ambientGlowColor: 'rgba(0, 229, 255, 0.5)',
    accentColor: '#00E5FF'
  },
  {
    id: 'cyber-amethyst',
    name: 'Cyberpunk Amethyst',
    subtitle: 'Neon Magenta, Violet Crystal & Smoked Quartz',
    category: 'cyber',
    preview: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&auto=format&fit=crop&q=80',
    cssBackground: 'radial-gradient(circle at 80% 20%, rgba(236, 72, 153, 0.3) 0%, rgba(139, 92, 246, 0.22) 45%, rgba(11, 7, 20, 0.96) 85%), #07040D',
    ambientGlowColor: 'rgba(217, 70, 239, 0.5)',
    accentColor: '#E879F9'
  },
  {
    id: 'emerald-mirage',
    name: 'Emerald Bioluminescence',
    subtitle: 'Electric Mint, Dark Moss & Deep Velvet',
    category: 'nature',
    preview: 'https://images.unsplash.com/photo-1511447333015-45b65e60f6d5?w=600&auto=format&fit=crop&q=80',
    cssBackground: 'radial-gradient(circle at 30% 70%, rgba(16, 185, 129, 0.28) 0%, rgba(6, 78, 59, 0.25) 50%, rgba(4, 14, 10, 0.97) 85%), #030B07',
    ambientGlowColor: 'rgba(16, 185, 129, 0.45)',
    accentColor: '#10B981'
  },
  {
    id: 'pure-diamond-glass',
    name: 'Crystalline Diamond Glass',
    subtitle: 'Ultra-Pure Transparent Frost with Silver Highlights',
    category: 'glass',
    preview: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=600&auto=format&fit=crop&q=80',
    cssBackground: 'radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 0.16) 0%, rgba(148, 163, 184, 0.15) 50%, rgba(10, 13, 22, 0.98) 90%), #080A12',
    ambientGlowColor: 'rgba(255, 255, 255, 0.35)',
    accentColor: '#38BDF8'
  },
  {
    id: 'midnight-sunset',
    name: 'Midnight Sunset Horizons',
    subtitle: 'Rich Dusk Crimson, Amber & Royal Purple',
    category: 'fiery',
    preview: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=600&auto=format&fit=crop&q=80',
    cssBackground: 'radial-gradient(circle at 70% 30%, rgba(249, 115, 22, 0.28) 0%, rgba(190, 24, 93, 0.22) 45%, rgba(13, 8, 18, 0.96) 80%), #08050C',
    ambientGlowColor: 'rgba(249, 115, 22, 0.45)',
    accentColor: '#FB923C'
  }
];

export const DEFAULT_BG_CONFIG: CustomBackgroundConfig = {
  id: 'zafi-fiery-inferno',
  name: "Zafi Fiery Inferno",
  type: 'preset',
  presetId: 'zafi-fiery-inferno',
  blur: 'xl',
  glassOpacity: 0.35,
  ambientBeatGlow: true,
  vignette: true
};

export const LARK_THEMES: AppTheme[] = [
  {
    id: 'zafi-fiery-glass',
    name: "Zafi Fiery Glass (Official)",
    color: '#FF6B00',
    previewGradient: 'from-[#120603] via-[#331100] to-[#FF6B00]',
    primaryAccent: '#FF6B00',
    accentBg: 'bg-[#FF6B00]',
    bodyBg: 'bg-transparent',
    cardBg: 'bg-white/[0.05] backdrop-blur-2xl',
    borderCol: 'border-white/10',
    textCol: 'text-white',
    isGlass: true
  },
  {
    id: 'lark-cyan-glass',
    name: 'Frosted Cyan Glass',
    color: '#00E5FF',
    previewGradient: 'from-[#050B14] via-[#0A1A2E] to-[#00E5FF]',
    primaryAccent: '#00E5FF',
    accentBg: 'bg-[#00E5FF]',
    bodyBg: 'bg-transparent',
    cardBg: 'bg-white/[0.05] backdrop-blur-2xl',
    borderCol: 'border-white/10',
    textCol: 'text-white',
    isGlass: true
  },
  {
    id: 'amethyst-glass',
    name: 'Amethyst Crystal Glass',
    color: '#E879F9',
    previewGradient: 'from-[#0D0518] via-[#240E3E] to-[#E879F9]',
    primaryAccent: '#E879F9',
    accentBg: 'bg-[#E879F9]',
    bodyBg: 'bg-transparent',
    cardBg: 'bg-white/[0.05] backdrop-blur-2xl',
    borderCol: 'border-white/10',
    textCol: 'text-white',
    isGlass: true
  },
  {
    id: 'emerald-glass',
    name: 'Emerald Mirage Glass',
    color: '#10B981',
    previewGradient: 'from-[#03140C] via-[#092B1B] to-[#10B981]',
    primaryAccent: '#10B981',
    accentBg: 'bg-[#10B981]',
    bodyBg: 'bg-transparent',
    cardBg: 'bg-white/[0.05] backdrop-blur-2xl',
    borderCol: 'border-white/10',
    textCol: 'text-white',
    isGlass: true
  },
  {
    id: 'diamond-ice-glass',
    name: 'Diamond Ice Glass',
    color: '#38BDF8',
    previewGradient: 'from-[#090D18] via-[#141C30] to-[#38BDF8]',
    primaryAccent: '#38BDF8',
    accentBg: 'bg-[#38BDF8]',
    bodyBg: 'bg-transparent',
    cardBg: 'bg-white/[0.06] backdrop-blur-2xl',
    borderCol: 'border-white/15',
    textCol: 'text-white',
    isGlass: true
  },
  {
    id: 'obsidian-smoked-glass',
    name: 'Obsidian Smoked Glass',
    color: '#F43F5E',
    previewGradient: 'from-[#050508] via-[#161622] to-[#F43F5E]',
    primaryAccent: '#F43F5E',
    accentBg: 'bg-[#F43F5E]',
    bodyBg: 'bg-transparent',
    cardBg: 'bg-white/[0.04] backdrop-blur-2xl',
    borderCol: 'border-white/10',
    textCol: 'text-white',
    isGlass: true
  }
];

