'use client';

interface PulseBarProps {
  isPlaying: boolean;
  flashBeat: number | null;
  currentBeat: number;
  isDownbeat: boolean;
}

export default function PulseBar({ isPlaying, flashBeat, isDownbeat }: PulseBarProps) {
  const isActive = isPlaying && flashBeat !== null;

  return (
    <div
      className="pulse-bar w-full h-1 relative overflow-hidden"
      style={{ backgroundColor: 'var(--bg-surface)' }}
    >
      <div
        className="absolute inset-0 origin-left"
        style={{
          backgroundColor: isDownbeat ? 'var(--beat-downbeat)' : 'var(--accent-primary)',
          animation: isActive ? 'pulse-bar-sweep 0.3s ease-out forwards' : 'none',
          opacity: isActive ? 1 : 0,
        }}
      />
    </div>
  );
}
