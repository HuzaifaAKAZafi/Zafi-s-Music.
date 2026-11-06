import { LyricLine } from '../types/player';

export function formatTime(seconds: number): string {
  if (isNaN(seconds) || seconds < 0) return '0:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
}

export function formatPlays(plays: number): string {
  if (plays >= 1000000) return `${(plays / 1000000).toFixed(1)}M`;
  if (plays >= 1000) return `${(plays / 1000).toFixed(1)}k`;
  return plays.toString();
}

/**
 * Parses standard LRC format (e.g. [01:23.45] Lyric line text)
 */
export function parseLrc(content: string): LyricLine[] {
  const lines = content.split('\n');
  const result: LyricLine[] = [];
  const timeRegex = /\[(\d{1,2}):(\d{2})(?:\.(\d{1,3}))?\]/g;

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;

    timeRegex.lastIndex = 0;
    const matches: { time: number }[] = [];
    let match: RegExpExecArray | null;

    while ((match = timeRegex.exec(trimmed)) !== null) {
      const minutes = parseInt(match[1], 10);
      const seconds = parseInt(match[2], 10);
      const frac = match[3] ? parseFloat(`0.${match[3]}`) : 0;
      matches.push({ time: minutes * 60 + seconds + frac });
    }

    const text = trimmed.replace(timeRegex, '').trim();
    if (text) {
      for (const m of matches) {
        result.push({ time: m.time, text });
      }
    }
  }

  return result.sort((a, b) => a.time - b.time);
}
