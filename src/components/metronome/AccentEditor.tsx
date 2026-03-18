'use client';

import { AccentLevel } from '@/types/metronome';
import { useI18n } from '@/i18n';

interface AccentEditorProps {
  accents: AccentLevel[];
  onToggleAccent: (index: number) => void;
}

const ACCENT_COLORS: Record<AccentLevel, string> = {
  0: 'var(--text-muted)',
  1: 'var(--text-secondary)',
  2: 'var(--text-primary)',
  3: 'var(--accent-primary)',
};

export default function AccentEditor({ accents, onToggleAccent }: AccentEditorProps) {
  const { t } = useI18n();

  const accentLabels: Record<AccentLevel, string> = {
    0: t.accent.mute,
    1: t.accent.ghost,
    2: t.accent.normal,
    3: t.accent.accent,
  };

  return (
    <div className="flex flex-col gap-2">
      <label
        className="text-xs uppercase tracking-wider"
        style={{
          fontFamily: 'var(--font-mono), monospace',
          color: 'var(--text-muted)',
        }}
      >
        {t.accent.label}
      </label>
      <div className="flex gap-2 flex-wrap">
        {accents.map((accent, i) => (
          <button
            key={i}
            onClick={() => onToggleAccent(i)}
            className="flex flex-col items-center gap-1 min-w-[36px]"
          >
            {/* Accent level bars */}
            <div className="flex gap-0.5">
              {[1, 2, 3].map((level) => (
                <div
                  key={level}
                  className="w-1.5 rounded-sm transition-colors"
                  style={{
                    height: `${level * 6}px`,
                    backgroundColor:
                      accent >= level ? ACCENT_COLORS[accent] : 'var(--bg-control)',
                  }}
                />
              ))}
            </div>
            <span
              className="text-[10px]"
              style={{
                fontFamily: 'var(--font-mono), monospace',
                color: ACCENT_COLORS[accent],
              }}
            >
              {accentLabels[accent]}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
