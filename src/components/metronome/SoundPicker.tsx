'use client';

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

export default function SoundPicker({
  sound,
  accentSound,
  onChange,
  onAccentSoundChange,
}: SoundPickerProps) {
  const { t } = useI18n();

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
          {SOUND_TYPES.map((s) => (
            <button
              key={s.value}
              onClick={() => onChange(s.value)}
              title={soundDescs[s.value]}
              className="px-2 py-2 rounded text-xs transition-all min-h-[36px] whitespace-nowrap overflow-hidden"
              style={{
                fontFamily: 'var(--font-mono), monospace',
                backgroundColor:
                  sound === s.value ? 'var(--accent-dim)' : 'var(--bg-control)',
                border: `1px solid ${
                  sound === s.value ? 'var(--border-accent)' : 'var(--border-subtle)'
                }`,
                color:
                  sound === s.value ? 'var(--accent-primary)' : 'var(--text-secondary)',
              }}
            >
              {s.label}
            </button>
          ))}
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
          {SOUND_TYPES.map((s) => (
            <button
              key={s.value}
              onClick={() => onAccentSoundChange(s.value)}
              title={soundDescs[s.value]}
              className="px-2 py-2 rounded text-xs transition-all min-h-[36px] whitespace-nowrap overflow-hidden"
              style={{
                fontFamily: 'var(--font-mono), monospace',
                backgroundColor:
                  accentSound === s.value ? 'var(--beat-downbeat-dim)' : 'var(--bg-control)',
                border: `1px solid ${
                  accentSound === s.value ? 'var(--border-accent)' : 'var(--border-subtle)'
                }`,
                color:
                  accentSound === s.value
                    ? 'var(--beat-downbeat)'
                    : 'var(--text-secondary)',
              }}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
