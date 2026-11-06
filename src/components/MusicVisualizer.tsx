import React, { useEffect, useRef, useState } from 'react';
import { VisualizerMode } from '../types/player';
import { larkAudioEngine } from '../utils/audioEngine';
import { BarChart3, Activity, Disc3, Flame, Sliders } from 'lucide-react';

interface MusicVisualizerProps {
  isPlaying: boolean;
  accentColor: string;
  mode?: VisualizerMode;
  onModeChange?: (mode: VisualizerMode) => void;
  height?: number;
  showControls?: boolean;
  centerArtworkUrl?: string;
  sensitivity?: number;
  className?: string;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  life: number;
  maxLife: number;
  color: string;
}

export const MusicVisualizer: React.FC<MusicVisualizerProps> = ({
  isPlaying,
  accentColor,
  mode = 'bars',
  onModeChange,
  height = 140,
  showControls = true,
  centerArtworkUrl,
  sensitivity = 1.2,
  className = ''
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [internalMode, setInternalMode] = useState<VisualizerMode>(mode);
  const [localSensitivity, setLocalSensitivity] = useState(sensitivity);
  const [showSettings, setShowSettings] = useState(false);

  // Sync mode if passed from parent
  useEffect(() => {
    if (mode) setInternalMode(mode);
  }, [mode]);

  const currentMode = onModeChange ? mode : internalMode;
  const handleModeSwitch = (m: VisualizerMode) => {
    setInternalMode(m);
    if (onModeChange) onModeChange(m);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let animationFrameId: number;
    const binCount = larkAudioEngine.getFrequencyBinCount();
    const freqData = new Uint8Array(binCount);
    const timeData = new Uint8Array(binCount);

    // Peak tracker for bars mode
    const peaks = new Array(64).fill(0);

    // Particles array for fire embers mode
    const particles: Particle[] = [];
    const maxParticles = 90;

    let idleAngle = 0;

    const render = () => {
      animationFrameId = requestAnimationFrame(render);

      // Handle retina displays
      const dpr = window.devicePixelRatio || 1;
      const displayWidth = canvas.clientWidth;
      const displayHeight = canvas.clientHeight || height;

      if (canvas.width !== displayWidth * dpr || canvas.height !== displayHeight * dpr) {
        canvas.width = displayWidth * dpr;
        canvas.height = displayHeight * dpr;
        ctx.scale(dpr, dpr);
      }

      const w = displayWidth;
      const h = displayHeight;

      ctx.clearRect(0, 0, w, h);

      if (isPlaying) {
        larkAudioEngine.getFrequencyData(freqData);
        larkAudioEngine.getTimeDomainData(timeData);
      } else {
        // Idle ambient floating wave
        idleAngle += 0.03;
        for (let i = 0; i < binCount; i++) {
          freqData[i] = Math.max(0, Math.sin(idleAngle + i * 0.15) * 20 + 12);
          timeData[i] = 128 + Math.sin(idleAngle + i * 0.08) * 12;
        }
      }

      // Compute total energy / bass kick
      let bassSum = 0;
      for (let i = 0; i < 8; i++) {
        bassSum += freqData[i] || 0;
      }
      const bassEnergy = (bassSum / (8 * 255)) * localSensitivity;

      // MODE 1: SPECTRUM BARS
      if (currentMode === 'bars') {
        const barCount = Math.min(48, Math.floor(w / 8));
        const spacing = 3;
        const barWidth = Math.max(3, (w - barCount * spacing) / barCount);
        const step = Math.floor(binCount / barCount);

        for (let i = 0; i < barCount; i++) {
          const rawVal = freqData[i * step] || 0;
          const normalized = Math.min(1, (rawVal / 255) * localSensitivity);
          const barHeight = Math.max(4, normalized * (h * 0.85));
          const x = i * (barWidth + spacing) + spacing;
          const y = h - barHeight;

          // Peak cap physics
          if (barHeight > (peaks[i] || 0)) {
            peaks[i] = barHeight;
          } else {
            peaks[i] = Math.max(0, (peaks[i] || 0) - 1.2);
          }

          // Bar Gradient with frosted glass glow
          const grad = ctx.createLinearGradient(0, y, 0, h);
          grad.addColorStop(0, accentColor);
          grad.addColorStop(0.5, `${accentColor}B3`);
          grad.addColorStop(1, 'rgba(255, 255, 255, 0.08)');

          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.roundRect(x, y, barWidth, barHeight, [3, 3, 0, 0]);
          ctx.fill();

          // Peak cap dot
          ctx.fillStyle = '#FFFFFF';
          ctx.shadowColor = accentColor;
          ctx.shadowBlur = 6;
          ctx.fillRect(x, h - (peaks[i] || 0) - 2, barWidth, 2);
          ctx.shadowBlur = 0;
        }
      }

      // MODE 2: LIQUID WAVE / OSCILLOSCOPE
      else if (currentMode === 'wave') {
        ctx.lineWidth = 2.5;
        ctx.strokeStyle = accentColor;
        ctx.shadowColor = accentColor;
        ctx.shadowBlur = 12;

        ctx.beginPath();
        const sliceWidth = w / binCount;
        let x = 0;

        for (let i = 0; i < binCount; i++) {
          const v = (timeData[i] / 128.0 - 1.0) * localSensitivity;
          const y = h / 2 + v * (h * 0.42);

          if (i === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
          x += sliceWidth;
        }
        ctx.lineTo(w, h / 2);
        ctx.stroke();
        ctx.shadowBlur = 0;

        // Translucent liquid wave glow fill underneath
        ctx.lineTo(w, h);
        ctx.lineTo(0, h);
        ctx.closePath();
        const fillGrad = ctx.createLinearGradient(0, h * 0.3, 0, h);
        fillGrad.addColorStop(0, `${accentColor}33`);
        fillGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = fillGrad;
        ctx.fill();
      }

      // MODE 3: CIRCULAR / RADIAL ORB
      else if (currentMode === 'circle') {
        const centerX = w / 2;
        const centerY = h / 2;
        const baseRadius = Math.min(centerX, centerY) * 0.45;
        const rayCount = 48;
        const angleStep = (Math.PI * 2) / rayCount;

        // Ambient pulsating halo ring
        ctx.save();
        ctx.beginPath();
        ctx.arc(centerX, centerY, baseRadius * (1 + bassEnergy * 0.15), 0, Math.PI * 2);
        ctx.strokeStyle = `${accentColor}66`;
        ctx.lineWidth = 2;
        ctx.stroke();

        // Glowing outer shockwave
        if (bassEnergy > 0.4) {
          ctx.beginPath();
          ctx.arc(centerX, centerY, baseRadius * (1.15 + bassEnergy * 0.35), 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(255, 255, 255, ${bassEnergy * 0.5})`;
          ctx.lineWidth = 1.5;
          ctx.stroke();
        }

        // Radial audio spikes
        for (let i = 0; i < rayCount; i++) {
          const rawVal = freqData[i % binCount] || 0;
          const spikeLen = (rawVal / 255) * (baseRadius * 0.9) * localSensitivity;
          const angle = i * angleStep;

          const x1 = centerX + Math.cos(angle) * baseRadius;
          const y1 = centerY + Math.sin(angle) * baseRadius;
          const x2 = centerX + Math.cos(angle) * (baseRadius + spikeLen);
          const y2 = centerY + Math.sin(angle) * (baseRadius + spikeLen);

          ctx.beginPath();
          ctx.moveTo(x1, y1);
          ctx.lineTo(x2, y2);
          ctx.strokeStyle = accentColor;
          ctx.lineWidth = 3;
          ctx.lineCap = 'round';
          ctx.stroke();
        }
        ctx.restore();
      }

      // MODE 4: FIERY EMBERS (Matches Zafi's fiery music signature logo!)
      else if (currentMode === 'fire') {
        // Spawn ember particles proportional to audio energy
        const spawnCount = isPlaying ? Math.floor(1 + bassEnergy * 4) : 1;
        for (let s = 0; s < spawnCount && particles.length < maxParticles; s++) {
          const colors = [accentColor, '#FFAA00', '#FF3D00', '#FFD600', '#FFFFFF'];
          const pickedColor = colors[Math.floor(Math.random() * colors.length)];
          particles.push({
            x: Math.random() * w,
            y: h + 10,
            vx: (Math.random() - 0.5) * (1.5 + bassEnergy * 2),
            vy: -(1.5 + Math.random() * 3 + bassEnergy * 4),
            size: Math.random() * 4 + 2,
            alpha: 0.9,
            life: 0,
            maxLife: 50 + Math.random() * 40,
            color: pickedColor
          });
        }

        // Update and draw embers
        for (let i = particles.length - 1; i >= 0; i--) {
          const p = particles[i];
          p.x += p.vx;
          p.y += p.vy;
          p.life++;
          p.alpha = Math.max(0, 1 - p.life / p.maxLife);

          ctx.save();
          ctx.shadowColor = p.color;
          ctx.shadowBlur = 8;
          ctx.fillStyle = p.color;
          ctx.globalAlpha = p.alpha;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size * (1 - p.life / p.maxLife * 0.5), 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();

          if (p.life >= p.maxLife || p.y < -10) {
            particles.splice(i, 1);
          }
        }

        // Bass flame surge wave at bottom
        const flameGrad = ctx.createLinearGradient(0, h - 30 * (1 + bassEnergy), 0, h);
        flameGrad.addColorStop(0, 'rgba(255, 107, 0, 0)');
        flameGrad.addColorStop(0.5, `rgba(255, 80, 0, ${0.15 + bassEnergy * 0.25})`);
        flameGrad.addColorStop(1, `rgba(255, 30, 0, ${0.35 + bassEnergy * 0.3})`);
        ctx.fillStyle = flameGrad;
        ctx.fillRect(0, h - 40 * (1 + bassEnergy), w, h);
      }
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [isPlaying, currentMode, accentColor, height, localSensitivity]);

  return (
    <div
      className={`relative w-full rounded-2xl overflow-hidden backdrop-blur-xl bg-white/[0.03] border border-white/10 shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] ${className}`}
      style={{ height }}
    >
      <canvas ref={canvasRef} className="w-full h-full block" />

      {/* Visualizer Floating Controls Bar */}
      {showControls && (
        <div className="absolute top-2.5 right-2.5 z-10 flex items-center gap-1.5 p-1 rounded-xl bg-black/40 backdrop-blur-xl border border-white/10 shadow-lg">
          <button
            onClick={() => handleModeSwitch('bars')}
            className={`p-1.5 rounded-lg text-xs transition-all ${
              currentMode === 'bars'
                ? 'bg-white/20 text-white font-bold shadow-sm'
                : 'text-white/60 hover:text-white'
            }`}
            title="Spectrum Frequency Bars"
          >
            <BarChart3 className="w-3.5 h-3.5" style={{ color: currentMode === 'bars' ? accentColor : undefined }} />
          </button>

          <button
            onClick={() => handleModeSwitch('wave')}
            className={`p-1.5 rounded-lg text-xs transition-all ${
              currentMode === 'wave'
                ? 'bg-white/20 text-white font-bold shadow-sm'
                : 'text-white/60 hover:text-white'
            }`}
            title="Liquid Waveform / Oscilloscope"
          >
            <Activity className="w-3.5 h-3.5" style={{ color: currentMode === 'wave' ? accentColor : undefined }} />
          </button>

          <button
            onClick={() => handleModeSwitch('circle')}
            className={`p-1.5 rounded-lg text-xs transition-all ${
              currentMode === 'circle'
                ? 'bg-white/20 text-white font-bold shadow-sm'
                : 'text-white/60 hover:text-white'
            }`}
            title="Radial Circular Pulse"
          >
            <Disc3 className="w-3.5 h-3.5" style={{ color: currentMode === 'circle' ? accentColor : undefined }} />
          </button>

          <button
            onClick={() => handleModeSwitch('fire')}
            className={`p-1.5 rounded-lg text-xs transition-all ${
              currentMode === 'fire'
                ? 'bg-white/20 text-white font-bold shadow-sm'
                : 'text-white/60 hover:text-white'
            }`}
            title="Zafi Fiery Ember Particles"
          >
            <Flame className="w-3.5 h-3.5" style={{ color: currentMode === 'fire' ? '#FF6B00' : undefined }} />
          </button>

          <button
            onClick={() => setShowSettings(!showSettings)}
            className={`p-1.5 rounded-lg text-xs transition-all ${
              showSettings ? 'bg-white/20 text-white' : 'text-white/50 hover:text-white'
            }`}
            title="Visualizer Sensitivity"
          >
            <Sliders className="w-3 h-3" />
          </button>
        </div>
      )}

      {/* Sensitivity popover */}
      {showSettings && (
        <div className="absolute top-12 right-2.5 z-20 p-3 rounded-2xl bg-[#121422]/90 backdrop-blur-2xl border border-white/15 text-white text-xs space-y-2 shadow-2xl w-48 animate-fadeIn">
          <div className="flex items-center justify-between text-[11px] text-white/70">
            <span>Audio Sensitivity</span>
            <span className="font-mono text-cyan-400">{localSensitivity.toFixed(1)}x</span>
          </div>
          <input
            type="range"
            min="0.5"
            max="2.5"
            step="0.1"
            value={localSensitivity}
            onChange={(e) => setLocalSensitivity(parseFloat(e.target.value))}
            className="w-full accent-cyan-400 h-1.5 bg-white/10 rounded-lg cursor-pointer"
          />
        </div>
      )}
    </div>
  );
};
