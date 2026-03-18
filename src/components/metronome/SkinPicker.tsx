'use client';

import { skins } from '@/lib/skins/registry';
import { Sun, Moon } from 'lucide-react';

interface SkinPickerProps {
  skinId: string;
  mode: 'dark' | 'light';
  onSkinChange: (id: string) => void;
  onToggleMode: () => void;
}

export default function SkinPicker({
  skinId,
  mode,
  onSkinChange,
  onToggleMode,
}: SkinPickerProps) {
  return (
    <div className="flex flex-col gap-3">
      {/* Mode toggle */}
      <div className="flex items-center justify-between">
        <label
          className="text-xs uppercase tracking-wider"
          style={{
            fontFamily: 'var(--font-mono), monospace',
            color: 'var(--text-muted)',
          }}
        >
          外观模式
        </label>
        <button
          onClick={onToggleMode}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded text-xs transition-colors"
          style={{
            fontFamily: 'var(--font-mono), monospace',
            backgroundColor: 'var(--bg-control)',
            border: '1px solid var(--border-subtle)',
            color: 'var(--text-secondary)',
          }}
        >
          {mode === 'light' ? <Moon size={12} /> : <Sun size={12} />}
          {mode === 'light' ? '暗色' : '亮色'}
        </button>
      </div>

      {/* Skin grid */}
      <div>
        <label
          className="text-xs uppercase tracking-wider block mb-2"
          style={{
            fontFamily: 'var(--font-mono), monospace',
            color: 'var(--text-muted)',
          }}
        >
          皮肤
        </label>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
          {skins.map((skin) => {
            const isActive = skin.id === skinId;
            const preview = mode === 'light' ? skin.light : skin.dark;
            return (
              <button
                key={skin.id}
                onClick={() => onSkinChange(skin.id)}
                className="flex flex-col items-center gap-1.5 p-3 rounded-lg transition-all"
                style={{
                  backgroundColor: isActive
                    ? 'var(--accent-dim)'
                    : 'var(--bg-control)',
                  border: `1px solid ${
                    isActive ? 'var(--border-accent)' : 'var(--border-subtle)'
                  }`,
                }}
              >
                {/* Color preview dots */}
                <div className="flex gap-1">
                  <span
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: preview['--accent-primary'] }}
                  />
                  <span
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: preview['--beat-downbeat'] }}
                  />
                  <span
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: preview['--accent-secondary'] }}
                  />
                </div>
                {/* Label */}
                <span
                  className="text-xs"
                  style={{
                    fontFamily: 'var(--font-mono), monospace',
                    color: isActive
                      ? 'var(--accent-primary)'
                      : 'var(--text-secondary)',
                  }}
                >
                  {skin.emoji} {skin.name}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
