import { TEMPO_MARKINGS } from '@/types/metronome';

export function getTempoMarking(bpm: number): string {
  for (const mark of TEMPO_MARKINGS) {
    if (bpm <= mark.max) return mark.name;
  }
  return 'Prestissimo';
}

export function clampBpm(bpm: number): number {
  return Math.min(300, Math.max(1, Math.round(bpm)));
}
