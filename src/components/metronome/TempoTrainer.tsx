'use client';

import { TempoTrainerConfig } from '@/types/metronome';
import { TrendingUp } from 'lucide-react';

interface TempoTrainerProps {
  config: TempoTrainerConfig;
  currentBpm: number;
  onChange: (config: TempoTrainerConfig) => void;
}

export default function TempoTrainer({ config, currentBpm, onChange }: TempoTrainerProps) {
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
        <TrendingUp
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
          速度训练
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
          <div className="flex gap-3">
            <div className="flex-1">
              <label
                className="text-[10px] uppercase tracking-wider block mb-1"
                style={{
                  fontFamily: 'var(--font-mono), monospace',
                  color: 'var(--text-muted)',
                }}
              >
                起始 BPM
              </label>
              <input
                type="number"
                min="1"
                max="300"
                value={config.startBpm}
                onChange={(e) =>
                  onChange({ ...config, startBpm: parseInt(e.target.value) || 80 })
                }
                className="w-full px-2 py-1.5 rounded text-sm bg-transparent outline-none"
                style={{
                  fontFamily: 'var(--font-mono), monospace',
                  color: 'var(--text-primary)',
                  border: '1px solid var(--border-subtle)',
                }}
              />
            </div>
            <div className="flex-1">
              <label
                className="text-[10px] uppercase tracking-wider block mb-1"
                style={{
                  fontFamily: 'var(--font-mono), monospace',
                  color: 'var(--text-muted)',
                }}
              >
                目标 BPM
              </label>
              <input
                type="number"
                min="1"
                max="300"
                value={config.targetBpm}
                onChange={(e) =>
                  onChange({ ...config, targetBpm: parseInt(e.target.value) || 140 })
                }
                className="w-full px-2 py-1.5 rounded text-sm bg-transparent outline-none"
                style={{
                  fontFamily: 'var(--font-mono), monospace',
                  color: 'var(--text-primary)',
                  border: '1px solid var(--border-subtle)',
                }}
              />
            </div>
          </div>
          <div className="flex gap-3">
            <div className="flex-1">
              <label
                className="text-[10px] uppercase tracking-wider block mb-1"
                style={{
                  fontFamily: 'var(--font-mono), monospace',
                  color: 'var(--text-muted)',
                }}
              >
                每次增减 BPM
              </label>
              <input
                type="number"
                min="1"
                max="50"
                value={config.incrementBpm}
                onChange={(e) =>
                  onChange({ ...config, incrementBpm: parseInt(e.target.value) || 5 })
                }
                className="w-full px-2 py-1.5 rounded text-sm bg-transparent outline-none"
                style={{
                  fontFamily: 'var(--font-mono), monospace',
                  color: 'var(--text-primary)',
                  border: '1px solid var(--border-subtle)',
                }}
              />
            </div>
            <div className="flex-1">
              <label
                className="text-[10px] uppercase tracking-wider block mb-1"
                style={{
                  fontFamily: 'var(--font-mono), monospace',
                  color: 'var(--text-muted)',
                }}
              >
                每 N 小节
              </label>
              <input
                type="number"
                min="1"
                max="32"
                value={config.everyNBars}
                onChange={(e) =>
                  onChange({ ...config, everyNBars: parseInt(e.target.value) || 4 })
                }
                className="w-full px-2 py-1.5 rounded text-sm bg-transparent outline-none"
                style={{
                  fontFamily: 'var(--font-mono), monospace',
                  color: 'var(--text-primary)',
                  border: '1px solid var(--border-subtle)',
                }}
              />
            </div>
          </div>

          {/* Progress indicator */}
          <div className="flex items-center gap-2">
            <span
              className="text-[10px]"
              style={{
                fontFamily: 'var(--font-mono), monospace',
                color: 'var(--text-muted)',
              }}
            >
              {config.startBpm}
            </span>
            <div className="flex-1 h-1 rounded-full" style={{ backgroundColor: 'var(--bg-control)' }}>
              <div
                className="h-full rounded-full transition-all"
                style={{
                  backgroundColor: 'var(--accent-primary)',
                  width: `${
                    ((currentBpm - config.startBpm) /
                      (config.targetBpm - config.startBpm)) *
                    100
                  }%`,
                }}
              />
            </div>
            <span
              className="text-[10px]"
              style={{
                fontFamily: 'var(--font-mono), monospace',
                color: 'var(--text-muted)',
              }}
            >
              {config.targetBpm}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
