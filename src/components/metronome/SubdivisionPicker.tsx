'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import Image from 'next/image';
import { SubdivisionType, SUBDIVISION_CONFIGS } from '@/types/metronome';
import { useI18n } from '@/i18n';
import { TranslationKeys } from '@/i18n/types';

const SUBDIVISION_TYPES: SubdivisionType[] = [
  'quarter', 'eighth', 'triplet', 'sixteenth',
  'dotted-long', 'dotted-short',
  'sync-a', 'sync-b', 'sync-c',
  'triplet16-a', 'triplet16-b',
  'quintuplet',
];

const SUBDIVISION_IMAGES: Record<SubdivisionType, string> = {
  'quarter':      '/sub1.webp',
  'eighth':       '/sub2.webp',
  'triplet':      '/sub3.webp',
  'sixteenth':    '/sub4.webp',
  'dotted-long':  '/sub5.webp',
  'dotted-short': '/sub6.webp',
  'sync-a':       '/sub7.webp',
  'sync-b':       '/sub8.webp',
  'sync-c':       '/sub9.webp',
  'triplet16-a':  '/sub10.webp',
  'triplet16-b':  '/sub11.webp',
  'quintuplet':   '',
};

type SubKey = keyof TranslationKeys['subdivisions'];

const TYPE_TO_KEY: Record<SubdivisionType, SubKey> = {
  'quarter': 'quarter',
  'eighth': 'eighth',
  'triplet': 'triplet',
  'sixteenth': 'sixteenth',
  'dotted-long': 'dottedLong',
  'dotted-short': 'dottedShort',
  'sync-a': 'syncA',
  'sync-b': 'syncB',
  'sync-c': 'syncC',
  'triplet16-a': 'triplet16A',
  'triplet16-b': 'triplet16B',
  'quintuplet': 'quintuplet',
};

function BeatPatternDots({ type }: { type: SubdivisionType }) {
  const config = SUBDIVISION_CONFIGS[type];
  return (
    <div className="flex items-center justify-center gap-0.5 h-4">
      {config.intervals.map((ratio, i) => (
        <div
          key={i}
          style={{
            width: Math.max(4, Math.round(ratio * 24)),
            height: 6,
            borderRadius: 2,
            backgroundColor: 'currentColor',
            opacity: 0.9,
            flexShrink: 0,
          }}
        />
      ))}
    </div>
  );
}

interface SubdivisionPickerProps {
  subdivision: SubdivisionType;
  onChange: (sub: SubdivisionType) => void;
}

interface PreviewState {
  type: SubdivisionType;
  x: number;
  y: number;
}

export default function SubdivisionPicker({ subdivision, onChange }: SubdivisionPickerProps) {
  const { t } = useI18n();
  const [preview, setPreview] = useState<PreviewState | null>(null);
  const dismissTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Close preview on scroll or resize
  useEffect(() => {
    const close = () => setPreview(null);
    window.addEventListener('scroll', close, { passive: true });
    window.addEventListener('resize', close, { passive: true });
    return () => {
      window.removeEventListener('scroll', close);
      window.removeEventListener('resize', close);
    };
  }, []);

  const handleMouseEnter = useCallback((type: SubdivisionType, e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setPreview({
      type,
      x: rect.left + rect.width / 2,
      // Show above the button; if too close to top, show below
      y: rect.top > 160 ? rect.top - 4 : rect.bottom + 4,
    });
  }, []);

  const handleMouseLeave = useCallback(() => {
    setPreview(null);
  }, []);

  const handleTouchStart = useCallback((type: SubdivisionType, e: React.TouchEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const rect = e.currentTarget.getBoundingClientRect();
    setPreview({
      type,
      x: rect.left + rect.width / 2,
      y: rect.top > 160 ? rect.top - 4 : rect.bottom + 4,
    });
    if (dismissTimerRef.current) clearTimeout(dismissTimerRef.current);
    dismissTimerRef.current = setTimeout(() => {
      setPreview(null);
      onChange(type);
    }, 1200);
  }, [onChange]);

  const isAbove = preview ? preview.y > 160 : true;

  return (
    <div className="flex flex-col gap-2">
      <label
        className="text-xs uppercase tracking-wider"
        style={{ fontFamily: 'var(--font-mono), monospace', color: 'var(--text-muted)' }}
      >
        {t.subdivision.label}
      </label>

      <div className="grid gap-1" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(64px, 1fr))' }}>
        {SUBDIVISION_TYPES.map((type) => {
          const isActive = subdivision === type;
          const key = TYPE_TO_KEY[type];
          const sub = t.subdivisions[key];
          return (
            <button
              key={type}
              onClick={() => onChange(type)}
              onMouseEnter={(e) => handleMouseEnter(type, e)}
              onMouseLeave={handleMouseLeave}
              onTouchStart={(e) => handleTouchStart(type, e)}
              className="flex flex-col items-center gap-1 px-1 py-2 rounded transition-all"
              style={{
                backgroundColor: isActive ? 'var(--accent-dim)' : 'var(--bg-control)',
                border: `1px solid ${isActive ? 'var(--border-accent)' : 'var(--border-subtle)'}`,
                color: isActive ? 'var(--accent-primary)' : 'var(--text-secondary)',
                minHeight: 52,
              }}
            >
              <BeatPatternDots type={type} />
              <span style={{ fontSize: '9px', fontFamily: 'var(--font-mono), monospace', lineHeight: 1 }}>
                {sub.label}
              </span>
            </button>
          );
        })}
      </div>

      {/* Floating image preview — portal via fixed position */}
      {preview && (() => {
        const key = TYPE_TO_KEY[preview.type];
        const sub = t.subdivisions[key];
        return (
          <div
            style={{
              position: 'fixed',
              left: preview.x,
              top: isAbove ? preview.y : preview.y,
              transform: isAbove ? 'translate(-50%, -100%)' : 'translate(-50%, 0)',
              zIndex: 9999,
              pointerEvents: 'none',
            }}
          >
            {/* Arrow (above: points down; below: points up) */}
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
                padding: '10px 12px 8px',
                boxShadow: '0 8px 24px rgba(0,0,0,0.18), 0 2px 6px rgba(0,0,0,0.1)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 6,
                minWidth: 110,
              }}
            >
              {SUBDIVISION_IMAGES[preview.type] && (
                <Image
                  src={SUBDIVISION_IMAGES[preview.type]}
                  alt={preview.type}
                  width={90}
                  height={56}
                  style={{ objectFit: 'contain', display: 'block' }}
                />
              )}
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 11, fontWeight: 600, color: '#222', fontFamily: 'monospace' }}>
                  {sub.name}
                </div>
                <div style={{ fontSize: 9, color: '#888', fontFamily: 'monospace', marginTop: 2 }}>
                  {sub.desc}
                </div>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
}
