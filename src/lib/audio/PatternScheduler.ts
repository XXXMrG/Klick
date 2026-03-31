import { Exercise, PatternNote } from '@/lib/practice/types';

const LOOKAHEAD = 0.1;
const SCHEDULE_INTERVAL = 25;

export type PatternBeatCallback = (noteIndex: number, time: number) => void;

/**
 * PatternScheduler plays exercise patterns via Web Audio API.
 * Differentiates R/L by frequency. Supports loop mode and
 * beat-by-beat callbacks for UI sync.
 */
export class PatternScheduler {
  private audioCtx: AudioContext | null = null;
  private exercise: Exercise | null = null;
  private _bpm: number = 80;
  private _volume: number = 1.0;
  private _isPlaying: boolean = false;
  private _loop: boolean = true;

  private nextNoteTime: number = 0;
  private currentNoteIndex: number = 0;
  private timerId: ReturnType<typeof setTimeout> | null = null;
  private animFrameId: number | null = null;
  private uiQueue: { noteIndex: number; time: number }[] = [];
  private onNote: PatternBeatCallback | null = null;

  // R hand = higher pitch, L hand = lower pitch
  private readonly R_FREQ = 880;
  private readonly L_FREQ = 660;

  get isPlaying() { return this._isPlaying; }
  get bpm() { return this._bpm; }

  setBpm(bpm: number) { this._bpm = Math.max(1, Math.min(300, bpm)); }
  setVolume(vol: number) { this._volume = vol; }
  setLoop(loop: boolean) { this._loop = loop; }
  setOnNote(cb: PatternBeatCallback) { this.onNote = cb; }

  setExercise(exercise: Exercise) {
    this.exercise = exercise;
    this._bpm = exercise.defaultBpm;
  }

  private ensureAudioContext(): AudioContext {
    if (!this.audioCtx) {
      this.audioCtx = new AudioContext();
    }
    return this.audioCtx;
  }

  start() {
    if (!this.exercise) return;
    const ctx = this.ensureAudioContext();
    if (ctx.state === 'suspended') ctx.resume();

    this._isPlaying = true;
    this.currentNoteIndex = 0;
    this.uiQueue = [];
    this.nextNoteTime = ctx.currentTime + 0.05;
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
    if (!this._isPlaying || !this.audioCtx || !this.exercise) return;

    while (this.nextNoteTime < this.audioCtx.currentTime + LOOKAHEAD) {
      const note = this.exercise.pattern[this.currentNoteIndex];
      if (note) {
        this.scheduleNote(note, this.nextNoteTime);
        this.uiQueue.push({ noteIndex: this.currentNoteIndex, time: this.nextNoteTime });
      }
      this.advance();
    }
    this.timerId = setTimeout(() => this.schedule(), SCHEDULE_INTERVAL);
  }

  private getSubdivisionDuration(): number {
    const secondsPerBeat = 60.0 / this._bpm;
    const grid = this.exercise?.grid ?? 'sixteenth';
    switch (grid) {
      case 'sixteenth': return secondsPerBeat / 4;
      case 'triplet': return secondsPerBeat / 3;
      case 'eighth': return secondsPerBeat / 2;
      default: return secondsPerBeat / 4;
    }
  }

  private advance() {
    if (!this.exercise) return;
    const subdivDuration = this.getSubdivisionDuration();

    // Calculate time to next note
    const currentNote = this.exercise.pattern[this.currentNoteIndex];
    const nextIndex = this.currentNoteIndex + 1;

    if (nextIndex >= this.exercise.pattern.length) {
      // End of pattern
      if (this._loop) {
        // Time from current note to end of pattern, then to first note of next cycle
        const nextNote = this.exercise.pattern[0];
        const remaining = this.exercise.patternLength - (currentNote?.position ?? 0);
        const gap = remaining + nextNote.position;
        this.nextNoteTime += gap * subdivDuration;
        this.currentNoteIndex = 0;
      } else {
        this.stop();
      }
    } else {
      const nextNote = this.exercise.pattern[nextIndex];
      const gap = nextNote.position - (currentNote?.position ?? 0);
      this.nextNoteTime += gap * subdivDuration;
      this.currentNoteIndex = nextIndex;
    }
  }

  private scheduleNote(note: PatternNote, time: number) {
    if (!this.audioCtx) return;

    const baseFreq = note.hand === 'R' ? this.R_FREQ : this.L_FREQ;
    const vol = this._volume * 2;

    switch (note.type) {
      case 'accent':
        this.playTone(baseFreq * 1.1, time, vol * 1.3, 0.06);
        break;
      case 'ghost':
        this.playTone(baseFreq, time, vol * 0.2, 0.025);
        break;
      case 'flam':
        // Grace note ~20ms before main
        if (note.graceNotes?.length) {
          const graceFreq = note.graceNotes[0].hand === 'R' ? this.R_FREQ : this.L_FREQ;
          this.playTone(graceFreq, time - 0.020, vol * 0.3, 0.02);
        }
        this.playTone(baseFreq, time, vol * 0.8, 0.05);
        break;
      case 'drag':
        // Two grace notes before main
        if (note.graceNotes?.length) {
          for (const g of note.graceNotes) {
            const gFreq = g.hand === 'R' ? this.R_FREQ : this.L_FREQ;
            this.playTone(gFreq, time - g.offsetMs / 1000, vol * 0.25, 0.018);
          }
        }
        this.playTone(baseFreq, time, vol * 0.8, 0.05);
        break;
      case 'buzz':
        // Simplified as rapid double stroke
        this.playTone(baseFreq, time, vol * 0.5, 0.03);
        this.playTone(baseFreq, time + 0.025, vol * 0.4, 0.03);
        this.playTone(baseFreq, time + 0.050, vol * 0.3, 0.03);
        this.playTone(baseFreq, time + 0.075, vol * 0.2, 0.03);
        break;
      default: // normal
        this.playTone(baseFreq, time, vol * 0.7, 0.045);
        break;
    }
  }

  private playTone(freq: number, time: number, volume: number, decay: number) {
    if (!this.audioCtx || time < 0) return;

    // Three-layer sine stack (like the tok sound)
    const layers: [number, number][] = [[1, 1.0], [2.1, 0.2], [3.4, 0.06]];
    for (const [mult, amp] of layers) {
      const osc = this.audioCtx.createOscillator();
      osc.type = 'sine';
      osc.frequency.value = freq * mult;

      const env = this.audioCtx.createGain();
      env.gain.setValueAtTime(amp * volume, time);
      env.gain.exponentialRampToValueAtTime(0.0001, time + decay);

      osc.connect(env).connect(this.audioCtx.destination);
      osc.start(time);
      osc.stop(time + decay + 0.005);
    }
  }

  private startUILoop() {
    const updateUI = () => {
      if (!this._isPlaying || !this.audioCtx) return;

      const now = this.audioCtx.currentTime;
      while (this.uiQueue.length > 0 && this.uiQueue[0].time <= now) {
        const event = this.uiQueue.shift()!;
        this.onNote?.(event.noteIndex, event.time);
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
