'use client';

import { useState, useRef, useEffect } from 'react';
import { getTempoMarking } from '@/lib/tempo';

interface BpmDisplayProps {
  bpm: number;
  flashBeat: number | null;
  isPlaying: boolean;
  onBpmChange: (bpm: number) => void;
}

export default function BpmDisplay({ bpm, flashBeat, isPlaying, onBpmChange }: BpmDisplayProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const tempoMarking = getTempoMarking(bpm);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleClick = () => {
    setEditValue(String(bpm));
    setIsEditing(true);
  };

  const handleSubmit = () => {
    const val = parseInt(editValue, 10);
    if (!isNaN(val) && val >= 1 && val <= 300) {
      onBpmChange(val);
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmit();
    } else if (e.key === 'Escape') {
      setIsEditing(false);
    }
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -1 : 1;
    onBpmChange(bpm + delta);
  };

  const isFlashing = flashBeat !== null && isPlaying;

  return (
    <div className="flex flex-col items-center select-none" onWheel={handleWheel}>
      {isEditing ? (
        <input
          ref={inputRef}
          type="number"
          min="1"
          max="300"
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          onBlur={handleSubmit}
          onKeyDown={handleKeyDown}
          className="text-center bg-transparent border-b-2 outline-none text-[120px] sm:text-[150px] lg:text-[180px] leading-none"
          style={{
            fontFamily: 'var(--font-display), Bebas Neue, sans-serif',
            color: 'var(--text-primary)',
            borderColor: 'var(--accent-primary)',
            width: '4ch',
          }}
        />
      ) : (
        <div
          onClick={handleClick}
          className="cursor-pointer text-[72px] sm:text-[120px] lg:text-[180px] leading-none tracking-tight transition-all"
          style={{
            fontFamily: 'var(--font-display), Bebas Neue, sans-serif',
            color: 'var(--text-primary)',
            animation: isFlashing ? 'number-glow 0.4s ease-out' : 'none',
          }}
        >
          {bpm}
        </div>
      )}

      <div className="flex items-center gap-3 mt-1">
        <span
          className="text-xs sm:text-sm tracking-widest uppercase"
          style={{
            fontFamily: 'var(--font-mono), JetBrains Mono, monospace',
            color: 'var(--text-secondary)',
          }}
        >
          BPM
        </span>
        <span
          className="text-xs sm:text-sm"
          style={{
            fontFamily: 'var(--font-mono), JetBrains Mono, monospace',
            color: 'var(--accent-primary)',
          }}
        >
          {tempoMarking}
        </span>
      </div>
    </div>
  );
}
