export type SoundType = 'tok' | 'beep' | 'hihat' | 'kick' | 'rim' | 'woodblock' | 'clap' | 'cowbell';

export type AccentLevel = 0 | 1 | 2 | 3; // 0=mute, 1=ghost, 2=normal, 3=accent

export type SubdivisionType =
  | "quarter"         // 1: 四分音符
  | "eighth"          // 2: 八分音符
  | "triplet"         // 3: 三连音
  | "sixteenth"       // 4: 十六分音符
  | "dotted-long"     // 5: 附点八分（前长后短）
  | "dotted-short"    // 6: 附点八分（前短后长）
  | "sync-a"          // 7: 切分节奏 A
  | "sync-b"          // 8: 切分节奏 B
  | "sync-c"          // 9: 切分节奏 C
  | "triplet16-a"     // 10: 十六分三连音 A
  | "triplet16-b";    // 11: 十六分三连音 B

export interface SubdivisionConfig {
  type: SubdivisionType;
  notesPerBeat: number;
  intervals: number[];
}

const S = 1/6; // one sixth of a beat

export const SUBDIVISION_CONFIGS: Record<SubdivisionType, SubdivisionConfig> = {
  "quarter":      { type: "quarter",      notesPerBeat: 1, intervals: [1] },
  "eighth":       { type: "eighth",       notesPerBeat: 2, intervals: [0.5, 0.5] },
  "triplet":      { type: "triplet",      notesPerBeat: 3, intervals: [1/3, 1/3, 1/3] },
  "sixteenth":    { type: "sixteenth",    notesPerBeat: 4, intervals: [0.25, 0.25, 0.25, 0.25] },
  "dotted-long":  { type: "dotted-long",  notesPerBeat: 2, intervals: [0.75, 0.25] },
  "dotted-short": { type: "dotted-short", notesPerBeat: 2, intervals: [0.25, 0.75] },
  "sync-a":       { type: "sync-a",       notesPerBeat: 4, intervals: [2*S, 2*S, S, S] },
  "sync-b":       { type: "sync-b",       notesPerBeat: 4, intervals: [S, S, 2*S, 2*S] },
  "sync-c":       { type: "sync-c",       notesPerBeat: 4, intervals: [2*S, S, S, 2*S] },
  "triplet16-a":  { type: "triplet16-a",  notesPerBeat: 4, intervals: [3*S, S, S, S] },
  "triplet16-b":  { type: "triplet16-b",  notesPerBeat: 4, intervals: [S, S, S, 3*S] },
};

export interface SubdivisionOption {
  type: SubdivisionType;
  label: string;         // Chinese display name
  englishName: string;   // English name (for tooltip)
  description: string;   // description for tooltip
}

export const SUBDIVISIONS: SubdivisionOption[] = [
  { type: "quarter",      label: "四分",     englishName: "Quarter",              description: "每拍 1 下" },
  { type: "eighth",       label: "八分",     englishName: "Eighth",               description: "每拍 2 下，等分" },
  { type: "triplet",      label: "三连音",   englishName: "Triplet",              description: "每拍 3 下，等分" },
  { type: "sixteenth",    label: "十六分",   englishName: "Sixteenth",            description: "每拍 4 下，等分" },
  { type: "dotted-long",  label: "附点↗",    englishName: "Dotted (long-short)",  description: "前长后短 3:1，Shuffle" },
  { type: "dotted-short", label: "附点↘",    englishName: "Dotted (short-long)",  description: "前短后长 1:3" },
  { type: "sync-a",       label: "切分 A",   englishName: "Syncopation A",        description: "切分节奏 2:2:1:1" },
  { type: "sync-b",       label: "切分 B",   englishName: "Syncopation B",        description: "切分节奏 1:1:2:2" },
  { type: "sync-c",       label: "切分 C",   englishName: "Syncopation C",        description: "切分节奏 2:1:1:2" },
  { type: "triplet16-a",  label: "16分³A",   englishName: "16th Triplet A",       description: "十六分三连音 3:1:1:1" },
  { type: "triplet16-b",  label: "16分³B",   englishName: "16th Triplet B",       description: "十六分三连音 1:1:1:3" },
];

