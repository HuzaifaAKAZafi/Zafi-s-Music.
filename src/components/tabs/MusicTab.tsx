import React, { useState } from 'react';
import { MediaTrack, Playlist, MusicSubTab } from '../../types/player';
import { formatTime } from '../../utils/formatters';
import {
  Search,
  Shuffle,
  FolderPlus,
  Heart,
  MoreVertical,
  Play,
  Plus,
  Scissors,
  Music,
  ListMusic,
  User,
  Disc,
  Trash2,
  ListPlus,
  Activity
} from 'lucide-react';
import { MusicVisualizer } from '../MusicVisualizer';

interface MusicTabProps {
  tracks: MediaTrack[];
  playlists: Playlist[];
  currentTrack: MediaTrack | null;
  isPlaying: boolean;
  onSelectTrack: (track: MediaTrack) => void;
  onShuffleAll: () => void;
  onToggleFavorite: (id: string) => void;
  onOpenRingtoneCutter: (track: MediaTrack) => void;
  onImportFiles: (files: FileList) => void;
  onCreatePlaylist: (title: string) => void;
  onAddToPlaylist: (playlistId: string, trackId: string) => void;
  onDeleteTrack: (trackId: string) => void;
  accentColor: string;
}

export const MusicTab: React.FC<MusicTabProps> = ({
  tracks,
  playlists,
  currentTrack,
  isPlaying,
  onSelectTrack,
  onShuffleAll,
  onToggleFavorite,
  onOpenRingtoneCutter,
  onImportFiles,
  onCreatePlaylist,
  onAddToPlaylist,
  onDeleteTrack,
  accentColor
}) => {
  const [activeSubTab, setActiveSubTab] = useState<MusicSubTab>('songs');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeMenuTrackId, setActiveMenuTrackId] = useState<string | null>(null);
  const [selectedPlaylistId, setSelectedPlaylistId] = useState<string | null>(null);
  const [newPlaylistTitle, setNewPlaylistTitle] = useState('');
  const [showCreatePlaylistModal, setShowCreatePlaylistModal] = useState(false);
  const [showAddToPlaylistModal, setShowAddToPlaylistModal] = useState<string | null>(null);
  const [showLiveVisualizer, setShowLiveVisualizer] = useState(true);

  // Filter tracks by search query
  const filteredTracks = tracks.filter((t) => {
    const q = searchQuery.toLowerCase();
    return t.title.toLowerCase().includes(q) || t.artist.toLowerCase().includes(q);
  });

  // Favorites list
  const favoriteTracks = tracks.filter((t) => t.isFavorite);

  // Group by Artist
  const artistMap = tracks.reduce((acc, t) => {
    const artist = t.artist || 'Unknown Artist';
    if (!acc[artist]) acc[artist] = [];
    acc[artist].push(t);
    return acc;
  }, {} as Record<string, MediaTrack[]>);

  // Group by Album
  const albumMap = tracks.reduce((acc, t) => {
    const album = t.album || 'Single Tracks';
    if (!acc[album]) acc[album] = [];
    acc[album].push(t);
    return acc;
  }, {} as Record<string, MediaTrack[]>);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onImportFiles(e.target.files);
    }
  };

  const handleCreateNewPlaylist = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPlaylistTitle.trim()) return;
    onCreatePlaylist(newPlaylistTitle.trim());
    setNewPlaylistTitle('');
    setShowCreatePlaylistModal(false);
  };

  return (
    <div className="flex-1 flex flex-col overflow-y-auto pb-24">
      {/* Top Search & Scan Toolbar */}
      <div className="px-4 pt-4 pb-2 max-w-6xl mx-auto w-full">
        <div className="flex items-center gap-2 mb-3">
          {/* Search bar */}
          <div className="flex-1 relative flex items-center">
            <Search className="w-4 h-4 absolute left-3.5 text-white/40" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search songs, artists, albums..."
              className="w-full bg-white/[0.05] backdrop-blur-xl border border-white/10 rounded-2xl pl-10 pr-4 py-2 text-sm text-white placeholder-white/40 focus:outline-none focus:border-cyan-400 transition-colors shadow-inner"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 text-xs text-white/40 hover:text-white"
              >
                Clear
              </button>
            )}
          </div>

          {/* Real-time Music Visualizer Banner Toggle */}
          <button
            onClick={() => setShowLiveVisualizer(!showLiveVisualizer)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-2xl text-xs font-semibold cursor-pointer active:scale-95 transition-all shrink-0 border ${
              showLiveVisualizer
                ? 'bg-white/20 text-white border-white/30 shadow-md font-bold'
                : 'bg-white/10 hover:bg-white/15 text-white/80 border-white/10'
            }`}
            title="Toggle Live Music Visualizer"
          >
            <Activity className="w-4 h-4" style={{ color: accentColor }} />
            <span className="hidden sm:inline">Visualizer</span>
          </button>

          {/* Import / Scan Media File Button */}
          <label
            title="Scan & Import Local Audio Files"
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-white/10 hover:bg-white/15 text-white text-xs font-semibold cursor-pointer active:scale-95 transition-all shrink-0 border border-white/10"
          >
            <FolderPlus className="w-4 h-4 text-cyan-400" />
            <span className="hidden sm:inline">Import Songs</span>
            <input
              type="file"
              accept="audio/*"
              multiple
              onChange={handleFileInput}
              className="hidden"
            />
          </label>
        </div>

        {/* Live Docked Music Visualizer */}
        {showLiveVisualizer && (
          <div className="mb-3 animate-fadeIn">
            <MusicVisualizer
              isPlaying={isPlaying}
              accentColor={accentColor}
              height={100}
              showControls={true}
              mode="bars"
              className="border border-white/15 shadow-xl"
            />
          </div>
        )}

        {/* Sub-Tabs: Songs | Playlists | Artists | Albums | Favorites */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 no-scrollbar border-b border-white/10 text-xs font-medium">
          <button
            onClick={() => {
              setActiveSubTab('songs');
              setSelectedPlaylistId(null);
            }}
            className={`px-3 py-2 rounded-xl transition-all flex items-center gap-1.5 shrink-0 ${
              activeSubTab === 'songs' && !selectedPlaylistId
                ? 'font-bold text-black'
                : 'text-white/60 hover:text-white'
            }`}
            style={{
              backgroundColor: activeSubTab === 'songs' && !selectedPlaylistId ? accentColor : undefined
            }}
          >
            <Music className="w-3.5 h-3.5" />
            Songs ({tracks.length})
          </button>

          <button
            onClick={() => {
              setActiveSubTab('playlists');
              setSelectedPlaylistId(null);
            }}
            className={`px-3 py-2 rounded-xl transition-all flex items-center gap-1.5 shrink-0 ${
              activeSubTab === 'playlists'
                ? 'font-bold text-black'
                : 'text-white/60 hover:text-white'
            }`}
            style={{
              backgroundColor: activeSubTab === 'playlists' ? accentColor : undefined
            }}
          >
            <ListMusic className="w-3.5 h-3.5" />
            Playlists ({playlists.length})
          </button>

          <button
            onClick={() => {
              setActiveSubTab('favorites');
              setSelectedPlaylistId(null);
            }}
            className={`px-3 py-2 rounded-xl transition-all flex items-center gap-1.5 shrink-0 ${
              activeSubTab === 'favorites'
                ? 'font-bold text-black'
                : 'text-white/60 hover:text-white'
            }`}
            style={{
              backgroundColor: activeSubTab === 'favorites' ? accentColor : undefined
            }}
          >
            <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500" />
            Favorites ({favoriteTracks.length})
          </button>

          <button
            onClick={() => {
              setActiveSubTab('artists');
              setSelectedPlaylistId(null);
            }}
            className={`px-3 py-2 rounded-xl transition-all flex items-center gap-1.5 shrink-0 ${
              activeSubTab === 'artists'
                ? 'font-bold text-black'
                : 'text-white/60 hover:text-white'
            }`}
            style={{
              backgroundColor: activeSubTab === 'artists' ? accentColor : undefined
            }}
          >
            <User className="w-3.5 h-3.5" />
            Artists ({Object.keys(artistMap).length})
          </button>

          <button
            onClick={() => {
              setActiveSubTab('albums');
              setSelectedPlaylistId(null);
            }}
            className={`px-3 py-2 rounded-xl transition-all flex items-center gap-1.5 shrink-0 ${
              activeSubTab === 'albums'
                ? 'font-bold text-black'
                : 'text-white/60 hover:text-white'
            }`}
            style={{
              backgroundColor: activeSubTab === 'albums' ? accentColor : undefined
            }}
          >
            <Disc className="w-3.5 h-3.5" />
            Albums ({Object.keys(albumMap).length})
          </button>
        </div>
      </div>

      {/* Main Subtab Views */}
      <div className="px-4 py-3 max-w-6xl mx-auto w-full">
        {/* VIEW 1: SONGS & FAVORITES */}
        {(activeSubTab === 'songs' || activeSubTab === 'favorites') && !selectedPlaylistId && (
          <div>
            {/* Action Strip: Shuffle All & Track Count */}
            <div className="flex items-center justify-between mb-3 text-xs text-white/60">
              <div className="flex items-center gap-2">
                <span>
                  {activeSubTab === 'favorites'
                    ? `${favoriteTracks.length} Favorite Songs`
                    : `${filteredTracks.length} Songs Available`}
                </span>
              </div>
              <button
                onClick={onShuffleAll}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 text-white active:scale-95 transition-all font-semibold"
              >
                <Shuffle className="w-3.5 h-3.5 text-cyan-400" />
                <span>Shuffle All</span>
              </button>
            </div>

            {/* Song List */}
            <div className="space-y-1.5">
              {(activeSubTab === 'favorites' ? favoriteTracks : filteredTracks).map((track, idx) => {
                const isCurrent = currentTrack?.id === track.id;
                const isMenuOpen = activeMenuTrackId === track.id;

                return (
                  <div
                    key={track.id}
                    className={`group relative flex items-center justify-between p-2.5 rounded-2xl transition-all cursor-pointer ${
                      isCurrent
                        ? 'bg-white/15 border border-white/20 shadow-md'
                        : 'hover:bg-white/5 border border-transparent'
                    }`}
                  >
                    {/* Left: Track index or playing indicator + Album art + Info */}
                    <div
                      onClick={() => onSelectTrack(track)}
                      className="flex items-center gap-3 flex-1 min-w-0"
                    >
                      <div className="relative w-12 h-12 rounded-xl overflow-hidden shrink-0 shadow-md bg-black/40">
                        <img
                          src={track.coverUrl}
                          alt={track.title}
                          className="w-full h-full object-cover"
                        />
                        {isCurrent && (
                          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                            {isPlaying ? (
                              <div className="flex items-end gap-[2px] h-4">
                                <span className="w-1 bg-cyan-400 h-full animate-bounce rounded-full" />
                                <span className="w-1 bg-cyan-400 h-2/3 animate-bounce delay-100 rounded-full" />
                                <span className="w-1 bg-cyan-400 h-4/5 animate-bounce delay-200 rounded-full" />
                              </div>
                            ) : (
                              <Play className="w-4 h-4 text-white fill-white" />
                            )}
                          </div>
                        )}
                      </div>

                      <div className="min-w-0 flex-1">
                        <div
                          className={`text-sm font-semibold truncate ${
                            isCurrent ? 'font-bold' : 'text-white'
                          }`}
                          style={{ color: isCurrent ? accentColor : undefined }}
                        >
                          {track.title}
                        </div>
                        <div className="text-xs text-white/50 truncate flex items-center gap-1.5 mt-0.5">
                          <span>{track.artist}</span>
                          {track.album && (
                            <>
                              <span aria-hidden="true">·</span>
                              <span>{track.album}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Right: Favorite + Duration + 3-dot Menu */}
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onToggleFavorite(track.id);
                        }}
                        className="p-2 text-white/40 hover:text-rose-500 transition-colors"
                        title="Toggle Favorite"
                      >
                        <Heart
                          className={`w-4 h-4 ${
                            track.isFavorite ? 'fill-rose-500 text-rose-500' : ''
                          }`}
                        />
                      </button>

                      <span className="text-xs font-mono text-white/40 hidden sm:inline">
                        {formatTime(track.duration)}
                      </span>

                      {/* 3-dot Action Menu */}
                      <div className="relative">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveMenuTrackId(isMenuOpen ? null : track.id);
                          }}
                          className="p-2 text-white/40 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
                        >
                          <MoreVertical className="w-4 h-4" />
                        </button>

                        {isMenuOpen && (
                          <div
                            onClick={(e) => e.stopPropagation()}
                            className="absolute right-0 top-8 z-30 w-44 bg-[#1C1F2E] border border-white/10 rounded-2xl p-1.5 shadow-2xl flex flex-col gap-1 text-xs"
                          >
                            <button
                              onClick={() => {
                                onSelectTrack(track);
                                setActiveMenuTrackId(null);
                              }}
                              className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-white/10 text-white"
                            >
                              <Play className="w-3.5 h-3.5 text-cyan-400" />
                              <span>Play Track</span>
                            </button>

                            <button
                              onClick={() => {
                                setShowAddToPlaylistModal(track.id);
                                setActiveMenuTrackId(null);
                              }}
                              className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-white/10 text-white"
                            >
                              <ListPlus className="w-3.5 h-3.5 text-purple-400" />
                              <span>Add to Playlist</span>
                            </button>

                            <button
                              onClick={() => {
                                onOpenRingtoneCutter(track);
                                setActiveMenuTrackId(null);
                              }}
                              className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-white/10 text-white"
                            >
                              <Scissors className="w-3.5 h-3.5 text-amber-400" />
                              <span>Set Ringtone</span>
                            </button>

                            <button
                              onClick={() => {
                                onDeleteTrack(track.id);
                                setActiveMenuTrackId(null);
                              }}
                              className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-rose-500/20 text-rose-300"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              <span>Delete Track</span>
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}

              {filteredTracks.length === 0 && (
                <div className="py-12 text-center text-white/50">
                  <Music className="w-10 h-10 mx-auto mb-2 opacity-30" />
                  <p className="text-sm">No songs match your search</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* VIEW 2: PLAYLISTS */}
        {activeSubTab === 'playlists' && !selectedPlaylistId && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs text-white/60">Manage your music collections</span>
              <button
                onClick={() => setShowCreatePlaylistModal(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-semibold"
              >
                <Plus className="w-3.5 h-3.5 text-cyan-400" />
                <span>New Playlist</span>
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {playlists.map((pl) => (
                <div
                  key={pl.id}
                  onClick={() => setSelectedPlaylistId(pl.id)}
                  className="group bg-[#161824] border border-white/5 hover:border-white/20 rounded-2xl p-3 cursor-pointer transition-all hover:scale-[1.02]"
                >
                  <div className="relative aspect-square rounded-xl overflow-hidden mb-2.5 shadow-md bg-black/40">
                    <img src={pl.coverUrl} alt={pl.title} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <div
                        style={{ backgroundColor: accentColor }}
                        className="w-10 h-10 rounded-full flex items-center justify-center text-black shadow-lg"
                      >
                        <Play className="w-5 h-5 fill-black ml-0.5" />
                      </div>
                    </div>
                  </div>
                  <h4 className="font-bold text-sm text-white truncate">{pl.title}</h4>
                  <p className="text-xs text-white/50 truncate">
                    {pl.trackIds.length} {pl.trackIds.length === 1 ? 'song' : 'songs'}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* VIEW 2B: PLAYLIST DETAIL VIEW */}
        {selectedPlaylistId && (
          <div>
            {(() => {
              const currentPl = playlists.find((p) => p.id === selectedPlaylistId);
              if (!currentPl) return null;
              const plTracks = tracks.filter((t) => currentPl.trackIds.includes(t.id));

              return (
                <div className="space-y-4">
                  <div className="flex items-center gap-4 p-4 bg-white/5 rounded-3xl border border-white/10">
                    <img
                      src={currentPl.coverUrl}
                      alt={currentPl.title}
                      className="w-24 h-24 rounded-2xl object-cover shadow-lg"
                    />
                    <div className="flex-1 min-w-0">
                      <button
                        onClick={() => setSelectedPlaylistId(null)}
                        className="text-xs text-cyan-400 hover:underline mb-1"
                      >
                        ← Back to Playlists
                      </button>
                      <h3 className="text-xl font-bold text-white truncate">{currentPl.title}</h3>
                      <p className="text-xs text-white/60 truncate mt-0.5">
                        {currentPl.description || `${plTracks.length} songs`}
                      </p>
                    </div>
                  </div>

                  {/* Playlist Songs */}
                  <div className="space-y-1.5">
                    {plTracks.map((t) => (
                      <div
                        key={t.id}
                        onClick={() => onSelectTrack(t)}
                        className="flex items-center justify-between p-2.5 rounded-2xl hover:bg-white/5 cursor-pointer"
                      >
                        <div className="flex items-center gap-3">
                          <img
                            src={t.coverUrl}
                            alt={t.title}
                            className="w-10 h-10 rounded-xl object-cover"
                          />
                          <div>
                            <div className="text-sm font-semibold text-white">{t.title}</div>
                            <div className="text-xs text-white/50">{t.artist}</div>
                          </div>
                        </div>
                        <span className="text-xs font-mono text-white/40">
                          {formatTime(t.duration)}
                        </span>
                      </div>
                    ))}
                    {plTracks.length === 0 && (
                      <div className="py-8 text-center text-white/40 text-xs">
                        This playlist is empty. Add songs from the Songs tab!
                      </div>
                    )}
                  </div>
                </div>
              );
            })()}
          </div>
        )}

        {/* VIEW 3: ARTISTS */}
        {activeSubTab === 'artists' && (
          <div className="space-y-3">
            {Object.entries(artistMap).map(([artist, aTracks]) => (
              <div
                key={artist}
                onClick={() => onSelectTrack(aTracks[0])}
                className="flex items-center justify-between p-3 rounded-2xl bg-white/5 hover:bg-white/10 cursor-pointer transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-cyan-500 to-purple-600 flex items-center justify-center font-bold text-white shadow-md">
                    {artist.slice(0, 1)}
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-white">{artist}</h4>
                    <span className="text-xs text-white/50">
                      {aTracks.length} {aTracks.length === 1 ? 'song' : 'songs'}
                    </span>
                  </div>
                </div>
                <Play className="w-4 h-4 text-white/40 group-hover:text-white" />
              </div>
            ))}
          </div>
        )}

        {/* VIEW 4: ALBUMS */}
        {activeSubTab === 'albums' && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {Object.entries(albumMap).map(([album, aTracks]) => (
              <div
                key={album}
                onClick={() => onSelectTrack(aTracks[0])}
                className="bg-[#161824] border border-white/5 hover:border-white/20 rounded-2xl p-3 cursor-pointer transition-all hover:scale-[1.02]"
              >
                <img
                  src={aTracks[0]?.coverUrl}
                  alt={album}
                  className="w-full aspect-square rounded-xl object-cover mb-2 shadow"
                />
                <h4 className="font-bold text-sm text-white truncate">{album}</h4>
                <p className="text-xs text-white/50 truncate">{aTracks[0]?.artist}</p>
                <span className="text-[11px] text-white/40 mt-1 block">
                  {aTracks.length} tracks
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal: Create Playlist */}
      {showCreatePlaylistModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
          <form
            onSubmit={handleCreateNewPlaylist}
            className="w-full max-w-sm bg-[#161824] border border-white/10 rounded-3xl p-6 text-white shadow-2xl space-y-4"
          >
            <h3 className="text-base font-bold">New Playlist</h3>
            <input
              type="text"
              autoFocus
              value={newPlaylistTitle}
              onChange={(e) => setNewPlaylistTitle(e.target.value)}
              placeholder="e.g. Chill Night Drive"
              className="w-full bg-black/50 border border-white/20 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-cyan-400"
            />
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowCreatePlaylistModal(false)}
                className="px-4 py-2 rounded-xl text-xs text-white/60 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                style={{ backgroundColor: accentColor }}
                className="px-4 py-2 rounded-xl text-xs font-bold text-black"
              >
                Create
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Modal: Add Track to Playlist */}
      {showAddToPlaylistModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
          <div className="w-full max-w-sm bg-[#161824] border border-white/10 rounded-3xl p-6 text-white shadow-2xl space-y-3">
            <h3 className="text-base font-bold">Add to Playlist</h3>
            <div className="space-y-1.5 max-h-60 overflow-y-auto">
              {playlists.map((pl) => (
                <div
                  key={pl.id}
                  onClick={() => {
                    onAddToPlaylist(pl.id, showAddToPlaylistModal);
                    setShowAddToPlaylistModal(null);
                  }}
                  className="flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-white/10 cursor-pointer"
                >
                  <span className="text-sm font-semibold">{pl.title}</span>
                  <Plus className="w-4 h-4 text-cyan-400" />
                </div>
              ))}
            </div>
            <div className="flex justify-end pt-2">
              <button
                onClick={() => setShowAddToPlaylistModal(null)}
                className="px-4 py-2 rounded-xl text-xs text-white/60 hover:text-white"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
