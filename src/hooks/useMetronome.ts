'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { MetronomeScheduler, BeatCallback } from '@/lib/audio/scheduler';
import {
  MetronomeState,
  SoundType,
  SubdivisionType,
  AccentLevel,
  TempoTrainerConfig,
  TimerConfig,
  RandomMuteConfig,
} from '@/types/metronome';
import { clampBpm } from '@/lib/tempo';

const DEFAULT_STATE: MetronomeState = {
  bpm: 120,
  beatsPerBar: 4,
  beatUnit: 4,
  subdivision: 'quarter',
  isPlaying: false,
  currentBeat: -1,
  currentSubBeat: 0,
  sound: 'tok',
  accentSound: 'tok',
  accents: [3, 2, 2, 2],
  volume: 1.0,
  flashBeat: null,
};

const STORAGE_KEY = 'metronome-settings';

const VALID_SUBDIVISIONS: SubdivisionType[] = [
  'quarter', 'eighth', 'triplet', 'sixteenth',
  'dotted-long', 'dotted-short',
  'sync-a', 'sync-b', 'sync-c', 'triplet16-a', 'triplet16-b',
  'quintuplet',
];

function loadSettings(): Partial<MetronomeState> & {
  tempoTrainer?: Partial<TempoTrainerConfig>;
  timer?: Partial<TimerConfig>;
  randomMute?: Partial<RandomMuteConfig>;
} {
  if (typeof window === 'undefined') return {};
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    if (parsed.bpm) parsed.bpm = Math.min(300, Math.max(1, Number(parsed.bpm)));
    // Validate subdivision against new type list (handles old values like "dotted-eighth")
    if (parsed.subdivision && !VALID_SUBDIVISIONS.includes(parsed.subdivision)) {
      delete parsed.subdivision;
    }
    return parsed;
  } catch {
    return {};
  }
}

