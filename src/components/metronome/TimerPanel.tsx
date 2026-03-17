'use client';

import { TimerConfig } from '@/types/metronome';
import { Timer } from 'lucide-react';

interface TimerPanelProps {
  config: TimerConfig;
  onChange: (config: TimerConfig) => void;
}

const DURATION_PRESETS = [5, 10, 15, 20, 30, 60];

export default function TimerPanel({ config, onChange }: TimerPanelProps) {
  const toggleEnabled = () => {
    onChange({
      ...config,
      enabled: !config.enabled,
      remainingSeconds: config.durationMinutes * 60,
    });
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
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
        <Timer
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
          计时器
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
          <div className="flex gap-1 flex-wrap">
            {DURATION_PRESETS.map((d) => (
              <button
                key={d}
                onClick={() =>
                  onChange({ ...config, durationMinutes: d, remainingSeconds: d * 60 })
                }
                className="px-3 py-1.5 rounded text-xs transition-all min-h-[32px]"
                style={{
                  fontFamily: 'var(--font-mono), monospace',
                  backgroundColor:
                    config.durationMinutes === d ? 'var(--accent-dim)' : 'var(--bg-control)',
                  border: `1px solid ${
                    config.durationMinutes === d
                      ? 'var(--border-accent)'
                      : 'var(--border-subtle)'
                  }`,
                  color:
                    config.durationMinutes === d
                      ? 'var(--accent-primary)'
                      : 'var(--text-secondary)',
                }}
              >
                {d}分钟
              </button>
            ))}
          </div>

          <div
            className="text-center text-2xl"
            style={{
              fontFamily: 'var(--font-display), Bebas Neue, sans-serif',
              color:
                config.remainingSeconds < 60
                  ? 'var(--error)'
                  : 'var(--text-primary)',
            }}
          >
            {formatTime(config.remainingSeconds)}
          </div>
        </div>
      )}
    </div>
  );
}
