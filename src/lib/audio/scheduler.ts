import { AccentLevel, SoundType, SubdivisionType, SUBDIVISION_CONFIGS, BeatEvent } from '@/types/metronome';
import { playSound } from './sounds';

const LOOKAHEAD = 0.1;        // 100ms look-ahead window
const SCHEDULE_INTERVAL = 25; // 25ms scheduler polling

export type BeatCallback = (event: BeatEvent) => void;

export class MetronomeScheduler {
  private audioCtx: AudioContext | null = null;
  private nextNoteTime: number = 0;
  private currentBeat: number = 0;
  private currentSubBeat: number = 0;
  private timerId: ReturnType<typeof setTimeout> | null = null;
  private uiQueue: BeatEvent[] = [];
  private animFrameId: number | null = null;
  private onBeat: BeatCallback | null = null;

  // Configurable params
  private _bpm: number = 120;
  private _beatsPerBar: number = 4;
  private _subdivisionType: SubdivisionType = 'quarter';
  private _subIntervals: number[] = [1];
  private _sound: SoundType = 'tok';
  private _accentSound: SoundType = 'tok';
  private _accents: AccentLevel[] = [3, 2, 2, 2];
  private _volume: number = 1.0;
  private _isPlaying: boolean = false;
  private _randomMuteChance: number = 0;
  private _randomMuteMap: Map<number, boolean> = new Map();

  get isPlaying() { return this._isPlaying; }
  get bpm() { return this._bpm; }

  setBpm(bpm: number) { this._bpm = bpm; }
  setBeatsPerBar(beats: number) {
    this._beatsPerBar = beats;
    if (this.currentBeat >= beats) {
      this.currentBeat = 0;
    }
  }
  setSubdivision(type: SubdivisionType) {
    this._subdivisionType = type;
    this._subIntervals = SUBDIVISION_CONFIGS[type].intervals;
    this.currentSubBeat = 0;
  }
  setSound(sound: SoundType) { this._sound = sound; }
  setAccentSound(sound: SoundType) { this._accentSound = sound; }
  setAccents(accents: AccentLevel[]) { this._accents = accents; }
  setVolume(vol: number) { this._volume = vol; }
  setRandomMuteChance(chance: number) { this._randomMuteChance = chance; }
  setOnBeat(cb: BeatCallback) { this.onBeat = cb; }

  private ensureAudioContext(): AudioContext {
    if (!this.audioCtx) {
      this.audioCtx = new AudioContext();
    }
    return this.audioCtx;
  }

  start() {
    const ctx = this.ensureAudioContext();
    if (ctx.state === 'suspended') {
      ctx.resume();
    }
    this._isPlaying = true;
    this.currentBeat = 0;
    this.currentSubBeat = 0;
    this._subIntervals = SUBDIVISION_CONFIGS[this._subdivisionType].intervals;
    this.nextNoteTime = ctx.currentTime + 0.05; // small initial delay
    this.uiQueue = [];
    this.schedule();
    this.startUILoop();
  }

  stop() {
    this._isPlaying = false;
    if (this.timerId !== null) {
      clearTimeout(this.timerId);
      this.timerId = null;
    }
    if (this.animFrameId !== null) {
      cancelAnimationFrame(this.animFrameId);
      this.animFrameId = null;
    }
    this.uiQueue = [];
  }

  private schedule() {
    if (!this._isPlaying || !this.audioCtx) return;

    while (this.nextNoteTime < this.audioCtx.currentTime + LOOKAHEAD) {
      this.scheduleNote(this.currentBeat, this.currentSubBeat, this.nextNoteTime);
      this.advance();
    }
    this.timerId = setTimeout(() => this.schedule(), SCHEDULE_INTERVAL);
  }

  private scheduleNote(beat: number, subBeat: number, time: number) {
    if (!this.audioCtx) return;

    const isDownbeat = beat === 0 && subBeat === 0;
    const isSubdivision = subBeat > 0;
    const accentLevel = this._accents[beat] ?? 2;

    // Random mute: decide once per beat (on subBeat 0), apply to all sub-beats
    if (subBeat === 0) {
      const muted = this._randomMuteChance > 0 && Math.random() < this._randomMuteChance;
      this._randomMuteMap.set(beat, muted);
    }
    const randomMuted = this._randomMuteMap.get(beat) ?? false;

    // Determine volume based on accent level and whether it's a subdivision
    // Multiply by 2 for a louder default output
    let noteVolume = this._volume * 2;
    switch (accentLevel) {
      case 0: // mute — silence the entire beat including subdivisions
        noteVolume = 0;
        break;
      case 1: // ghost
        noteVolume *= isSubdivision ? 0.15 : 0.25;
        break;
      case 2: // normal
        noteVolume *= isSubdivision ? 0.35 : 0.6;
        break;
      case 3: // accent
        noteVolume *= isSubdivision ? 0.6 : 1.0;
        break;
    }

    // Apply random mute — silence this beat entirely
    if (randomMuted) {
      noteVolume = 0;
    }

    if (noteVolume > 0) {
      const isAccent = accentLevel === 3 && !isSubdivision;
      const sound = isAccent ? this._accentSound : this._sound;
      playSound(this.audioCtx, time, sound, isAccent, noteVolume);
    }

    // Push to UI queue
    this.uiQueue.push({ beat, subBeat, time, isDownbeat, isSubdivision, randomMuted });
  }

  private advance() {
    const secondsPerBeat = 60.0 / this._bpm;
    // Use the current subBeat's interval ratio for non-uniform timing
    const intervalRatio = this._subIntervals[this.currentSubBeat];
    this.nextNoteTime += secondsPerBeat * intervalRatio;

    this.currentSubBeat++;
    if (this.currentSubBeat >= this._subIntervals.length) {
      this.currentSubBeat = 0;
      this.currentBeat = (this.currentBeat + 1) % this._beatsPerBar;
    }
  }

  private startUILoop() {
    const updateUI = () => {
      if (!this._isPlaying || !this.audioCtx) return;

      const now = this.audioCtx.currentTime;
      while (this.uiQueue.length > 0 && this.uiQueue[0].time <= now) {
        const event = this.uiQueue.shift()!;
        this.onBeat?.(event);
      }

      this.animFrameId = requestAnimationFrame(updateUI);
    };
    this.animFrameId = requestAnimationFrame(updateUI);
  }

  dispose() {
    this.stop();
    if (this.audioCtx) {
      this.audioCtx.close();
      this.audioCtx = null;
    }
  }
}
