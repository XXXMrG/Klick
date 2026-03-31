'use client';

import { useState, useCallback, useEffect } from 'react';
import { PracticeEntry } from '@/lib/practice/types';
import {
  loadPracticeLog,
  savePracticeLog,
  getToday,
  getStreak,
  getPracticeDaysMap,
} from '@/lib/practice/storage';

export function usePracticeLog() {
  const [entries, setEntries] = useState<PracticeEntry[]>([]);
  const [streak, setStreakVal] = useState(0);
  const [daysMap, setDaysMap] = useState<Record<string, number>>({});

  useEffect(() => {
    const log = loadPracticeLog();
    setEntries(log);
    setStreakVal(getStreak());
    setDaysMap(getPracticeDaysMap());
  }, []);

  const addEntry = useCallback((entry: Omit<PracticeEntry, 'date'>) => {
    const full: PracticeEntry = { ...entry, date: getToday() };
    setEntries(prev => {
      const next = [...prev, full];
      savePracticeLog(next);
      return next;
    });
    setStreakVal(getStreak());
    setDaysMap(getPracticeDaysMap());
  }, []);

  const markComplete = useCallback((exerciseId: string, bpm: number, durationSeconds: number) => {
    addEntry({ exerciseId, bpm, completed: true, durationSeconds });
  }, [addEntry]);

  const todayEntries = entries.filter(e => e.date === getToday());
  const completedToday = new Set(todayEntries.filter(e => e.completed).map(e => e.exerciseId));

  const getMaxBpm = useCallback((exerciseId: string): number => {
    const exEntries = entries.filter(e => e.exerciseId === exerciseId && e.completed);
    if (exEntries.length === 0) return 0;
    return Math.max(...exEntries.map(e => e.bpm));
  }, [entries]);

  return {
    entries,
    todayEntries,
    completedToday,
    streak,
    daysMap,
    addEntry,
    markComplete,
    getMaxBpm,
  };
}
