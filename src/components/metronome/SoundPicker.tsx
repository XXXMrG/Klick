'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { SoundType } from '@/types/metronome';
import { useI18n } from '@/i18n';

interface SoundPickerProps {
  sound: SoundType;
  accentSound: SoundType;
  onChange: (sound: SoundType) => void;
  onAccentSoundChange: (sound: SoundType) => void;
}

const SOUND_TYPES: { value: SoundType; label: string }[] = [
  { value: 'tok',       label: 'Tok' },
  { value: 'beep',      label: 'Beep' },
  { value: 'hihat',     label: 'HiHat' },
  { value: 'kick',      label: 'Kick' },
  { value: 'rim',       label: 'Rim' },
  { value: 'woodblock', label: 'Wood' },
  { value: 'clap',      label: 'Clap' },
  { value: 'cowbell',   label: 'Bell' },
];

interface TooltipState {
  value: SoundType;
  x: number;
  y: number;
}

export default function SoundPicker({
  sound,
  accentSound,
  onChange,
  onAccentSoundChange,
}: SoundPickerProps) {
  const { t } = useI18n();
  const [tooltip, setTooltip] = useState<TooltipState | null>(null);
  const dismissTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const soundDescs: Record<SoundType, string> = {
    tok: t.sound.tok,
    beep: t.sound.beep,
    hihat: t.sound.hihat,
    kick: t.sound.kick,
    rim: t.sound.rim,
    woodblock: t.sound.woodblock,
    clap: t.sound.clap,
    cowbell: t.sound.cowbell,
  };

  // Close tooltip on scroll or resize
  useEffect(() => {
    const close = () => setTooltip(null);
    window.addEventListener('scroll', close, { passive: true });
    window.addEventListener('resize', close, { passive: true });
    return () => {
      window.removeEventListener('scroll', close);
      window.removeEventListener('resize', close);
    };
  }, []);

  const handleMouseEnter = useCallback((value: SoundType, e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setTooltip({
      value,
      x: rect.left + rect.width / 2,
      y: rect.top > 80 ? rect.top - 4 : rect.bottom + 4,
    });
  }, []);

  const handleMouseLeave = useCallback(() => {
    setTooltip(null);
  }, []);

  const handleTouchStart = useCallback((value: SoundType, onClick: () => void, e: React.TouchEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const rect = e.currentTarget.getBoundingClientRect();
    setTooltip({
      value,
      x: rect.left + rect.width / 2,
      y: rect.top > 80 ? rect.top - 4 : rect.bottom + 4,
    });
    if (dismissTimerRef.current) clearTimeout(dismissTimerRef.current);
    dismissTimerRef.current = setTimeout(() => {
      setTooltip(null);
      onClick();
    }, 1200);
  }, []);

  const isAbove = tooltip ? tooltip.y > 80 : true;

  const renderSoundButton = (
    s: { value: SoundType; label: string },
    isSelected: boolean,
    onClick: () => void,
    selectedBg: string,
    selectedColor: string,
  ) => (
    <button
      key={s.value}
      onClick={onClick}
      onMouseEnter={(e) => handleMouseEnter(s.value, e)}
      onMouseLeave={handleMouseLeave}
      onTouchStart={(e) => handleTouchStart(s.value, onClick, e)}
      className="px-2 py-2 rounded text-xs transition-all min-h-[36px] whitespace-nowrap overflow-hidden"
      style={{
        fontFamily: 'var(--font-mono), monospace',
        backgroundColor: isSelected ? selectedBg : 'var(--bg-control)',
        border: `1px solid ${isSelected ? 'var(--border-accent)' : 'var(--border-subtle)'}`,
        color: isSelected ? selectedColor : 'var(--text-secondary)',
      }}
    >
      {s.label}
    </button>
  );

  return (
    <div className="flex flex-col gap-3">
      {/* Normal sound section */}
      <div
        className="flex flex-col gap-2 pl-3"
        style={{
          borderLeft: '3px solid var(--accent-primary)',
        }}
      >
        <div>
          <label
            className="text-xs uppercase tracking-wider"
            style={{
              fontFamily: 'var(--font-mono), monospace',
              color: 'var(--text-muted)',
            }}
          >
            {t.sound.normalLabel}
          </label>
          <div
            className="text-[10px]"
            style={{
              fontFamily: 'var(--font-mono), monospace',
              color: 'var(--text-muted)',
              opacity: 0.7,
            }}
          >
            {t.sound.normalDesc}
          </div>
        </div>
        <div className="grid grid-cols-4 gap-1">
          {SOUND_TYPES.map((s) =>
            renderSoundButton(
              s,
              sound === s.value,
              () => onChange(s.value),
              'var(--accent-dim)',
              'var(--accent-primary)',
            )
          )}
        </div>
      </div>

      {/* Divider */}
      <div
        style={{
          height: '1px',
          backgroundColor: 'var(--border-subtle)',
        }}
      />

      {/* Accent sound section */}
      <div
        className="flex flex-col gap-2 pl-3"
        style={{
          borderLeft: '3px solid var(--beat-downbeat)',
        }}
      >
        <div>
          <label
            className="text-xs uppercase tracking-wider"
            style={{
              fontFamily: 'var(--font-mono), monospace',
              color: 'var(--text-muted)',
            }}
          >
            {t.sound.accentLabel}
          </label>
          <div
            className="text-[10px]"
            style={{
              fontFamily: 'var(--font-mono), monospace',
              color: 'var(--text-muted)',
              opacity: 0.7,
            }}
          >
            {t.sound.accentDesc}
          </div>
        </div>
        <div className="grid grid-cols-4 gap-1">
          {SOUND_TYPES.map((s) =>
            renderSoundButton(
              s,
              accentSound === s.value,
              () => onAccentSoundChange(s.value),
              'var(--beat-downbeat-dim)',
              'var(--beat-downbeat)',
            )
          )}
        </div>
      </div>

      {/* Floating tooltip */}
      {tooltip && (
        <div
          style={{
            position: 'fixed',
            left: tooltip.x,
            top: tooltip.y,
            transform: isAbove ? 'translate(-50%, -100%)' : 'translate(-50%, 0)',
            zIndex: 9999,
            pointerEvents: 'none',
          }}
        >
          {isAbove && (
            <div style={{
              position: 'absolute',
              bottom: -6,
              left: '50%',
              transform: 'translateX(-50%)',
              width: 0, height: 0,
              borderLeft: '6px solid transparent',
              borderRight: '6px solid transparent',
              borderTop: '6px solid rgba(0,0,0,0.15)',
            }} />
          )}
          {!isAbove && (
            <div style={{
              position: 'absolute',
              top: -6,
              left: '50%',
              transform: 'translateX(-50%)',
              width: 0, height: 0,
              borderLeft: '6px solid transparent',
              borderRight: '6px solid transparent',
              borderBottom: '6px solid rgba(0,0,0,0.15)',
            }} />
          )}
          <div
            style={{
              background: '#fff',
              borderRadius: 8,
              padding: '8px 12px',
              boxShadow: '0 8px 24px rgba(0,0,0,0.18), 0 2px 6px rgba(0,0,0,0.1)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 2,
              minWidth: 80,
            }}
          >
            <div style={{ fontSize: 11, fontWeight: 600, color: '#222', fontFamily: 'monospace' }}>
              {SOUND_TYPES.find(s => s.value === tooltip.value)?.label}
            </div>
            <div style={{ fontSize: 9, color: '#888', fontFamily: 'monospace' }}>
              {soundDescs[tooltip.value]}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
