'use client';

import { SoundType } from '@/types/metronome';

interface SoundPickerProps {
  sound: SoundType;
  accentSound: SoundType;
  onChange: (sound: SoundType) => void;
  onAccentSoundChange: (sound: SoundType) => void;
}

const SOUNDS: { value: SoundType; label: string; desc: string }[] = [
  { value: 'tok',       label: 'Tok',    desc: '木质清脆，类机械摆' },
  { value: 'beep',      label: 'Beep',   desc: '电子哔声，干净' },
  { value: 'hihat',     label: 'HiHat',  desc: '踩镲，高频噪声' },
  { value: 'kick',      label: 'Kick',   desc: '底鼓，低频冲击' },
  { value: 'rim',       label: 'Rim',    desc: '军鼓边击，crack' },
  { value: 'woodblock', label: 'Wood',   desc: '木鱼，共鸣感' },
  { value: 'clap',      label: 'Clap',   desc: '拍手，自然感' },
  { value: 'cowbell',   label: 'Bell',   desc: '牛铃，808 风格' },
];

export default function SoundPicker({
  sound,
  accentSound,
  onChange,
  onAccentSoundChange,
}: SoundPickerProps) {
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
            节拍音色
          </label>
          <div
            className="text-[10px]"
            style={{
              fontFamily: 'var(--font-mono), monospace',
              color: 'var(--text-muted)',
              opacity: 0.7,
            }}
          >
            普通拍 / 弱拍使用
          </div>
        </div>
        <div className="grid grid-cols-4 gap-1">
          {SOUNDS.map((s) => (
            <button
              key={s.value}
              onClick={() => onChange(s.value)}
              title={s.desc}
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
            强拍音色
          </label>
          <div
            className="text-[10px]"
            style={{
              fontFamily: 'var(--font-mono), monospace',
              color: 'var(--text-muted)',
              opacity: 0.7,
            }}
          >
            第一拍（重音）使用
          </div>
        </div>
        <div className="grid grid-cols-4 gap-1">
          {SOUNDS.map((s) => (
            <button
              key={s.value}
              onClick={() => onAccentSoundChange(s.value)}
              title={s.desc}
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
