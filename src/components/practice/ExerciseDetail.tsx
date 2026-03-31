'use client';

import { Exercise } from '@/lib/practice/types';
import { Play, Square, Check, Minus, Plus } from 'lucide-react';
import { useI18n } from '@/i18n';
import StickingDisplay from './StickingDisplay';

interface ExerciseDetailProps {
  exercise: Exercise;
  isPlaying: boolean;
  currentNoteIndex: number;
  bpm: number;
  maxBpm: number;
  isCompleted: boolean;
  onPlay: () => void;
  onStop: () => void;
  onBpmChange: (bpm: number) => void;
  onMarkComplete: () => void;
}

export default function ExerciseDetail({
  exercise,
  isPlaying,
  currentNoteIndex,
  bpm,
  maxBpm,
  isCompleted,
  onPlay,
  onStop,
  onBpmChange,
  onMarkComplete,
}: ExerciseDetailProps) {
  const { locale, t } = useI18n();
  const name = locale === 'zh' ? exercise.nameZh : locale === 'ja' ? exercise.nameJa : exercise.name;
  const progress = maxBpm > 0 ? Math.min(1, maxBpm / exercise.targetBpm) : 0;

  return (
    <div
      className="rounded-lg p-4 sm:p-6"
      style={{
        backgroundColor: 'var(--bg-surface)',
        border: '1px solid var(--border-subtle)',
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span
              className="text-xs px-2 py-0.5 rounded font-bold"
              style={{
                backgroundColor: 'var(--accent-primary)',
                color: '#fff',
                fontFamily: 'var(--font-mono), monospace',
              }}
            >
              #{exercise.number}
            </span>
            <span
              className="text-xs px-1.5 py-0.5 rounded"
              style={{
                backgroundColor: 'var(--bg-control)',
                color: 'var(--text-muted)',
                fontFamily: 'var(--font-mono), monospace',
              }}
            >
              {exercise.book === 'pas-40' ? 'PAS' : 'SC'} | {exercise.category}
            </span>
          </div>
          <h2
            className="text-lg font-bold"
            style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-display), sans-serif' }}
          >
            {name}
          </h2>
        </div>
        {isCompleted && (
          <div className="flex items-center gap-1 px-2 py-1 rounded" style={{ backgroundColor: 'var(--success)', color: '#fff' }}>
            <Check size={14} />
            <span className="text-xs font-medium">{t.practice.completed}</span>
          </div>
        )}
      </div>

      {/* Sticking pattern visualization */}
      <div className="mb-6">
        <StickingDisplay
          exercise={exercise}
          currentNoteIndex={currentNoteIndex}
          isPlaying={isPlaying}
        />
      </div>

      {/* BPM Control */}
      <div className="flex items-center justify-center gap-4 mb-4">
        <button
          onClick={() => onBpmChange(Math.max(1, bpm - 5))}
          className="w-8 h-8 rounded-full flex items-center justify-center"
          style={{ backgroundColor: 'var(--bg-control)', color: 'var(--text-secondary)' }}
        >
          <Minus size={14} />
        </button>
        <div className="text-center">
          <div
            className="text-3xl font-bold tabular-nums"
            style={{ fontFamily: 'var(--font-display), sans-serif', color: 'var(--text-primary)' }}
          >
            {bpm}
          </div>
          <div
            className="text-xs"
            style={{ fontFamily: 'var(--font-mono), monospace', color: 'var(--text-muted)' }}
          >
            {t.bpm.label}
          </div>
        </div>
        <button
          onClick={() => onBpmChange(Math.min(300, bpm + 5))}
          className="w-8 h-8 rounded-full flex items-center justify-center"
          style={{ backgroundColor: 'var(--bg-control)', color: 'var(--text-secondary)' }}
        >
          <Plus size={14} />
        </button>
      </div>

      {/* BPM slider */}
      <div className="mb-4 px-2">
        <input
          type="range"
          min="30"
          max="300"
          value={bpm}
          onChange={(e) => onBpmChange(parseInt(e.target.value))}
          className="w-full h-2 rounded-full appearance-none cursor-pointer"
          style={{
            background: `linear-gradient(to right, var(--accent-primary) 0%, var(--accent-primary) ${
              ((bpm - 30) / 270) * 100
            }%, var(--bg-control) ${((bpm - 30) / 270) * 100}%, var(--bg-control) 100%)`,
            accentColor: 'var(--accent-primary)',
          }}
        />
        <div className="flex justify-between text-[10px] mt-1" style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono), monospace' }}>
          <span>{t.practice.defaultBpm}: {exercise.defaultBpm}</span>
          <span>{t.practice.targetBpm}: {exercise.targetBpm}</span>
        </div>
      </div>

      {/* Progress */}
      <div className="mb-4">
        <div className="flex items-center justify-between text-xs mb-1" style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono), monospace' }}>
          <span>{t.practice.bestBpm}: {maxBpm || '-'}</span>
          <span>{Math.round(progress * 100)}%</span>
        </div>
        <div className="h-2 rounded-full overflow-hidden" style={{ backgroundColor: 'var(--bg-control)' }}>
          <div
            className="h-full rounded-full transition-all"
            style={{
              width: `${progress * 100}%`,
              backgroundColor: progress >= 0.85 ? 'var(--success)' : 'var(--accent-primary)',
            }}
          />
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex gap-3">
        <button
          onClick={isPlaying ? onStop : onPlay}
          className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg font-medium transition-colors"
          style={{
            backgroundColor: isPlaying ? 'var(--error)' : 'var(--accent-primary)',
            color: '#fff',
          }}
        >
          {isPlaying ? <Square size={16} /> : <Play size={16} />}
          {isPlaying ? t.practice.stop : t.practice.play}
        </button>
        {!isCompleted && (
          <button
            onClick={onMarkComplete}
            className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg font-medium transition-colors"
            style={{
              backgroundColor: 'var(--bg-control)',
              color: 'var(--text-secondary)',
              border: '1px solid var(--border-subtle)',
            }}
          >
            <Check size={16} />
            {t.practice.markDone}
          </button>
        )}
      </div>
    </div>
  );
}
