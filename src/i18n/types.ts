export type Locale = 'zh' | 'en' | 'ja';

export interface TranslationKeys {
  meta: {
    title: string;
    titleWithBpm: string;
  };
  header: {
    tempoTrainer: string;
    timer: string;
    visualOn: string;
    visualOff: string;
    skin: string;
    darkMode: string;
    lightMode: string;
    shortcuts: string;
    flashMode: string;
    language: string;
    more: string;
  };
  flash: {
    exitHint: string;
  };
  shortcuts: {
    space: string;
    playStop: string;
    bpmUpDown: string;
    bpmFive: string;
  };
  footer: {
    hint: string;
  };
  bpm: {
    label: string;
  };
  timeSig: {
    label: string;
  };
  subdivision: {
    label: string;
  };
  subdivisions: {
    quarter: { label: string; name: string; desc: string };
    eighth: { label: string; name: string; desc: string };
    triplet: { label: string; name: string; desc: string };
    sixteenth: { label: string; name: string; desc: string };
    dottedLong: { label: string; name: string; desc: string };
    dottedShort: { label: string; name: string; desc: string };
    syncA: { label: string; name: string; desc: string };
    syncB: { label: string; name: string; desc: string };
    syncC: { label: string; name: string; desc: string };
    triplet16A: { label: string; name: string; desc: string };
    triplet16B: { label: string; name: string; desc: string };
    quintuplet: { label: string; name: string; desc: string };
  };
  volume: {
    label: string;
  };
  sound: {
    normalLabel: string;
    normalDesc: string;
    accentLabel: string;
    accentDesc: string;
    tok: string;
    beep: string;
    hihat: string;
    kick: string;
    rim: string;
    woodblock: string;
    clap: string;
    cowbell: string;
  };
  accent: {
    label: string;
    mute: string;
    ghost: string;
    normal: string;
    accent: string;
  };
  beat: {
    beatN: string; // "Beat {n}" — use {n} placeholder
  };
  trainer: {
    label: string;
    startBpm: string;
    targetBpm: string;
    incrementBpm: string;
    everyNBars: string;
  };
  timer: {
    label: string;
    minutes: string; // "{n} min" — use {n} placeholder
  };
  skinPicker: {
    appearanceMode: string;
    dark: string;
    light: string;
    skinsLabel: string;
  };
  skins: {
    default: string;
    ocean: string;
    forest: string;
    minimal: string;
    pixel: string;
    classical: string;
  };
  presets: {
    'standard-4-4': string;
    'waltz-3-4': string;
    'six-eight': string;
    'take-five': string;
    'balkan-7-8': string;
    'swing-12-8': string;
    'half-time': string;
    'double-time': string;
  };
  logo: {
    ariaLabel: string;
  };
}
