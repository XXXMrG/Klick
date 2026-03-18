'use client';

import { useState, useRef, useEffect } from 'react';
import { getTempoMarking } from '@/lib/tempo';

interface BpmDisplayProps {
  bpm: number;
  flashBeat: number | null;
  isPlaying: boolean;
  onBpmChange: (bpm: number) => void;
  skinId?: string;
}

/* ── Pixel skin: Nintendo question-block + coin decoration ── */
function PixelDecoration({ isPlaying, isFlashing }: { isPlaying: boolean; isFlashing: boolean }) {
  return (
    <div className="relative flex flex-col items-center mb-2" style={{ minHeight: 56 }}>
      {/* Coin that pops out on beat */}
      {isFlashing && (
        <div
          className="absolute pointer-events-none"
          style={{
            top: -4,
            animation: 'coin-pop 0.5s ease-out forwards',
          }}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" style={{ imageRendering: 'pixelated' }}>
            <rect x="4" y="0" width="8" height="16" fill="var(--accent-primary)" />
            <rect x="2" y="2" width="2" height="12" fill="var(--accent-primary)" />
            <rect x="12" y="2" width="2" height="12" fill="var(--accent-primary)" />
            {/* Coin shine */}
            <rect x="6" y="2" width="2" height="2" fill="#fff" opacity="0.6" />
            <rect x="6" y="6" width="4" height="8" fill="var(--accent-secondary)" opacity="0.4" />
          </svg>
        </div>
      )}

      {/* Question block — bumps on beat */}
      <div
        style={{
          animation: isFlashing ? 'block-bump 0.4s ease-out' : 'none',
        }}
      >
        <svg
          width="40"
          height="40"
          viewBox="0 0 40 40"
          fill="none"
          style={{ imageRendering: 'pixelated' }}
        >
          {/* Block body — warm brick brown */}
          <rect x="2" y="2" width="36" height="36" fill="var(--accent-primary)" />
          {/* Block border */}
          <rect x="0" y="0" width="40" height="2" fill="var(--accent-secondary)" />
          <rect x="0" y="38" width="40" height="2" fill="var(--accent-secondary)" />
          <rect x="0" y="0" width="2" height="40" fill="var(--accent-secondary)" />
          <rect x="38" y="0" width="2" height="40" fill="var(--accent-secondary)" />
          {/* Inner highlight — top-left light */}
          <rect x="4" y="4" width="32" height="2" fill="#fff" opacity="0.3" />
          <rect x="4" y="4" width="2" height="32" fill="#fff" opacity="0.2" />
          {/* Inner shadow — bottom-right */}
          <rect x="4" y="34" width="32" height="2" fill="#000" opacity="0.2" />
          <rect x="34" y="4" width="2" height="32" fill="#000" opacity="0.15" />
          {/* Question mark — pixel style */}
          <rect x="14" y="10" width="12" height="2" fill="var(--bg-primary)" />
          <rect x="12" y="10" width="2" height="4" fill="var(--bg-primary)" />
          <rect x="26" y="10" width="2" height="8" fill="var(--bg-primary)" />
          <rect x="22" y="16" width="4" height="2" fill="var(--bg-primary)" />
          <rect x="18" y="18" width="4" height="4" fill="var(--bg-primary)" />
          <rect x="18" y="24" width="4" height="4" fill="var(--bg-primary)" />
        </svg>
      </div>

      {/* Sparkle stars floating around the block */}
      <div className="absolute inset-0 pointer-events-none" style={{ width: 80, left: 'calc(50% - 40px)' }}>
        <svg
          className="absolute"
          style={{
            left: -8, top: 4,
            animation: 'pixel-sparkle 1.8s ease-in-out infinite',
          }}
          width="8" height="8" viewBox="0 0 8 8"
        >
          <rect x="3" y="0" width="2" height="2" fill="var(--accent-primary)" />
          <rect x="0" y="3" width="2" height="2" fill="var(--accent-primary)" />
          <rect x="6" y="3" width="2" height="2" fill="var(--accent-primary)" />
          <rect x="3" y="6" width="2" height="2" fill="var(--accent-primary)" />
        </svg>
        <svg
          className="absolute"
          style={{
            right: -8, top: 12,
            animation: 'pixel-sparkle 2.2s ease-in-out infinite',
            animationDelay: '0.6s',
          }}
          width="6" height="6" viewBox="0 0 6 6"
        >
          <rect x="2" y="0" width="2" height="2" fill="var(--accent-secondary)" />
          <rect x="0" y="2" width="2" height="2" fill="var(--accent-secondary)" />
          <rect x="4" y="2" width="2" height="2" fill="var(--accent-secondary)" />
          <rect x="2" y="4" width="2" height="2" fill="var(--accent-secondary)" />
        </svg>
        <svg
          className="absolute"
          style={{
            left: 2, top: -6,
            animation: 'pixel-sparkle 2.5s ease-in-out infinite',
            animationDelay: '1.2s',
          }}
          width="4" height="4" viewBox="0 0 4 4"
        >
          <rect x="1" y="0" width="2" height="1" fill="var(--accent-primary)" />
          <rect x="0" y="1" width="1" height="2" fill="var(--accent-primary)" />
          <rect x="3" y="1" width="1" height="2" fill="var(--accent-primary)" />
          <rect x="1" y="3" width="2" height="1" fill="var(--accent-primary)" />
        </svg>
      </div>

      {/* Playing indicator */}
      {isPlaying && (
        <div
          className="text-[7px] tracking-[0.2em] uppercase mt-1"
          style={{
            fontFamily: 'var(--font-mono), monospace',
            color: 'var(--accent-primary)',
            animation: 'pixel-float 2s ease-in-out infinite',
          }}
        >
          ♪ NOW PLAYING ♪
        </div>
      )}
    </div>
  );
}

