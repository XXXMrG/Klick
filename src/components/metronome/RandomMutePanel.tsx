'use client';

import { RandomMuteConfig } from '@/types/metronome';
import { Dices } from 'lucide-react';
import { useI18n } from '@/i18n';

interface RandomMutePanelProps {
  config: RandomMuteConfig;
  onChange: (config: RandomMuteConfig) => void;
}

const CHANCE_PRESETS = [
  { value: 0.2, key: 'low' as const },
  { value: 0.35, key: 'medium' as const },
  { value: 0.5, key: 'high' as const },
  { value: 0.7, key: 'veryHigh' as const },
];

export default function RandomMutePanel({ config, onChange }: RandomMutePanelProps) {
  const { t } = useI18n();

  const toggleEnabled = () => {
    onChange({ ...config, enabled: !config.enabled });
  };

  return (
    <div
      className="rounded-lg p-4"
      style={{
        backgroundColor: 'var(--bg-surface)',
        border: `1px solid ${config.enabled ? 'var(--border-accent)' : 'var(--border-subtle)'}`,
      }}
    >
      <button
        onClick={toggleEnabled}
        className="flex items-center gap-2 w-full mb-3"
      >
        <Dices
          size={16}
          style={{ color: config.enabled ? 'var(--accent-primary)' : 'var(--text-muted)' }}
        />
        <span
          className="text-xs uppercase tracking-wider"
          style={{
            fontFamily: 'var(--font-mono), monospace',
            color: config.enabled ? 'var(--accent-primary)' : 'var(--text-muted)',
          }}
        >
          {t.randomMute.label}
        </span>
        <div
          className="ml-auto w-8 h-4 rounded-full relative transition-colors"
          style={{
            backgroundColor: config.enabled ? 'var(--accent-primary)' : 'var(--bg-control)',
          }}
        >
          <div
            className="absolute top-0.5 w-3 h-3 rounded-full bg-white transition-transform"
            style={{
              transform: config.enabled ? 'translateX(16px)' : 'translateX(2px)',
            }}
          />
        </div>
      </button>

      {config.enabled && (
        <div className="flex flex-col gap-3">
          <p
            className="text-[11px] leading-relaxed"
            style={{
              fontFamily: 'var(--font-mono), monospace',
              color: 'var(--text-muted)',
            }}
          >
            {t.randomMute.desc}
          </p>
          <div className="flex gap-1 flex-wrap">
            {CHANCE_PRESETS.map(({ value, key }) => (
              <button
                key={value}
                onClick={() => onChange({ ...config, chance: value })}
                className="px-3 py-1.5 rounded text-xs transition-all min-h-[32px]"
                style={{
                  fontFamily: 'var(--font-mono), monospace',
                  backgroundColor:
                    config.chance === value ? 'var(--accent-dim)' : 'var(--bg-control)',
                  border: `1px solid ${
                    config.chance === value
                      ? 'var(--border-accent)'
                      : 'var(--border-subtle)'
                  }`,
                  color:
                    config.chance === value
                      ? 'var(--accent-primary)'
                      : 'var(--text-secondary)',
                }}
              >
                {t.randomMute[key]}
              </button>
            ))}
          </div>

          {/* Current chance display */}
          <div
            className="text-center text-lg"
            style={{
              fontFamily: 'var(--font-display), Bebas Neue, sans-serif',
              color: 'var(--text-primary)',
            }}
          >
            {Math.round(config.chance * 100)}%
          </div>
        </div>
      )}
    </div>
  );
}
