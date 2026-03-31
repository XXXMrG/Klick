import { PracticeEntry, DailyPlan, PracticeSettings } from './types';

const PRACTICE_LOG_KEY = 'practice-log';
const PRACTICE_PLAN_KEY = 'practice-plan';
const PRACTICE_SETTINGS_KEY = 'practice-settings';

// ─── Practice Log ───────────────────────────────────────────────────────────

export function loadPracticeLog(): PracticeEntry[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(PRACTICE_LOG_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function savePracticeLog(entries: PracticeEntry[]) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(PRACTICE_LOG_KEY, JSON.stringify(entries));
}

export function addPracticeEntry(entry: PracticeEntry): PracticeEntry[] {
  const log = loadPracticeLog();
  log.push(entry);
  savePracticeLog(log);
  return log;
}

export function getEntriesForDate(date: string): PracticeEntry[] {
  return loadPracticeLog().filter(e => e.date === date);
}

export function getEntriesForExercise(exerciseId: string): PracticeEntry[] {
  return loadPracticeLog().filter(e => e.exerciseId === exerciseId);
}

export function getMaxBpmForExercise(exerciseId: string): number {
  const entries = getEntriesForExercise(exerciseId).filter(e => e.completed);
  if (entries.length === 0) return 0;
  return Math.max(...entries.map(e => e.bpm));
}

// ─── Daily Plan ─────────────────────────────────────────────────────────────

export function loadDailyPlan(): DailyPlan | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(PRACTICE_PLAN_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function saveDailyPlan(plan: DailyPlan) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(PRACTICE_PLAN_KEY, JSON.stringify(plan));
}

// ─── Settings ───────────────────────────────────────────────────────────────

const DEFAULT_SETTINGS: PracticeSettings = {
  sessionSize: 6,
};

export function loadPracticeSettings(): PracticeSettings {
  if (typeof window === 'undefined') return DEFAULT_SETTINGS;
  try {
    const raw = localStorage.getItem(PRACTICE_SETTINGS_KEY);
    return raw ? { ...DEFAULT_SETTINGS, ...JSON.parse(raw) } : DEFAULT_SETTINGS;
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export function savePracticeSettings(settings: PracticeSettings) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(PRACTICE_SETTINGS_KEY, JSON.stringify(settings));
}

// ─── Helpers ────────────────────────────────────────────────────────────────

export function getToday(): string {
  return new Date().toISOString().slice(0, 10);
}

export function getStreak(): number {
  const log = loadPracticeLog();
  if (log.length === 0) return 0;

  const dates = [...new Set(log.filter(e => e.completed).map(e => e.date))].sort().reverse();
  if (dates.length === 0) return 0;

  let streak = 0;
  const today = getToday();
  let checkDate = today;

  for (let i = 0; i < 365; i++) {
    if (dates.includes(checkDate)) {
      streak++;
    } else if (checkDate !== today) {
      break;
    }
    // Go back one day
    const d = new Date(checkDate);
    d.setDate(d.getDate() - 1);
    checkDate = d.toISOString().slice(0, 10);
  }

  return streak;
}

export function getPracticeDaysMap(): Record<string, number> {
  const log = loadPracticeLog();
  const map: Record<string, number> = {};
  for (const entry of log) {
    if (entry.completed) {
      map[entry.date] = (map[entry.date] || 0) + 1;
    }
  }
  return map;
}
