import React from 'react';
import { MediaTrack } from '../../types/player';
import { formatTime, formatPlays } from '../../utils/formatters';
import { Play, TrendingUp, Flame, Music, Radio, Compass, Disc } from 'lucide-react';

interface TrendingTabProps {
  tracks: MediaTrack[];
  onSelectTrack: (track: MediaTrack) => void;
  accentColor: string;
}

export const TrendingTab: React.FC<TrendingTabProps> = ({
  tracks,
  onSelectTrack,
  accentColor
}) => {
  const genres = [
    { name: 'Pop Hits', color: 'from-pink-600 to-rose-400', icon: Music },
    { name: 'Hip-Hop & Trap', color: 'from-amber-600 to-orange-400', icon: Disc },
    { name: 'EDM & Dance', color: 'from-cyan-600 to-blue-400', icon: Radio },
    { name: 'Lo-Fi Chill', color: 'from-emerald-600 to-teal-400', icon: Compass },
    { name: 'Latin Vibes', color: 'from-purple-600 to-indigo-400', icon: Flame },
    { name: 'Acoustic Folk', color: 'from-yellow-600 to-amber-500', icon: Music }
  ];

  return (
    <div className="flex-1 flex flex-col overflow-y-auto pb-24 max-w-6xl mx-auto w-full px-4 pt-4 space-y-6">
      {/* Featured Banner */}
      <div className="relative rounded-3xl overflow-hidden p-6 md:p-8 bg-gradient-to-r from-purple-900/60 via-indigo-900/40 to-black/60 border border-white/10 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 max-w-md">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-cyan-400">
            <Flame className="w-4 h-4" />
            Lark Top Trending
          </div>
          <h2 className="text-2xl md:text-3xl font-extrabold text-white">
            Global Hot 50 Charts
          </h2>
          <p className="text-xs md:text-sm text-white/70">
            The most played tracks across the globe this week with synchronized lyrics and equalizer presets.
          </p>
          <div className="pt-2">
            <button
              onClick={() => {
                if (tracks.length > 0) onSelectTrack(tracks[0]);
              }}
              style={{ backgroundColor: accentColor }}
              className="flex items-center gap-2 px-5 py-2.5 rounded-2xl font-bold text-black text-xs hover:opacity-95 active:scale-95 transition-all shadow-lg"
            >
              <Play className="w-4 h-4 fill-black" />
              Play Chart Stream
            </button>
          </div>
        </div>

        {/* Featured Visual Album Art stack */}
        <div className="relative w-40 h-40 md:w-48 md:h-48 shrink-0">
          <img
            src="https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600&auto=format&fit=crop&q=80"
            alt="Chart artwork"
            className="w-full h-full object-cover rounded-3xl shadow-2xl border-2 border-white/20 -rotate-3 hover:rotate-0 transition-transform duration-300"
          />
        </div>
      </div>

      {/* Explore Genres Grid */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-bold text-sm text-white flex items-center gap-2">
            <Compass className="w-4 h-4 text-cyan-400" />
            Explore Music Genres
          </h3>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
          {genres.map((g, idx) => {
            const Icon = g.icon;
            return (
              <div
                key={g.name}
                onClick={() => {
                  const match = tracks[idx % tracks.length];
                  if (match) onSelectTrack(match);
                }}
                className={`p-3.5 rounded-2xl bg-gradient-to-br ${g.color} cursor-pointer active:scale-95 transition-transform shadow-lg flex flex-col justify-between h-24`}
              >
                <Icon className="w-5 h-5 text-white/80" />
                <span className="font-bold text-xs text-white">{g.name}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Trending Songs List */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-bold text-sm text-white flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-cyan-400" />
            Top Trending Hits Today
          </h3>
          <span className="text-xs text-white/50">Updated Hourly</span>
        </div>

        <div className="space-y-2">
          {tracks.map((track, index) => (
            <div
              key={track.id}
              onClick={() => onSelectTrack(track)}
              className="flex items-center justify-between p-3 rounded-2xl bg-[#161824] hover:bg-white/10 border border-white/5 cursor-pointer transition-all group"
            >
              {/* Rank Number + Album Art + Title */}
              <div className="flex items-center gap-3.5 flex-1 min-w-0">
                <span className="font-mono font-bold text-base w-6 text-center text-white/40 group-hover:text-cyan-400 transition-colors">
                  {(index + 1).toString().padStart(2, '0')}
                </span>

                <img
                  src={track.coverUrl}
                  alt={track.title}
                  className="w-12 h-12 rounded-xl object-cover shrink-0 shadow"
                />

                <div className="min-w-0 flex-1">
                  <div className="font-bold text-sm text-white truncate group-hover:text-cyan-300 transition-colors">
                    {track.title}
                  </div>
                  <div className="text-xs text-white/50 truncate flex items-center gap-1.5 mt-0.5">
                    <span>{track.artist}</span>
                    <span aria-hidden="true">·</span>
                    <span className="font-mono">{formatPlays(track.plays)} plays</span>
                  </div>
                </div>
              </div>

              {/* Quick Play & Duration */}
              <div className="flex items-center gap-3 shrink-0">
                <span className="text-xs font-mono text-white/40 hidden sm:inline">
                  {formatTime(track.duration)}
                </span>
                <div
                  style={{ backgroundColor: accentColor }}
                  className="w-8 h-8 rounded-full flex items-center justify-center text-black opacity-80 group-hover:opacity-100 shadow transition-opacity"
                >
                  <Play className="w-4 h-4 fill-black ml-0.5" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
