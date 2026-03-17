'use client';

import { Play, Square, Minus, Plus } from 'lucide-react';

interface TransportBarProps {
  isPlaying: boolean;
  bpm: number;
  onToggle: () => void;
  onBpmChange: (bpm: number) => void;
}

export default function TransportBar({ isPlaying, bpm, onToggle, onBpmChange }: TransportBarProps) {
  return (
    <div className="flex items-center justify-center gap-4">
      {/* Minus button */}
      <button
        onClick={() => onBpmChange(bpm - 1)}
        className="w-11 h-11 sm:w-12 sm:h-12 flex items-center justify-center rounded transition-all active:scale-95"
        style={{
          backgroundColor: 'var(--bg-control)',
          border: '1px solid var(--border-subtle)',
          color: 'var(--text-secondary)',
        }}
      >
        <Minus size={18} />
      </button>

      {/* Play/Stop button */}
      <button
        onClick={onToggle}
        className="w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center rounded-lg transition-all active:scale-95"
        style={{
          backgroundColor: isPlaying ? 'var(--accent-primary)' : 'var(--bg-control)',
          border: `2px solid ${isPlaying ? 'var(--accent-primary)' : 'var(--border-accent)'}`,
          color: isPlaying ? '#fff' : 'var(--accent-primary)',
          boxShadow: isPlaying ? '0 0 20px rgba(255, 107, 43, 0.3)' : 'none',
        }}
      >
        {isPlaying ? <Square size={28} fill="white" /> : <Play size={28} fill="currentColor" />}
      </button>

      {/* Plus button */}
      <button
        onClick={() => onBpmChange(bpm + 1)}
        className="w-11 h-11 sm:w-12 sm:h-12 flex items-center justify-center rounded transition-all active:scale-95"
        style={{
          backgroundColor: 'var(--bg-control)',
          border: '1px solid var(--border-subtle)',
          color: 'var(--text-secondary)',
        }}
      >
        <Plus size={18} />
      </button>
    </div>
  );
}
