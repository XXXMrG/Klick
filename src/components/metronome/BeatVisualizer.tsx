'use client';

import { AccentLevel } from '@/types/metronome';

interface BeatVisualizerProps {
  beatsPerBar: number;
  currentBeat: number;
  accents: AccentLevel[];
  isPlaying: boolean;
  visualMute?: boolean;
  onToggleAccent: (index: number) => void;
}

export default function BeatVisualizer({
  beatsPerBar,
  currentBeat,
  accents,
  isPlaying,
  visualMute = false,
  onToggleAccent,
}: BeatVisualizerProps) {
  return (
    <div className="flex items-center justify-center gap-3 sm:gap-4 flex-wrap" style={{ minHeight: 48 }}>
      {Array.from({ length: beatsPerBar }, (_, i) => {
        const isActive = isPlaying && currentBeat === i;
        const isDownbeat = i === 0;
        const accent = accents[i] ?? 2;

        let bgColor = 'var(--bg-control)';
        if (isActive) {
          bgColor = isDownbeat ? 'var(--beat-downbeat)' : 'var(--beat-flash)';
        } else if (accent === 0) {
          bgColor = 'transparent';
        }

        let borderStyle = '2px solid transparent';
        if (accent === 3 && !isActive) {
          borderStyle = '2px solid var(--accent-primary)';
        } else if (accent === 1) {
          borderStyle = '1px dashed var(--text-muted)';
        } else if (accent === 0) {
          borderStyle = '1px dashed var(--text-muted)';
        }

        // transform scale for active state - does NOT cause layout shift
        const scale = isActive && !visualMute ? (isDownbeat ? 1.45 : 1.25) : 1;

        return (
          <button
            key={i}
            onClick={() => onToggleAccent(i)}
            className="beat-dot w-8 h-8 sm:w-10 sm:h-10 rounded-full relative flex items-center justify-center flex-shrink-0"
            style={{
              backgroundColor: bgColor,
              border: borderStyle,
              minWidth: 32,
              minHeight: 32,
              transform: `scale(${scale})`,
              transition: 'transform 0.08s ease-out, background-color 0.08s ease-out',
              boxShadow: isActive && !visualMute
                ? isDownbeat
                  ? '0 0 16px var(--beat-downbeat)'
                  : '0 0 10px var(--beat-flash)'
                : 'none',
            }}
            title={`第 ${i + 1} 拍`}
          >
            <span
              className="text-[10px] sm:text-xs font-bold select-none"
              style={{
                fontFamily: 'var(--font-mono), monospace',
                color: isActive ? '#fff' : accent === 0 ? 'var(--text-muted)' : 'var(--text-secondary)',
              }}
            >
              {i + 1}
            </span>
          </button>
        );
      })}
    </div>
  );
}
