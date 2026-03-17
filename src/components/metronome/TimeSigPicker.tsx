'use client';

interface TimeSigPickerProps {
  beatsPerBar: number;
  beatUnit: 4 | 8;
  onBeatsChange: (beats: number) => void;
  onBeatUnitChange: (unit: 4 | 8) => void;
}

export default function TimeSigPicker({
  beatsPerBar,
  beatUnit,
  onBeatsChange,
  onBeatUnitChange,
}: TimeSigPickerProps) {
  return (
    <div className="flex flex-col gap-2">
      <label
        className="text-xs uppercase tracking-wider"
        style={{
          fontFamily: 'var(--font-mono), monospace',
          color: 'var(--text-muted)',
        }}
      >
        拍号
      </label>
      <div className="flex items-center gap-3">
        {/* Beats per bar selector */}
        <div className="flex-1 min-w-0">
          <div className="grid gap-1" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(30px, 1fr))' }}>
            {Array.from({ length: 12 }, (_, i) => i + 1).map((n) => (
              <button
                key={n}
                onClick={() => onBeatsChange(n)}
                className="h-8 rounded text-xs transition-all flex items-center justify-center"
                style={{
                  fontFamily: 'var(--font-mono), monospace',
                  backgroundColor:
                    beatsPerBar === n ? 'var(--accent-dim)' : 'var(--bg-control)',
                  border: `1px solid ${
                    beatsPerBar === n ? 'var(--border-accent)' : 'var(--border-subtle)'
                  }`,
                  color:
                    beatsPerBar === n ? 'var(--accent-primary)' : 'var(--text-secondary)',
                }}
              >
                {n}
              </button>
            ))}
          </div>
        </div>

        {/* Divider */}
        <div
          className="text-2xl font-bold flex-shrink-0"
          style={{
            fontFamily: 'var(--font-display), sans-serif',
            color: 'var(--text-muted)',
          }}
        >
          /
        </div>

        {/* Beat unit selector */}
        <div className="flex gap-1 flex-shrink-0">
          {([4, 8] as const).map((unit) => (
            <button
              key={unit}
              onClick={() => onBeatUnitChange(unit)}
              className="w-9 h-9 rounded text-sm transition-all flex items-center justify-center"
              style={{
                fontFamily: 'var(--font-mono), monospace',
                backgroundColor:
                  beatUnit === unit ? 'var(--accent-dim)' : 'var(--bg-control)',
                border: `1px solid ${
                  beatUnit === unit ? 'var(--border-accent)' : 'var(--border-subtle)'
                }`,
                color:
                  beatUnit === unit ? 'var(--accent-primary)' : 'var(--text-secondary)',
              }}
            >
              {unit}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
