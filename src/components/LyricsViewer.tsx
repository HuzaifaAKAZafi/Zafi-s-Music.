import React, { useEffect, useRef, useState } from 'react';
import { LyricLine } from '../types/player';
import { Edit3, Check, Plus, Search } from 'lucide-react';
import { parseLrc } from '../utils/formatters';

interface LyricsViewerProps {
  lyrics?: LyricLine[];
  currentTime: number;
  onSeek: (time: number) => void;
  onUpdateLyrics: (newLyrics: LyricLine[]) => void;
  accentColor: string;
  songTitle: string;
}

export const LyricsViewer: React.FC<LyricsViewerProps> = ({
  lyrics = [],
  currentTime,
  onSeek,
  onUpdateLyrics,
  accentColor,
  songTitle
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const activeLineRef = useRef<HTMLDivElement | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState('');
  const [fontSize, setFontSize] = useState<'sm' | 'md' | 'lg'>('md');

  // Find active lyric index
  let activeIndex = -1;
  for (let i = 0; i < lyrics.length; i++) {
    if (currentTime >= lyrics[i].time) {
      activeIndex = i;
    } else {
      break;
    }
  }

  // Smooth scroll to active line
  useEffect(() => {
    if (activeLineRef.current && containerRef.current && !isEditing) {
      activeLineRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'center'
      });
    }
  }, [activeIndex, isEditing]);

  const handleStartEdit = () => {
    // Generate text representation
    const textRep = lyrics.length > 0
      ? lyrics.map(l => {
          const mins = Math.floor(l.time / 60);
          const secs = (l.time % 60).toFixed(2);
          return `[${mins < 10 ? '0' : ''}${mins}:${parseFloat(secs) < 10 ? '0' : ''}${secs}] ${l.text}`;
        }).join('\n')
      : `[00:05.00] Enter lyrics here...\n[00:15.00] Synchronized with time`;
    setEditText(textRep);
    setIsEditing(true);
  };

  const handleSaveLyrics = () => {
    const parsed = parseLrc(editText);
    if (parsed.length > 0) {
      onUpdateLyrics(parsed);
    } else {
      // If plain text with no timestamps, generate evenly spaced lines
      const plainLines = editText.split('\n').map(l => l.trim()).filter(Boolean);
      const generated: LyricLine[] = plainLines.map((txt, idx) => ({
        time: idx * 5,
        text: txt
      }));
      onUpdateLyrics(generated);
    }
    setIsEditing(false);
  };

  const fontClass = fontSize === 'sm' ? 'text-sm' : fontSize === 'lg' ? 'text-xl' : 'text-base';

  return (
    <div className="flex flex-col h-full w-full relative select-none">
      {/* Top toolbar */}
      <div className="flex items-center justify-between px-4 py-2 text-xs border-b border-white/10 shrink-0">
        <div className="flex items-center gap-2 text-white/60">
          <span>Lyrics</span>
          <span aria-hidden="true">·</span>
          <span>{lyrics.length > 0 ? `${lyrics.length} lines` : 'No lyrics yet'}</span>
        </div>
        <div className="flex items-center gap-2">
          {/* Font size toggle */}
          <div className="flex items-center bg-white/10 rounded-md p-0.5">
            <button
              onClick={() => setFontSize('sm')}
              className={`px-2 py-0.5 text-[11px] rounded transition-colors ${fontSize === 'sm' ? 'bg-white/20 text-white font-semibold' : 'text-white/60 hover:text-white'}`}
            >
              A-
            </button>
            <button
              onClick={() => setFontSize('md')}
              className={`px-2 py-0.5 text-[11px] rounded transition-colors ${fontSize === 'md' ? 'bg-white/20 text-white font-semibold' : 'text-white/60 hover:text-white'}`}
            >
              A
            </button>
            <button
              onClick={() => setFontSize('lg')}
              className={`px-2 py-0.5 text-[11px] rounded transition-colors ${fontSize === 'lg' ? 'bg-white/20 text-white font-semibold' : 'text-white/60 hover:text-white'}`}
            >
              A+
            </button>
          </div>

          <button
            onClick={() => (isEditing ? handleSaveLyrics() : handleStartEdit())}
            className="flex items-center gap-1 px-2.5 py-1 rounded bg-white/10 hover:bg-white/20 text-white text-xs transition-colors"
          >
            {isEditing ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span>Save</span>
              </>
            ) : (
              <>
                <Edit3 className="w-3.5 h-3.5" />
                <span>Edit</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Content Area */}
      {isEditing ? (
        <div className="flex-1 flex flex-col p-4 bg-black/40">
          <p className="text-xs text-white/50 mb-2">
            Paste LRC lyrics with [mm:ss.xx] timestamps, or plain text lines (will auto-align):
          </p>
          <textarea
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            className="flex-1 w-full bg-black/60 border border-white/20 rounded-xl p-3 text-sm text-white font-mono focus:outline-none focus:border-cyan-400 resize-none"
            placeholder="[00:10.00] First lyric line..."
          />
          <div className="flex justify-end gap-2 mt-3">
            <button
              onClick={() => setIsEditing(false)}
              className="px-4 py-1.5 rounded-lg text-xs text-white/60 hover:text-white"
            >
              Cancel
            </button>
            <button
              onClick={handleSaveLyrics}
              style={{ backgroundColor: accentColor }}
              className="px-4 py-1.5 rounded-lg text-xs font-semibold text-black"
            >
              Apply Lyrics
            </button>
          </div>
        </div>
      ) : lyrics.length > 0 ? (
        <div
          ref={containerRef}
          className="flex-1 overflow-y-auto px-6 py-12 space-y-6 text-center scroll-smooth"
        >
          {lyrics.map((line, idx) => {
            const isActive = idx === activeIndex;
            const isPast = idx < activeIndex;

            return (
              <div
                key={idx}
                ref={isActive ? activeLineRef : null}
                onClick={() => onSeek(line.time)}
                className={`cursor-pointer transition-all duration-300 py-1.5 px-3 rounded-lg ${
                  isActive
                    ? `${fontClass} font-bold scale-105 drop-shadow-[0_0_12px_rgba(0,229,255,0.4)]`
                    : isPast
                    ? 'text-white/40 hover:text-white/70 text-sm'
                    : 'text-white/60 hover:text-white/90 text-sm'
                }`}
                style={{
                  color: isActive ? accentColor : undefined
                }}
              >
                {line.text}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center text-white/60">
          <Search className="w-10 h-10 mb-3 text-white/30" />
          <h4 className="text-base font-semibold text-white mb-1">No lyrics found</h4>
          <p className="text-xs text-white/50 max-w-xs mb-4">
            Add lyrics for &quot;{songTitle}&quot; or import LRC files to sing along in karaoke mode!
          </p>
          <button
            onClick={handleStartEdit}
            style={{ backgroundColor: accentColor }}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-black hover:opacity-90 transition-opacity"
          >
            <Plus className="w-4 h-4" />
            Add Lyrics
          </button>
        </div>
      )}
    </div>
  );
};
