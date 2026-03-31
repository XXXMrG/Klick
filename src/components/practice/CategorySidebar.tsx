'use client';

import { useI18n } from '@/i18n';
import { BookId, ExerciseCategory } from '@/lib/practice/types';

interface CategorySidebarProps {
  activeBook: BookId | 'all';
  activeCategory: ExerciseCategory | 'all';
  onBookChange: (book: BookId | 'all') => void;
  onCategoryChange: (category: ExerciseCategory | 'all') => void;
}

const CATEGORIES: { id: ExerciseCategory | 'all'; icon: string }[] = [
  { id: 'all', icon: '*' },
  { id: 'rolls', icon: '~' },
  { id: 'single-beat', icon: '|' },
  { id: 'paradiddles', icon: 'P' },
  { id: 'flams', icon: 'f' },
  { id: 'drags', icon: 'd' },
];

export default function CategorySidebar({
  activeBook,
  activeCategory,
  onBookChange,
  onCategoryChange,
}: CategorySidebarProps) {
  const { t } = useI18n();

  const books: { id: BookId | 'all'; label: string }[] = [
    { id: 'all', label: t.practice.allBooks },
    { id: 'pas-40', label: 'PAS 40' },
    { id: 'stick-control', label: 'Stick Control' },
  ];

  const categoryLabels: Record<string, string> = {
    all: t.practice.allCategories,
    rolls: t.practice.catRolls,
    'single-beat': t.practice.catSingleBeat,
    paradiddles: t.practice.catParadiddles,
    flams: t.practice.catFlams,
    drags: t.practice.catDrags,
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Book filter */}
      <div>
        <div
          className="text-xs uppercase tracking-wider mb-2"
          style={{ fontFamily: 'var(--font-mono), monospace', color: 'var(--text-muted)' }}
        >
          {t.practice.book}
        </div>
        <div className="flex flex-wrap gap-1">
          {books.map(book => (
            <button
              key={book.id}
              onClick={() => onBookChange(book.id)}
              className="px-2.5 py-1 rounded text-xs transition-colors"
              style={{
                backgroundColor: activeBook === book.id ? 'var(--accent-primary)' : 'var(--bg-control)',
                color: activeBook === book.id ? '#fff' : 'var(--text-secondary)',
                fontFamily: 'var(--font-mono), monospace',
              }}
            >
              {book.label}
            </button>
          ))}
        </div>
      </div>

      {/* Category filter */}
      <div>
        <div
          className="text-xs uppercase tracking-wider mb-2"
          style={{ fontFamily: 'var(--font-mono), monospace', color: 'var(--text-muted)' }}
        >
          {t.practice.category}
        </div>
        <div className="flex flex-wrap gap-1">
          {CATEGORIES.map(cat => (
            <button
              key={cat.id}
              onClick={() => onCategoryChange(cat.id)}
              className="px-2.5 py-1 rounded text-xs transition-colors"
              style={{
                backgroundColor: activeCategory === cat.id ? 'var(--accent-primary)' : 'var(--bg-control)',
                color: activeCategory === cat.id ? '#fff' : 'var(--text-secondary)',
                fontFamily: 'var(--font-mono), monospace',
              }}
            >
              {categoryLabels[cat.id]}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
