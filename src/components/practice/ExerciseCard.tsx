'use client';

import { Exercise } from '@/lib/practice/types';
import { Play, Square, Check } from 'lucide-react';
import { useI18n } from '@/i18n';

interface ExerciseCardProps {
  exercise: Exercise;
  isCompleted: boolean;
  maxBpm: number;
  isPlaying: boolean;
  isActive: boolean;
  onPlay: () => void;
  onStop: () => void;
  onSelect: () => void;
}

function getTierLabel(tier: number): string {
  return `T${tier}`;
}

function getCategoryColor(category: string): string {
  switch (category) {
    case 'rolls': return 'var(--accent-primary)';
    case 'paradiddles': return 'var(--success)';
    case 'flams': return '#e879f9';
    case 'drags': return '#f59e0b';
    case 'single-beat': return 'var(--accent-secondary)';
    default: return 'var(--text-muted)';
  }
}

export default function ExerciseCard({
  exercise,
  isCompleted,
  maxBpm,
  isPlaying,
  isActive,
  onPlay,
  onStop,
  onSelect,
}: ExerciseCardProps) {
  const { locale, t } = useI18n();
  const name = locale === 'zh' ? exercise.nameZh : locale === 'ja' ? exercise.nameJa : exercise.name;
  const progress = maxBpm > 0 ? Math.min(1, maxBpm / exercise.targetBpm) : 0;
  const categoryColor = getCategoryColor(exercise.category);

  return (
    <div
      className="rounded-lg p-3 cursor-pointer transition-all"
      style={{
        backgroundColor: isActive ? 'var(--accent-dim)' : 'var(--bg-surface)',
        border: isActive ? '1px solid var(--accent-primary)' : '1px solid var(--border-subtle)',
      }}
      onClick={onSelect}
    >
      <div className="flex items-center gap-3">
        {/* Play/Stop button */}
        <button
          onClick={(e) => { e.stopPropagation(); isPlaying && isActive ? onStop() : onPlay(); }}
          className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-colors"
          style={{
            backgroundColor: isPlaying && isActive ? 'var(--error)' : 'var(--accent-primary)',
            color: '#fff',
          }}
        >
          {isPlaying && isActive ? <Square size={12} /> : <Play size={12} className="ml-0.5" />}
        </button>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span
              className="text-[10px] px-1.5 py-0.5 rounded font-bold"
              style={{
                backgroundColor: categoryColor,
                color: '#fff',
                fontFamily: 'var(--font-mono), monospace',
              }}
            >
              #{exercise.number}
            </span>
            <span
              className="text-[10px] px-1 py-0.5 rounded"
              style={{
                backgroundColor: 'var(--bg-control)',
                color: 'var(--text-muted)',
                fontFamily: 'var(--font-mono), monospace',
              }}
            >
              {getTierLabel(exercise.tier)}
            </span>
            <span
              className="text-sm font-medium truncate"
              style={{ color: 'var(--text-primary)' }}
            >
              {name}
            </span>
            {isCompleted && (
              <Check size={14} style={{ color: 'var(--success)', flexShrink: 0 }} />
            )}
          </div>

          {/* Sticking display */}
          <div
            className="text-xs mt-1 tracking-wider"
            style={{
              fontFamily: 'var(--font-mono), monospace',
              color: 'var(--text-secondary)',
            }}
          >
            {exercise.sticking}
          </div>

          {/* Progress bar */}
          <div className="flex items-center gap-2 mt-1.5">
            <div
              className="flex-1 h-1 rounded-full overflow-hidden"
              style={{ backgroundColor: 'var(--bg-control)' }}
            >
              <div
                className="h-full rounded-full transition-all"
                style={{
                  width: `${progress * 100}%`,
                  backgroundColor: progress >= 0.85 ? 'var(--success)' : 'var(--accent-primary)',
                }}
              />
            </div>
            <span
              className="text-[10px] flex-shrink-0 tabular-nums"
              style={{ fontFamily: 'var(--font-mono), monospace', color: 'var(--text-muted)' }}
            >
              {maxBpm > 0 ? maxBpm : exercise.defaultBpm}/{exercise.targetBpm} {t.bpm.label}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
