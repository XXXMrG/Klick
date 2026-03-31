'use client';

import { useState, useEffect, useCallback } from 'react';
import { PracticeEntry } from '@/lib/practice/types';
import { generateRecommendation, getExerciseById } from '@/lib/practice/recommend';
import { loadDailyPlan, saveDailyPlan, getToday, loadPracticeSettings } from '@/lib/practice/storage';

export function useRecommendation(history: PracticeEntry[]) {
  const [planIds, setPlanIds] = useState<string[]>([]);

  useEffect(() => {
    const today = getToday();
    const saved = loadDailyPlan();

    if (saved && saved.date === today) {
      setPlanIds(saved.exerciseIds);
    } else {
      const settings = loadPracticeSettings();
      const recommended = generateRecommendation(history, settings.sessionSize);
      const plan = { date: today, exerciseIds: recommended };
      saveDailyPlan(plan);
      setPlanIds(recommended);
    }
  }, [history]);

  const refresh = useCallback(() => {
    const settings = loadPracticeSettings();
    const recommended = generateRecommendation(history, settings.sessionSize);
    const plan = { date: getToday(), exerciseIds: recommended };
    saveDailyPlan(plan);
    setPlanIds(recommended);
  }, [history]);

  const exercises = planIds.map(id => getExerciseById(id)).filter(Boolean);

  return { planIds, exercises, refresh };
}