function saveSettings(
  state: MetronomeState,
  tempoTrainer: TempoTrainerConfig,
  timer: TimerConfig,
  randomMute: RandomMuteConfig,
) {
  if (typeof window === 'undefined') return;
  try {
    const toSave = {
      bpm: state.bpm,
      beatsPerBar: state.beatsPerBar,
      beatUnit: state.beatUnit,
      subdivision: state.subdivision,
      sound: state.sound,
      accentSound: state.accentSound,
      accents: state.accents,
      volume: state.volume,
      tempoTrainer: {
        enabled: tempoTrainer.enabled,
        startBpm: tempoTrainer.startBpm,
        targetBpm: tempoTrainer.targetBpm,
        incrementBpm: tempoTrainer.incrementBpm,
        everyNBars: tempoTrainer.everyNBars,
      },
      timer: {
        enabled: timer.enabled,
        durationMinutes: timer.durationMinutes,
      },
      randomMute: {
        enabled: randomMute.enabled,
        chance: randomMute.chance,
      },
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
  } catch {}
}

export function useMetronome() {
  const [state, setState] = useState<MetronomeState>(DEFAULT_STATE);
  const [hydrated, setHydrated] = useState(false);
  const schedulerRef = useRef<MetronomeScheduler | null>(null);
  const flashTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const barCountRef = useRef(0);
  const lastBeatRef = useRef(-1);

  // Tempo trainer state
  const [tempoTrainer, setTempoTrainer] = useState<TempoTrainerConfig>({
    enabled: false,
    startBpm: 80,
    targetBpm: 140,
    incrementBpm: 5,
    everyNBars: 4,
  });

  // Timer state
  const [timer, setTimer] = useState<TimerConfig>({
    enabled: false,
    durationMinutes: 5,
    remainingSeconds: 300,
  });

  // Random mute state
  const [randomMute, setRandomMute] = useState<RandomMuteConfig>({
    enabled: false,
    chance: 0.3,
  });
  const timerIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const getScheduler = useCallback(() => {
    if (!schedulerRef.current) {
      schedulerRef.current = new MetronomeScheduler();
    }
    return schedulerRef.current;
  }, []);

  // Load saved settings after mount (client-only) — must run BEFORE save effect
  useEffect(() => {
    const saved = loadSettings();
    if (Object.keys(saved).length > 0) {
      const { tempoTrainer: savedTrainer, timer: savedTimer, randomMute: savedRandomMute, ...savedState } = saved;
      setState(prev => ({ ...prev, ...savedState }));
      if (savedTrainer) {
        setTempoTrainer(prev => ({ ...prev, ...savedTrainer }));
      }
      if (savedTimer) {
        setTimer(prev => ({
          ...prev,
          ...savedTimer,
          remainingSeconds: (savedTimer.durationMinutes ?? prev.durationMinutes) * 60,
        }));
      }
      if (savedRandomMute) {
        setRandomMute(prev => ({ ...prev, ...savedRandomMute }));
      }
      const scheduler = schedulerRef.current;
      if (scheduler) {
        if (savedState.bpm) scheduler.setBpm(savedState.bpm);
        if (savedState.beatsPerBar) scheduler.setBeatsPerBar(savedState.beatsPerBar);
        if (savedState.subdivision) scheduler.setSubdivision(savedState.subdivision);
        if (savedState.sound) scheduler.setSound(savedState.sound);
        if (savedState.accentSound) scheduler.setAccentSound(savedState.accentSound);
        if (savedState.accents) scheduler.setAccents(savedState.accents);
        if (savedState.volume !== undefined) scheduler.setVolume(savedState.volume);
      }
    }
    setHydrated(true);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Auto-save settings to localStorage — only after hydration to avoid overwriting saved data
  useEffect(() => {
    if (!hydrated) return;
    saveSettings(state, tempoTrainer, timer, randomMute);
  }, [hydrated, state.bpm, state.beatsPerBar, state.beatUnit, state.subdivision, state.sound, state.accentSound, state.accents, state.volume, tempoTrainer, timer.enabled, timer.durationMinutes, randomMute]);

  const onBeatCallback: BeatCallback = useCallback((event) => {
    setState((prev) => {
      const newState = {
        ...prev,
        currentBeat: event.beat,
        currentSubBeat: event.subBeat,
        flashBeat: event.beat,
      };

      // Track bar count for tempo trainer
      if (event.beat === 0 && event.subBeat === 0 && lastBeatRef.current !== 0) {
        barCountRef.current++;
      }
      lastBeatRef.current = event.beat;

      return newState;
    });

    // Clear flash after animation
    if (flashTimeoutRef.current) clearTimeout(flashTimeoutRef.current);
    flashTimeoutRef.current = setTimeout(() => {
      setState((prev) => ({ ...prev, flashBeat: null }));
    }, 100);
  }, []);

  // Tempo trainer effect
  useEffect(() => {
    if (!tempoTrainer.enabled || !state.isPlaying) return;

    const checkInterval = setInterval(() => {
      if (barCountRef.current >= tempoTrainer.everyNBars) {
        barCountRef.current = 0;
        setState((prev) => {
          const direction = tempoTrainer.targetBpm > tempoTrainer.startBpm ? 1 : -1;
          const newBpm = clampBpm(prev.bpm + tempoTrainer.incrementBpm * direction);
          const reachedTarget =
            direction > 0 ? newBpm >= tempoTrainer.targetBpm : newBpm <= tempoTrainer.targetBpm;
          const finalBpm = reachedTarget ? tempoTrainer.targetBpm : newBpm;
          const scheduler = schedulerRef.current;
          if (scheduler) scheduler.setBpm(finalBpm);
          return { ...prev, bpm: finalBpm };
        });
      }
    }, 500);

    return () => clearInterval(checkInterval);
  }, [tempoTrainer, state.isPlaying]);

  // Timer effect
  useEffect(() => {
    if (!timer.enabled || !state.isPlaying) {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
        timerIntervalRef.current = null;
      }
      return;
    }

    timerIntervalRef.current = setInterval(() => {
      setTimer((prev) => {
        const remaining = prev.remainingSeconds - 1;
        if (remaining <= 0) {
          // Time's up, stop metronome
          stop();
          return { ...prev, remainingSeconds: 0 };
        }
        return { ...prev, remainingSeconds: remaining };
      });
    }, 1000);

    return () => {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
        timerIntervalRef.current = null;
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timer.enabled, state.isPlaying]);

  const syncScheduler = useCallback(
    (overrides?: Partial<MetronomeState>) => {
      const scheduler = getScheduler();
      const s = { ...state, ...overrides };
      scheduler.setBpm(s.bpm);
      scheduler.setBeatsPerBar(s.beatsPerBar);
      scheduler.setSubdivision(s.subdivision);
      scheduler.setSound(s.sound);
      scheduler.setAccentSound(s.accentSound);
      scheduler.setAccents(s.accents);
      scheduler.setVolume(s.volume);
      scheduler.setRandomMuteChance(randomMute.enabled ? randomMute.chance : 0);
    },
    [getScheduler, state, randomMute]
  );

  const start = useCallback(() => {
    const scheduler = getScheduler();
    syncScheduler();
    scheduler.setOnBeat(onBeatCallback);
    barCountRef.current = 0;
    lastBeatRef.current = -1;
    scheduler.start();
    setState((prev) => ({ ...prev, isPlaying: true, currentBeat: -1 }));

    if (timer.enabled) {
      setTimer((prev) => ({ ...prev, remainingSeconds: prev.durationMinutes * 60 }));
    }
  }, [getScheduler, syncScheduler, onBeatCallback, timer.enabled]);

  const stop = useCallback(() => {
    const scheduler = getScheduler();
    scheduler.stop();
    setState((prev) => ({
      ...prev,
      isPlaying: false,
      currentBeat: -1,
      currentSubBeat: 0,
      flashBeat: null,
    }));
  }, [getScheduler]);

  const toggle = useCallback(() => {
    if (state.isPlaying) {
      stop();
    } else {
      start();
    }
  }, [state.isPlaying, start, stop]);

  const setBpm = useCallback(
    (bpm: number) => {
      const clamped = clampBpm(bpm);
      setState((prev) => ({ ...prev, bpm: clamped }));
      const scheduler = schedulerRef.current;
      if (scheduler) scheduler.setBpm(clamped);
    },
    []
  );

  const setBeatsPerBar = useCallback(
    (beats: number) => {
      const newAccents: AccentLevel[] = Array.from({ length: beats }, (_, i) =>
        i === 0 ? 3 : 2
      ) as AccentLevel[];
      setState((prev) => ({ ...prev, beatsPerBar: beats, accents: newAccents, currentBeat: -1 }));
      const scheduler = schedulerRef.current;
      if (scheduler) {
        scheduler.setBeatsPerBar(beats);
        scheduler.setAccents(newAccents);
      }
    },
    []
  );

  const setBeatUnit = useCallback((unit: 4 | 8) => {
    setState((prev) => ({ ...prev, beatUnit: unit }));
  }, []);

  const setSubdivision = useCallback(
    (sub: SubdivisionType) => {
      setState((prev) => ({ ...prev, subdivision: sub }));
      const scheduler = schedulerRef.current;
      if (scheduler) scheduler.setSubdivision(sub);
    },
    []
  );

  const setSound = useCallback(
    (sound: SoundType) => {
      setState((prev) => ({ ...prev, sound }));
      const scheduler = schedulerRef.current;
      if (scheduler) scheduler.setSound(sound);
    },
    []
  );

  const setAccentSound = useCallback(
    (sound: SoundType) => {
      setState((prev) => ({ ...prev, accentSound: sound }));
      const scheduler = schedulerRef.current;
      if (scheduler) scheduler.setAccentSound(sound);
    },
    []
  );

  const setAccents = useCallback(
    (accents: AccentLevel[]) => {
      setState((prev) => ({ ...prev, accents }));
      const scheduler = schedulerRef.current;
      if (scheduler) scheduler.setAccents(accents);
    },
    []
  );

  const setVolume = useCallback(
    (volume: number) => {
      setState((prev) => ({ ...prev, volume }));
      const scheduler = schedulerRef.current;
      if (scheduler) scheduler.setVolume(volume);
    },
    []
  );

  // Sync random mute chance to scheduler on change
  useEffect(() => {
    const scheduler = schedulerRef.current;
    if (scheduler) {
      scheduler.setRandomMuteChance(randomMute.enabled ? randomMute.chance : 0);
    }
  }, [randomMute.enabled, randomMute.chance]);

  const toggleAccent = useCallback(
    (beatIndex: number) => {
      setState((prev) => {
        const newAccents = [...prev.accents];
        const current = newAccents[beatIndex];
        // Cycle: 3 -> 2 -> 1 -> 0 -> 3
        newAccents[beatIndex] = ((current + 3) % 4) as AccentLevel;
        const scheduler = schedulerRef.current;
        if (scheduler) scheduler.setAccents(newAccents);
        return { ...prev, accents: newAccents };
      });
    },
    []
  );

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      schedulerRef.current?.dispose();
    };
  }, []);

  return {
    state,
    start,
    stop,
    toggle,
    setBpm,
    setBeatsPerBar,
    setBeatUnit,
    setSubdivision,
    setSound,
    setAccentSound,
    setAccents,
    setVolume,
    toggleAccent,
    tempoTrainer,
    setTempoTrainer,
    timer,
    setTimer,
    randomMute,
    setRandomMute,
  };
}
