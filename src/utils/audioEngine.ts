import { EqualizerSettings } from '../types/player';

class LarkAudioEngine {
  private audioCtx: AudioContext | null = null;
  private sourceNode: MediaElementAudioSourceNode | null = null;
  private eqFilters: BiquadFilterNode[] = [];
  private bassBoostFilter: BiquadFilterNode | null = null;
  private delayNode: DelayNode | null = null;
  private delayGain: GainNode | null = null;
  private masterGain: GainNode | null = null;
  private analyserNode: AnalyserNode | null = null;
  private isInitialized = false;
  private audioElement: HTMLAudioElement | null = null;

  private eqFrequencies = [60, 230, 910, 3600, 14000];

  public initialize(audio: HTMLAudioElement) {
    if (this.isInitialized && this.audioElement === audio) return;
    this.audioElement = audio;

    try {
      const AudioCtxClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtxClass) return;

      this.audioCtx = new AudioCtxClass();
      this.sourceNode = this.audioCtx.createMediaElementSource(audio);

      // Create EQ filters
      this.eqFilters = this.eqFrequencies.map((freq, index) => {
        const filter = this.audioCtx!.createBiquadFilter();
        if (index === 0) {
          filter.type = 'lowshelf';
        } else if (index === this.eqFrequencies.length - 1) {
          filter.type = 'highshelf';
        } else {
          filter.type = 'peaking';
          filter.Q.value = 1.4;
        }
        filter.frequency.value = freq;
        filter.gain.value = 0;
        return filter;
      });

      // Bass Boost filter
      this.bassBoostFilter = this.audioCtx.createBiquadFilter();
      this.bassBoostFilter.type = 'lowshelf';
      this.bassBoostFilter.frequency.value = 100;
      this.bassBoostFilter.gain.value = 0;

      // 3D Spatial Virtualizer / Room Reverb
      this.delayNode = this.audioCtx.createDelay();
      this.delayNode.delayTime.value = 0.025; // 25ms spatial widening
      this.delayGain = this.audioCtx.createGain();
      this.delayGain.gain.value = 0.15;

      // Master Gain
      this.masterGain = this.audioCtx.createGain();
      this.masterGain.gain.value = 1.0;

      // Analyser for real-time visualizer
      this.analyserNode = this.audioCtx.createAnalyser();
      this.analyserNode.fftSize = 256; // 128 frequency data points for smooth canvas rendering
      this.analyserNode.smoothingTimeConstant = 0.82;

      // Chain connections:
      // Source -> EQ0 -> EQ1 -> EQ2 -> EQ3 -> EQ4 -> BassBoost -> MasterGain -> Analyser -> Destination
      let lastNode: AudioNode = this.sourceNode;
      for (const filter of this.eqFilters) {
        lastNode.connect(filter);
        lastNode = filter;
      }
      lastNode.connect(this.bassBoostFilter);
      this.bassBoostFilter.connect(this.masterGain);

      // Parallel 3D delay loop
      this.bassBoostFilter.connect(this.delayNode);
      this.delayNode.connect(this.delayGain);
      this.delayGain.connect(this.masterGain);

      this.masterGain.connect(this.analyserNode);
      this.analyserNode.connect(this.audioCtx.destination);

      this.isInitialized = true;
    } catch (e) {
      console.warn('Web Audio initialization note:', e);
    }
  }

  public resume() {
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
  }

  public applySettings(settings: EqualizerSettings) {
    if (!this.audioCtx) return;

    // EQ Gains
    this.eqFilters.forEach((filter, index) => {
      const gainVal = settings.enabled ? (settings.gains[index] ?? 0) : 0;
      filter.gain.setTargetAtTime(gainVal, this.audioCtx!.currentTime, 0.05);
    });

    // Bass Boost (0 - 100% mapped to 0 to 14 dB)
    if (this.bassBoostFilter) {
      const bassGain = settings.enabled ? (settings.bassBoost / 100) * 14 : 0;
      this.bassBoostFilter.gain.setTargetAtTime(bassGain, this.audioCtx.currentTime, 0.05);
    }

    // 3D Surround (0 - 100% mapped to 0 to 0.45 gain)
    if (this.delayGain) {
      const surroundGain = settings.enabled ? (settings.surround3D / 100) * 0.45 : 0;
      this.delayGain.gain.setTargetAtTime(surroundGain, this.audioCtx.currentTime, 0.05);
    }

    // Master Volume Boost
    if (this.masterGain) {
      const vol = settings.volumeBoost || 1.0;
      this.masterGain.gain.setTargetAtTime(vol, this.audioCtx.currentTime, 0.05);
    }
  }

  public getFrequencyData(buffer: Uint8Array<ArrayBuffer> | Uint8Array): void {
    if (this.analyserNode) {
      this.analyserNode.getByteFrequencyData(buffer as Uint8Array<ArrayBuffer>);
    } else {
      buffer.fill(0);
    }
  }

  public getTimeDomainData(buffer: Uint8Array<ArrayBuffer> | Uint8Array): void {
    if (this.analyserNode) {
      this.analyserNode.getByteTimeDomainData(buffer as Uint8Array<ArrayBuffer>);
    } else {
      buffer.fill(128);
    }
  }

  public getFrequencyBinCount(): number {
    return this.analyserNode ? this.analyserNode.frequencyBinCount : 64;
  }

  public getFrequencies(): number[] {
    return this.eqFrequencies;
  }
}

export const larkAudioEngine = new LarkAudioEngine();
