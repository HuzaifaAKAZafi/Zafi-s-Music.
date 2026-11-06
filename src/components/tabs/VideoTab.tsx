import React, { useState } from 'react';
import { MediaTrack } from '../../types/player';
import { formatTime, formatPlays } from '../../utils/formatters';
import {
  Film,
  Play,
  PictureInPicture,
  FolderPlus,
  Eye,
  Heart,
  Search,
  Sparkles
} from 'lucide-react';

interface VideoTabProps {
  videos: MediaTrack[];
  onPlayFloatingVideo: (video: MediaTrack) => void;
  onImportVideos: (files: FileList) => void;
  onToggleFavorite: (id: string) => void;
  accentColor: string;
}

export const VideoTab: React.FC<VideoTabProps> = ({
  videos,
  onPlayFloatingVideo,
  onImportVideos,
  onToggleFavorite,
  accentColor
}) => {
  const [subTab, setSubTab] = useState<'all' | 'clips' | 'folders'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredVideos = videos.filter((v) =>
    v.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onImportVideos(e.target.files);
    }
  };

  return (
    <div className="flex-1 flex flex-col overflow-y-auto pb-24 max-w-6xl mx-auto w-full px-4 pt-4">
      {/* Top Search & Import */}
      <div className="flex items-center gap-2 mb-3">
        <div className="flex-1 relative flex items-center">
          <Search className="w-4 h-4 absolute left-3.5 text-white/40" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search videos, clips, formats..."
            className="w-full bg-[#1A1D2B] border border-white/10 rounded-2xl pl-10 pr-4 py-2 text-sm text-white placeholder-white/40 focus:outline-none focus:border-cyan-400"
          />
        </div>

        <label
          title="Import Local Videos"
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-white/10 hover:bg-white/15 text-white text-xs font-semibold cursor-pointer active:scale-95 transition-all shrink-0"
        >
          <FolderPlus className="w-4 h-4 text-cyan-400" />
          <span className="hidden sm:inline">Import Video</span>
          <input
            type="file"
            accept="video/*"
            multiple
            onChange={handleFileInput}
            className="hidden"
          />
        </label>
      </div>

      {/* Sub-Tabs: All Videos | Status Saver / Clips | Folders */}
      <div className="flex items-center gap-1 overflow-x-auto pb-2 border-b border-white/10 text-xs font-medium mb-4">
        <button
          onClick={() => setSubTab('all')}
          className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 ${
            subTab === 'all' ? 'font-bold text-black' : 'text-white/60 hover:text-white'
          }`}
          style={{
            backgroundColor: subTab === 'all' ? accentColor : undefined
          }}
        >
          <Film className="w-3.5 h-3.5" />
          All Videos ({videos.length})
        </button>

        <button
          onClick={() => setSubTab('clips')}
          className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 ${
            subTab === 'clips' ? 'font-bold text-black' : 'text-white/60 hover:text-white'
          }`}
          style={{
            backgroundColor: subTab === 'clips' ? accentColor : undefined
          }}
        >
          <Sparkles className="w-3.5 h-3.5" />
          Short Clips
        </button>

        <button
          onClick={() => setSubTab('folders')}
          className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 ${
            subTab === 'folders' ? 'font-bold text-black' : 'text-white/60 hover:text-white'
          }`}
          style={{
            backgroundColor: subTab === 'folders' ? accentColor : undefined
          }}
        >
          Folders
        </button>
      </div>

      {/* Floating Video Feature Callout Banner */}
      <div className="p-4 rounded-3xl bg-gradient-to-r from-purple-900/30 via-cyan-900/20 to-black/40 border border-white/10 mb-5 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-2xl flex items-center justify-center shrink-0"
            style={{ backgroundColor: `${accentColor}25`, color: accentColor }}
          >
            <PictureInPicture className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white">Floating Pop-up Player</h4>
            <p className="text-xs text-white/60">
              Watch videos while chatting, browsing, or listening to music simultaneously!
            </p>
          </div>
        </div>
      </div>

      {/* Video Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {filteredVideos.map((video) => (
          <div
            key={video.id}
            className="group bg-[#161824] border border-white/5 hover:border-white/20 rounded-2xl overflow-hidden shadow-lg transition-all flex flex-col"
          >
            {/* Thumbnail Viewport */}
            <div className="relative aspect-video bg-black overflow-hidden cursor-pointer">
              <img
                src={video.coverUrl}
                alt={video.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />

              {/* Badges */}
              <div className="absolute top-2 right-2 px-2 py-0.5 rounded-md bg-black/70 backdrop-blur-sm text-[10px] font-mono text-white font-bold">
                {formatTime(video.duration)}
              </div>

              {video.genre && (
                <div className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-sm text-[10px] text-cyan-300 font-semibold">
                  {video.genre}
                </div>
              )}

              {/* Hover overlay play buttons */}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                <button
                  onClick={() => onPlayFloatingVideo(video)}
                  title="Play in Floating Pop-up Window"
                  className="p-3 rounded-full bg-cyan-500 text-black shadow-xl hover:scale-110 active:scale-95 transition-transform"
                >
                  <PictureInPicture className="w-5 h-5" />
                </button>

                <button
                  onClick={() => onPlayFloatingVideo(video)}
                  title="Play Video"
                  style={{ backgroundColor: accentColor }}
                  className="p-3.5 rounded-full text-black shadow-xl hover:scale-110 active:scale-95 transition-transform"
                >
                  <Play className="w-6 h-6 fill-black ml-0.5" />
                </button>
              </div>
            </div>

            {/* Info Footer */}
            <div className="p-3.5 flex items-start justify-between gap-2">
              <div className="truncate flex-1">
                <h4 className="font-bold text-sm text-white truncate group-hover:text-cyan-300 transition-colors">
                  {video.title}
                </h4>
                <div className="flex items-center gap-2 text-xs text-white/50 mt-1">
                  <span>{video.artist}</span>
                  <span aria-hidden="true">·</span>
                  <span className="flex items-center gap-1 font-mono">
                    <Eye className="w-3 h-3 text-white/40" />
                    {formatPlays(video.plays)}
                  </span>
                </div>
              </div>

              <button
                onClick={() => onToggleFavorite(video.id)}
                className="p-1.5 text-white/40 hover:text-rose-500 transition-colors"
                title="Favorite"
              >
                <Heart
                  className={`w-4 h-4 ${
                    video.isFavorite ? 'fill-rose-500 text-rose-500' : ''
                  }`}
                />
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredVideos.length === 0 && (
        <div className="py-16 text-center text-white/40">
          <Film className="w-12 h-12 mx-auto mb-2 opacity-30" />
          <p className="text-sm">No videos found. Use the Import button above to add videos!</p>
        </div>
      )}
    </div>
  );
};
