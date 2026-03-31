'use client';

import { Exercise } from '@/lib/practice/types';
import { useI18n } from '@/i18n';
import { RefreshCw, Sparkles } from 'lucide-react';
import ExerciseCard from './ExerciseCard';

interface TodayPlanProps {
  exercises: (Exercise | undefined)[];
  completedToday: Set<string>;
  getMaxBpm: (id: string) => number;
  playingExerciseId: string | null;
  isPlaying: boolean;
  onPlayExercise: (exercise: Exercise) => void;
  onStopExercise: () => void;
  onSelectExercise: (exercise: Exercise) => void;
  onRefresh: () => void;
}

export default function TodayPlan({
  exercises,
  completedToday,
  getMaxBpm,
  playingExerciseId,
  isPlaying,
  onPlayExercise,
  onStopExercise,
  onSelectExercise,
  onRefresh,
}: TodayPlanProps) {
  const { t } = useI18n();
  const validExercises = exercises.filter(Boolean) as Exercise[];
  const doneCount = validExercises.filter(e => completedToday.has(e.id)).length;

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Sparkles size={16} style={{ color: 'var(--accent-primary)' }} />
          <h2
            className="text-sm font-bold uppercase tracking-wider"
            style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-mono), monospace' }}
          >
            {t.practice.todayPlan}
          </h2>
          <span
            className="text-xs px-1.5 py-0.5 rounded tabular-nums"
            style={{
              backgroundColor: doneCount === validExercises.length && validExercises.length > 0
                ? 'var(--success)' : 'var(--bg-control)',
              color: doneCount === validExercises.length && validExercises.length > 0
                ? '#fff' : 'var(--text-muted)',
              fontFamily: 'var(--font-mono), monospace',
            }}
          >
            {doneCount}/{validExercises.length}
          </span>
        </div>
        <button
          onClick={onRefresh}
          className="p-1.5 rounded transition-colors"
          style={{ color: 'var(--text-muted)', backgroundColor: 'var(--bg-control)' }}
          title={t.practice.refresh}
        >
          <RefreshCw size={14} />
        </button>
      </div>

      {/* Exercise list */}
      <div className="flex flex-col gap-2">
        {validExercises.map(exercise => (
          <ExerciseCard
            key={exercise.id}
            exercise={exercise}
            isCompleted={completedToday.has(exercise.id)}
            maxBpm={getMaxBpm(exercise.id)}
            isPlaying={isPlaying && playingExerciseId === exercise.id}
            isActive={playingExerciseId === exercise.id}
            onPlay={() => onPlayExercise(exercise)}
            onStop={onStopExercise}
            onSelect={() => onSelectExercise(exercise)}
          />
        ))}
      </div>
    </div>
  );
}
