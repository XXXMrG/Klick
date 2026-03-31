'use client';

import { useMetronome } from '@/hooks/useMetronome';
import { useI18n } from '@/i18n';
import { Play, Square, Minus, Plus } from 'lucide-react';

export default function MiniMetronome() {
  const metronome = useMetronome();
  const { state } = metronome;
  const { t } = useI18n();

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-50"
      style={{
        backgroundColor: 'var(--bg-surface)',
        borderTop: '2px solid var(--border-subtle)',
        boxShadow: '0 -4px 12px rgba(0,0,0,0.1)',
      }}
    >
      <div className="max-w-4xl mx-auto flex items-center gap-3 px-4 py-2">
        {/* Play/Stop */}
        <button
          onClick={metronome.toggle}
          className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 transition-colors"
          style={{
            backgroundColor: state.isPlaying ? 'var(--error)' : 'var(--accent-primary)',
            color: '#fff',
          }}
        >
          {state.isPlaying ? <Square size={16} /> : <Play size={16} className="ml-0.5" />}
        </button>

        {/* BPM control */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            onClick={() => metronome.setBpm(Math.max(1, state.bpm - 1))}
            className="w-6 h-6 rounded flex items-center justify-center"
            style={{ backgroundColor: 'var(--bg-control)', color: 'var(--text-secondary)' }}
          >
            <Minus size={12} />
          </button>
          <span
            className="text-lg font-bold tabular-nums w-10 text-center"
            style={{ fontFamily: 'var(--font-display), sans-serif', color: 'var(--text-primary)' }}
          >
            {state.bpm}
          </span>
          <button
            onClick={() => metronome.setBpm(Math.min(300, state.bpm + 1))}
            className="w-6 h-6 rounded flex items-center justify-center"
            style={{ backgroundColor: 'var(--bg-control)', color: 'var(--text-secondary)' }}
          >
            <Plus size={12} />
          </button>
        </div>

        {/* BPM slider */}
        <input
          type="range"
          min="1"
          max="300"
          value={state.bpm}
          onChange={(e) => metronome.setBpm(parseInt(e.target.value))}
          className="flex-1 h-1.5 rounded-full appearance-none cursor-pointer"
          style={{
            background: `linear-gradient(to right, var(--accent-primary) 0%, var(--accent-primary) ${
              ((state.bpm - 1) / 299) * 100
            }%, var(--bg-control) ${((state.bpm - 1) / 299) * 100}%, var(--bg-control) 100%)`,
            accentColor: 'var(--accent-primary)',
          }}
        />

        {/* Beat dots */}
        <div className="hidden sm:flex items-center gap-1 flex-shrink-0">
          {Array.from({ length: state.beatsPerBar }).map((_, i) => (
            <div
              key={i}
              className="rounded-full"
              style={{
                width: 8,
                height: 8,
                backgroundColor: state.isPlaying && state.currentBeat === i
                  ? (i === 0 ? 'var(--beat-downbeat)' : 'var(--accent-primary)')
                  : 'var(--bg-control)',
                transition: 'background-color 0.08s',
              }}
            />
          ))}
        </div>

        {/* Label */}
        <span
          className="text-[10px] flex-shrink-0 hidden sm:block"
          style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono), monospace' }}
        >
          {t.bpm.label}
        </span>
      </div>
    </div>
  );
}
