import { Exercise, PracticeEntry } from './types';
import { STICK_CONTROL_EXERCISES } from './data/stick-control';
import { PAS_40_EXERCISES } from './data/pas-40';

const ALL_EXERCISES = [...STICK_CONTROL_EXERCISES, ...PAS_40_EXERCISES];

export function getAllExercises(): Exercise[] {
  return ALL_EXERCISES;
}

export function getExerciseById(id: string): Exercise | undefined {
  return ALL_EXERCISES.find(e => e.id === id);
}

/**
 * Smart recommendation algorithm.
 * Inputs: all exercises, user's practice history, current date.
 * Logic:
 * 1. Include 1-2 new exercises user hasn't tried
 * 2. Prioritize exercises with BPM far below target
 * 3. Rotate categories (don't repeat same category daily)
 * 4. Include 2-3 "easy wins" near target BPM for motivation
 * 5. Session size: 6-8 exercises (configurable)
 */
export function generateRecommendation(
  history: PracticeEntry[],
  sessionSize: number = 6,
): string[] {
  const practicedIds = new Set(history.map(e => e.exerciseId));
  const completedToday = new Set(
    history.filter(e => e.date === new Date().toISOString().slice(0, 10) && e.completed)
      .map(e => e.exerciseId)
  );

  // Calculate max BPM achieved per exercise
  const maxBpmMap: Record<string, number> = {};
  for (const entry of history) {
    if (entry.completed) {
      maxBpmMap[entry.exerciseId] = Math.max(maxBpmMap[entry.exerciseId] || 0, entry.bpm);
    }
  }

  // Yesterday's categories — for rotation
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().slice(0, 10);
  const yesterdayCategories = new Set(
    history.filter(e => e.date === yesterdayStr)
      .map(e => getExerciseById(e.exerciseId)?.category)
      .filter(Boolean)
  );

  // Categorize exercises
  const newExercises: Exercise[] = [];
  const needsWork: Exercise[] = [];
  const easyWins: Exercise[] = [];
  const practiced: Exercise[] = [];

  for (const ex of ALL_EXERCISES) {
    if (completedToday.has(ex.id)) continue;

    if (!practicedIds.has(ex.id)) {
      newExercises.push(ex);
    } else {
      const maxBpm = maxBpmMap[ex.id] || ex.defaultBpm;
      const progress = maxBpm / ex.targetBpm;
      if (progress >= 0.85) {
        easyWins.push(ex);
      } else {
        needsWork.push(ex);
      }
      practiced.push(ex);
    }
  }

  // Sort new exercises by tier (start with easier ones)
  newExercises.sort((a, b) => a.tier - b.tier);

  // Sort needsWork by how far from target (furthest first)
  needsWork.sort((a, b) => {
    const progressA = (maxBpmMap[a.id] || a.defaultBpm) / a.targetBpm;
    const progressB = (maxBpmMap[b.id] || b.defaultBpm) / b.targetBpm;
    return progressA - progressB;
  });

  // Build recommendation
  const result: string[] = [];
  const usedCategories = new Set<string>();

  const addWithCategoryRotation = (exercises: Exercise[], count: number) => {
    let added = 0;
    // Prefer categories not used yesterday
    const preferred = exercises.filter(e => !yesterdayCategories.has(e.category));
    const rest = exercises.filter(e => yesterdayCategories.has(e.category));
    const sorted = [...preferred, ...rest];

    for (const ex of sorted) {
      if (added >= count || result.length >= sessionSize) break;
      if (result.includes(ex.id)) continue;
      // Allow max 2 from same category
      const catCount = [...result].filter(id => getExerciseById(id)?.category === ex.category).length;
      if (catCount >= 2) continue;
      result.push(ex.id);
      usedCategories.add(ex.category);
      added++;
    }
  };

  // 1. Add 1-2 new exercises
  addWithCategoryRotation(newExercises, Math.min(2, newExercises.length));

  // 2. Add exercises needing work
  addWithCategoryRotation(needsWork, Math.max(2, sessionSize - 4));

  // 3. Add easy wins for motivation
  addWithCategoryRotation(easyWins, Math.min(3, sessionSize - result.length));

  // 4. Fill remaining slots
  if (result.length < sessionSize) {
    const remaining = ALL_EXERCISES.filter(e =>
      !result.includes(e.id) && !completedToday.has(e.id)
    );
    remaining.sort((a, b) => a.tier - b.tier);
    addWithCategoryRotation(remaining, sessionSize - result.length);
  }

  return result.slice(0, sessionSize);
}
