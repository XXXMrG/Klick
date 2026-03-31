'use client';

import { useState, useMemo } from 'react';
import { Exercise, BookId, ExerciseCategory } from '@/lib/practice/types';
import { getAllExercises } from '@/lib/practice/recommend';
import { useI18n } from '@/i18n';
import { Search } from 'lucide-react';
import CategorySidebar from './CategorySidebar';
import ExerciseCard from './ExerciseCard';

interface ExerciseBrowserProps {
  completedToday: Set<string>;
  getMaxBpm: (id: string) => number;
  playingExerciseId: string | null;
  isPlaying: boolean;
  onPlayExercise: (exercise: Exercise) => void;
  onStopExercise: () => void;
  onSelectExercise: (exercise: Exercise) => void;
}

export default function ExerciseBrowser({
  completedToday,
  getMaxBpm,
  playingExerciseId,
  isPlaying,
  onPlayExercise,
  onStopExercise,
  onSelectExercise,
}: ExerciseBrowserProps) {
  const { t, locale } = useI18n();
  const [activeBook, setActiveBook] = useState<BookId | 'all'>('all');
  const [activeCategory, setActiveCategory] = useState<ExerciseCategory | 'all'>('all');
  const [search, setSearch] = useState('');

  const allExercises = useMemo(() => getAllExercises(), []);

  const filtered = useMemo(() => {
    return allExercises.filter(ex => {
      if (activeBook !== 'all' && ex.book !== activeBook) return false;
      if (activeCategory !== 'all' && ex.category !== activeCategory) return false;
      if (search) {
        const q = search.toLowerCase();
        const name = locale === 'zh' ? ex.nameZh : locale === 'ja' ? ex.nameJa : ex.name;
        return (
          name.toLowerCase().includes(q) ||
          ex.sticking.toLowerCase().includes(q) ||
          ex.id.includes(q) ||
          `#${ex.number}`.includes(q)
        );
      }
      return true;
    });
  }, [allExercises, activeBook, activeCategory, search, locale]);

  return (
    <div>
      <h2
        className="text-sm font-bold uppercase tracking-wider mb-3"
        style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-mono), monospace' }}
      >
        {t.practice.library}
      </h2>

      {/* Search */}
      <div className="relative mb-3">
        <Search
          size={14}
          className="absolute left-3 top-1/2 -translate-y-1/2"
          style={{ color: 'var(--text-muted)' }}
        />
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder={t.practice.searchPlaceholder}
          className="w-full pl-8 pr-3 py-2 rounded-lg text-sm outline-none"
          style={{
            backgroundColor: 'var(--bg-control)',
            color: 'var(--text-primary)',
            border: '1px solid var(--border-subtle)',
            fontFamily: 'var(--font-mono), monospace',
          }}
        />
      </div>

      {/* Filters */}
      <div className="mb-4">
        <CategorySidebar
          activeBook={activeBook}
          activeCategory={activeCategory}
          onBookChange={setActiveBook}
          onCategoryChange={setActiveCategory}
        />
      </div>

      {/* Results count */}
      <div
        className="text-xs mb-2"
        style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono), monospace' }}
      >
        {filtered.length} {t.practice.exercises}
      </div>

      {/* Exercise list */}
      <div className="flex flex-col gap-2">
        {filtered.map(exercise => (
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
