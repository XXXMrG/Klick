'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { PatternScheduler } from '@/lib/audio/PatternScheduler';
import { Exercise } from '@/lib/practice/types';

export function usePracticePlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentNoteIndex, setCurrentNoteIndex] = useState(-1);
  const [currentExercise, setCurrentExercise] = useState<Exercise | null>(null);
  const [bpm, setBpmState] = useState(80);
  const schedulerRef = useRef<PatternScheduler | null>(null);

  const getScheduler = useCallback(() => {
    if (!schedulerRef.current) {
      schedulerRef.current = new PatternScheduler();
    }
    return schedulerRef.current;
  }, []);

  const loadExercise = useCallback((exercise: Exercise) => {
    const scheduler = getScheduler();
    if (isPlaying) scheduler.stop();
    scheduler.setExercise(exercise);
    setCurrentExercise(exercise);
    setBpmState(exercise.defaultBpm);
    setIsPlaying(false);
    setCurrentNoteIndex(-1);
  }, [getScheduler, isPlaying]);

  const play = useCallback(() => {
    if (!currentExercise) return;
    const scheduler = getScheduler();
    scheduler.setOnNote((noteIndex) => {
      setCurrentNoteIndex(noteIndex);
    });
    scheduler.start();
    setIsPlaying(true);
  }, [getScheduler, currentExercise]);

  const stop = useCallback(() => {
    const scheduler = getScheduler();
    scheduler.stop();
    setIsPlaying(false);
    setCurrentNoteIndex(-1);
  }, [getScheduler]);

  const toggle = useCallback(() => {
    if (isPlaying) stop(); else play();
  }, [isPlaying, play, stop]);

  const setBpm = useCallback((newBpm: number) => {
    setBpmState(newBpm);
    const scheduler = schedulerRef.current;
    if (scheduler) scheduler.setBpm(newBpm);
  }, []);

  const setVolume = useCallback((vol: number) => {
    const scheduler = schedulerRef.current;
    if (scheduler) scheduler.setVolume(vol);
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      schedulerRef.current?.dispose();
    };
  }, []);

  return {
    isPlaying,
    currentNoteIndex,
    currentExercise,
    bpm,
    loadExercise,
    play,
    stop,
    toggle,
    setBpm,
    setVolume,
  };
}
