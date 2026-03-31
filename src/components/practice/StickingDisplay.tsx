'use client';

import { Exercise } from '@/lib/practice/types';

interface StickingDisplayProps {
  exercise: Exercise;
  currentNoteIndex: number;
  isPlaying: boolean;
}

export default function StickingDisplay({ exercise, currentNoteIndex, isPlaying }: StickingDisplayProps) {
  return (
    <div className="flex flex-wrap gap-1 items-center justify-center">
      {exercise.pattern.map((note, i) => {
        const isActive = isPlaying && currentNoteIndex === i;
        const isR = note.hand === 'R';
        const isSpecial = note.type !== 'normal';

        return (
          <div
            key={i}
            className="flex flex-col items-center transition-all duration-75"
            style={{
              transform: isActive ? 'scale(1.25)' : 'scale(1)',
            }}
          >
            <span
              className="text-sm font-bold w-7 h-7 flex items-center justify-center rounded-md transition-colors"
              style={{
                fontFamily: 'var(--font-mono), monospace',
                backgroundColor: isActive
                  ? 'var(--accent-primary)'
                  : isR ? 'var(--bg-control)' : 'var(--bg-elevated)',
                color: isActive
                  ? '#fff'
                  : isR ? 'var(--accent-primary)' : 'var(--text-secondary)',
                border: isSpecial ? '1px solid var(--border-accent)' : '1px solid transparent',
              }}
            >
              {note.hand}
            </span>
            {isSpecial && (
              <span
                className="text-[8px] mt-0.5"
                style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono), monospace' }}
              >
                {note.type === 'flam' ? 'f' : note.type === 'drag' ? 'd' : note.type === 'buzz' ? 'z' : note.type === 'accent' ? '>' : note.type === 'ghost' ? 'o' : ''}
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
}
