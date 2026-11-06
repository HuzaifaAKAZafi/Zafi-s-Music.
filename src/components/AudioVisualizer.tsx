import React, { useEffect, useRef } from 'react';
import { larkAudioEngine } from '../utils/audioEngine';

interface AudioVisualizerProps {
  isPlaying: boolean;
  barCount?: number;
  barColor?: string;
  className?: string;
  height?: number;
}

export const AudioVisualizer: React.FC<AudioVisualizerProps> = ({
  isPlaying,
  barCount = 28,
  barColor = '#00E5FF',
  className = '',
  height = 48
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animFrameId = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dataBuffer = new Uint8Array(64);

    let idlePhase = 0;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (isPlaying) {
        larkAudioEngine.getFrequencyData(dataBuffer);
      } else {
        dataBuffer.fill(0);
      }

      const totalWidth = canvas.width;
      const barWidth = Math.max(2, Math.floor((totalWidth - (barCount - 1) * 2) / barCount));
      const gap = 2;

      idlePhase += 0.05;

      for (let i = 0; i < barCount; i++) {
        const x = i * (barWidth + gap);
        let normalizedVal = 0;

        if (isPlaying) {
          // sample frequency index
          const sampleIndex = Math.min(Math.floor((i / barCount) * 24), dataBuffer.length - 1);
          normalizedVal = (dataBuffer[sampleIndex] || 0) / 255;
          // Minimum subtle bounce even in quiet spots
          normalizedVal = Math.max(0.12, normalizedVal);
        } else {
          // gentle subtle resting wave
          normalizedVal = 0.08 + Math.sin(idlePhase + i * 0.3) * 0.04;
        }

        const barHeight = Math.max(3, normalizedVal * canvas.height * 0.95);
        const y = canvas.height - barHeight;

        const gradient = ctx.createLinearGradient(0, y, 0, canvas.height);
        gradient.addColorStop(0, barColor);
        gradient.addColorStop(1, `${barColor}33`);

        ctx.fillStyle = gradient;
        // Rounded bar top
        const radius = Math.min(2, barWidth / 2);
        ctx.beginPath();
        ctx.roundRect(x, y, barWidth, barHeight, [radius, radius, 0, 0]);
        ctx.fill();
      }

      animFrameId.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      if (animFrameId.current) {
        cancelAnimationFrame(animFrameId.current);
      }
    };
  }, [isPlaying, barCount, barColor]);

  return (
    <canvas
      ref={canvasRef}
      width={barCount * 6}
      height={height}
      className={`w-full block ${className}`}
      style={{ height: `${height}px` }}
    />
  );
};
