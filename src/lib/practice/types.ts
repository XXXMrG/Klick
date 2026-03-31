export type NoteType = 'accent' | 'normal' | 'ghost' | 'flam' | 'drag' | 'buzz';
export type Hand = 'R' | 'L';
export type BookId = 'stick-control' | 'pas-40';
export type ExerciseCategory = 'single-beat' | 'rolls' | 'paradiddles' | 'flams' | 'drags';
export type GridType = 'sixteenth' | 'triplet' | 'eighth';
export type Tier = 1 | 2 | 3 | 4;

export interface PatternNote {
  position: number;        // 0-indexed position in subdivisions
  hand: Hand;
  type: NoteType;
  graceNotes?: { hand: Hand; offsetMs: number }[];  // for flam/drag grace notes
}

export interface Exercise {
  id: string;                    // 'sc-001', 'pas-01', etc.
  book: BookId;
  category: ExerciseCategory;
  number: number;
  name: string;
  nameZh: string;
  nameJa: string;
  sticking: string;              // display string like 'R L R R L R L L'
  pattern: PatternNote[];        // for audio playback
  patternLength: number;         // total subdivisions per cycle
  grid: GridType;
  timeSignature: { beats: number; noteValue: number };
  defaultBpm: number;
  targetBpm: number;
  tier: Tier;
  tags: string[];
}

export interface PracticeEntry {
  date: string;             // 'YYYY-MM-DD'
  exerciseId: string;
  bpm: number;
  completed: boolean;
  durationSeconds: number;
}

export interface PracticeSettings {
  sessionSize: number;      // 6-8 exercises
}

export interface DailyPlan {
  date: string;
  exerciseIds: string[];
}
