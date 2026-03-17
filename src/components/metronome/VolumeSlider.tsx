'use client';

import { Volume2, VolumeX } from 'lucide-react';

interface VolumeSliderProps {
  volume: number;
  onChange: (volume: number) => void;
}

export default function VolumeSlider({ volume, onChange }: VolumeSliderProps) {
  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => onChange(volume === 0 ? 1 : 0)}
        className="p-1"
        style={{ color: volume === 0 ? 'var(--text-muted)' : 'var(--text-secondary)' }}
      >
        {volume === 0 ? <VolumeX size={16} /> : <Volume2 size={16} />}
      </button>
      <input
        type="range"
        min="0"
        max="1"
        step="0.05"
        value={volume}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="flex-1 h-1 rounded-full appearance-none cursor-pointer"
        style={{
          background: `linear-gradient(to right, var(--accent-primary) 0%, var(--accent-primary) ${
            volume * 100
          }%, var(--bg-control) ${volume * 100}%, var(--bg-control) 100%)`,
          accentColor: 'var(--accent-primary)',
        }}
      />
      <span
        className="text-[10px] w-8 text-right"
        style={{
          fontFamily: 'var(--font-mono), monospace',
          color: 'var(--text-muted)',
        }}
      >
        {Math.round(volume * 100)}%
      </span>
    </div>
  );
}