/* ── Classical skin: ornate concert-hall decoration ── */
function ClassicalDecoration({ isFlashing }: { isFlashing: boolean }) {
  return (
    <div className="relative flex flex-col items-center mb-3">
      {/* Staff lines behind — like sheet music */}
      <div
        className="absolute w-full"
        style={{
          top: '50%',
          transform: 'translateY(-50%)',
          height: 28,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          opacity: 0.12,
          paddingLeft: 20,
          paddingRight: 20,
        }}
      >
        {[0, 1, 2, 3, 4].map((i) => (
          <div key={i} style={{ height: 1, backgroundColor: 'var(--accent-primary)' }} />
        ))}
      </div>

      {/* Main ornamental SVG — treble clef + scrollwork */}
      <svg
        width="200"
        height="48"
        viewBox="0 0 200 48"
        fill="none"
        className="relative"
      >
        {/* Left ornamental scroll */}
        <path
          d="M20 24 C24 16 32 12 40 16 C48 20 44 28 38 28 C32 28 30 24 32 20"
          stroke="var(--accent-primary)"
          strokeWidth="1.2"
          fill="none"
          opacity="0.5"
        />
        <path
          d="M40 16 Q52 10 64 18"
          stroke="var(--accent-primary)"
          strokeWidth="1"
          fill="none"
          opacity="0.35"
        />
        {/* Left fine line */}
        <line x1="8" y1="24" x2="28" y2="24" stroke="var(--accent-primary)" strokeWidth="0.5" opacity="0.25" />

        {/* Center treble clef — simplified elegant form */}
        <g transform="translate(88, 2)" opacity={isFlashing ? 0.9 : 0.6}>
          <path
            d="M12 40 C12 40 8 36 8 30 C8 22 14 16 14 10 C14 6 12 4 12 4
               C12 4 18 6 18 14 C18 20 12 24 12 30 C12 34 14 36 16 36
               C18 36 20 34 20 30 C20 26 16 24 14 26"
            stroke="var(--accent-primary)"
            strokeWidth="1.5"
            fill="none"
          />
          {/* Dot */}
          <circle cx="12" cy="42" r="1.5" fill="var(--accent-primary)" />
        </g>

        {/* Right ornamental scroll */}
        <path
          d="M180 24 C176 16 168 12 160 16 C152 20 156 28 162 28 C168 28 170 24 168 20"
          stroke="var(--accent-primary)"
          strokeWidth="1.2"
          fill="none"
          opacity="0.5"
        />
        <path
          d="M160 16 Q148 10 136 18"
          stroke="var(--accent-primary)"
          strokeWidth="1"
          fill="none"
          opacity="0.35"
        />
        {/* Right fine line */}
        <line x1="172" y1="24" x2="192" y2="24" stroke="var(--accent-primary)" strokeWidth="0.5" opacity="0.25" />

        {/* Gold shimmer line across — animated */}
        <rect
          x="30" y="23" width="140" height="1"
          fill="url(#goldGradient)"
          opacity="0.3"
        >
          <animate attributeName="opacity" values="0.1;0.4;0.1" dur="3s" repeatCount="indefinite" />
        </rect>

        <defs>
          <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="transparent" />
            <stop offset="30%" stopColor="var(--accent-primary)" />
            <stop offset="50%" stopColor="var(--accent-secondary)" />
            <stop offset="70%" stopColor="var(--accent-primary)" />
            <stop offset="100%" stopColor="transparent" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}

/* ── Classical: bottom decoration under BPM label ── */
function ClassicalBottomOrnament() {
  return (
    <svg width="80" height="8" viewBox="0 0 80 8" fill="none" className="mt-1">
      <line x1="0" y1="4" x2="30" y2="4" stroke="var(--accent-primary)" strokeWidth="0.5" opacity="0.3" />
      <circle cx="34" cy="4" r="1.5" fill="var(--accent-primary)" opacity="0.4" />
      <circle cx="40" cy="4" r="2" fill="var(--accent-primary)" opacity="0.5" />
      <circle cx="46" cy="4" r="1.5" fill="var(--accent-primary)" opacity="0.4" />
      <line x1="50" y1="4" x2="80" y2="4" stroke="var(--accent-primary)" strokeWidth="0.5" opacity="0.3" />
    </svg>
  );
}

/* ── Pixel: segmented power bar under BPM (Mario star-power style) ── */
function PixelHpBar({ bpm }: { bpm: number }) {
  const totalSegments = 10;
  const filledSegments = Math.round((Math.min(300, bpm) / 300) * totalSegments);

  return (
    <div className="flex items-center gap-2 mt-2">
      <span
        className="text-[7px] uppercase"
        style={{ fontFamily: 'var(--font-mono), monospace', color: 'var(--text-muted)' }}
      >
        SPD
      </span>
      <div className="flex gap-[2px]">
        {Array.from({ length: totalSegments }, (_, i) => {
          const isFilled = i < filledSegments;
          // Color shifts from green → yellow → red as speed increases
          let segColor = 'var(--accent-primary)';
          if (i >= 7) segColor = 'var(--beat-downbeat)';
          else if (i >= 4) segColor = 'var(--accent-secondary)';

          return (
            <div
              key={i}
              style={{
                width: 5,
                height: 8,
                backgroundColor: isFilled ? segColor : 'var(--bg-control)',
                border: '1px solid',
                borderColor: isFilled ? segColor : 'var(--text-muted)',
                opacity: isFilled ? 1 : 0.3,
                transition: 'background-color 0.1s steps(1)',
              }}
            />
          );
        })}
      </div>
    </div>
  );
}

export default function BpmDisplay({ bpm, flashBeat, isPlaying, onBpmChange, skinId }: BpmDisplayProps) {
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

  // Choose animation based on skin
  const glowAnimation = skinId === 'classical'
    ? (isFlashing ? 'classical-glow 0.5s ease-out' : 'none')
    : (isFlashing ? 'number-glow 0.4s ease-out' : 'none');

  return (
    <div className="flex flex-col items-center select-none" onWheel={handleWheel}>
      {/* Skin decorations */}
      {skinId === 'pixel' && (
        <PixelDecoration isPlaying={isPlaying} isFlashing={isFlashing} />
      )}
      {skinId === 'classical' && (
        <ClassicalDecoration isFlashing={isFlashing} />
      )}

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
          className="bpm-number text-center bg-transparent border-b-2 outline-none text-[120px] sm:text-[150px] lg:text-[180px] leading-none"
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
          className="bpm-number cursor-pointer text-[72px] sm:text-[120px] lg:text-[180px] leading-none tracking-tight transition-all"
          style={{
            fontFamily: 'var(--font-display), Bebas Neue, sans-serif',
            color: 'var(--text-primary)',
            animation: glowAnimation,
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

      {/* Bottom skin decorations */}
      {skinId === 'pixel' && <PixelHpBar bpm={bpm} />}
      {skinId === 'classical' && <ClassicalBottomOrnament />}
    </div>
  );
}