export interface MetronomeState {
  bpm: number;
  beatsPerBar: number;
  beatUnit: 4 | 8;
  subdivision: SubdivisionType;
  isPlaying: boolean;
  currentBeat: number;
  currentSubBeat: number;
  sound: SoundType;
  accentSound: SoundType;
  accents: AccentLevel[];
  volume: number;
  flashBeat: number | null;
}

export interface Preset {
  id: string;
  name: string;
  bpm: number;
  beatsPerBar: number;
  beatUnit: 4 | 8;
  subdivision: SubdivisionType;
  accents: AccentLevel[];
  sound: SoundType;
  isBuiltIn?: boolean;
}

export interface TempoTrainerConfig {
  enabled: boolean;
  startBpm: number;
  targetBpm: number;
  incrementBpm: number;
  everyNBars: number;
}

export interface TimerConfig {
  enabled: boolean;
  durationMinutes: number;
  remainingSeconds: number;
}

export interface BeatEvent {
  beat: number;
  subBeat: number;
  time: number;
  isDownbeat: boolean;
  isSubdivision: boolean;
}

export const TEMPO_MARKINGS: { max: number; name: string }[] = [
  { max: 20, name: 'Larghissimo' },
  { max: 40, name: 'Grave' },
  { max: 45, name: 'Lento' },
  { max: 50, name: 'Largo' },
  { max: 60, name: 'Adagio' },
  { max: 70, name: 'Adagietto' },
  { max: 85, name: 'Andante' },
  { max: 97, name: 'Moderato' },
  { max: 109, name: 'Allegretto' },
  { max: 132, name: 'Allegro' },
  { max: 140, name: 'Vivace' },
  { max: 177, name: 'Presto' },
  { max: 300, name: 'Prestissimo' },
];

export const BUILT_IN_PRESETS: Preset[] = [
  { id: 'standard-4-4', name: '4/4 标准', bpm: 120, beatsPerBar: 4, beatUnit: 4, subdivision: 'quarter', accents: [3, 2, 2, 2], sound: 'tok', isBuiltIn: true },
  { id: 'waltz-3-4', name: '3/4 华尔兹', bpm: 160, beatsPerBar: 3, beatUnit: 4, subdivision: 'quarter', accents: [3, 2, 2], sound: 'tok', isBuiltIn: true },
  { id: 'six-eight', name: '6/8 节奏', bpm: 120, beatsPerBar: 6, beatUnit: 8, subdivision: 'quarter', accents: [3, 2, 2, 3, 2, 2], sound: 'tok', isBuiltIn: true },
  { id: 'take-five', name: '5/4 Take Five', bpm: 174, beatsPerBar: 5, beatUnit: 4, subdivision: 'quarter', accents: [3, 2, 3, 2, 2], sound: 'tok', isBuiltIn: true },
  { id: 'balkan-7-8', name: '7/8 巴尔干', bpm: 120, beatsPerBar: 7, beatUnit: 8, subdivision: 'quarter', accents: [3, 2, 3, 2, 3, 2, 2], sound: 'tok', isBuiltIn: true },
  { id: 'swing-12-8', name: 'Swing 12/8', bpm: 120, beatsPerBar: 4, beatUnit: 4, subdivision: 'triplet', accents: [3, 2, 2, 2], sound: 'tok', isBuiltIn: true },
  { id: 'half-time', name: '半速', bpm: 60, beatsPerBar: 4, beatUnit: 4, subdivision: 'eighth', accents: [3, 2, 2, 2], sound: 'tok', isBuiltIn: true },
  { id: 'double-time', name: '双倍速', bpm: 200, beatsPerBar: 4, beatUnit: 4, subdivision: 'quarter', accents: [3, 2, 2, 2], sound: 'tok', isBuiltIn: true },
];
