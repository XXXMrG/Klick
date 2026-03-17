# Contributing to Klick

## Architecture Overview

### Audio Engine

The core scheduling algorithm uses a **look-ahead scheduler** driven by `setTimeout` + Web Audio API, avoiding the timing drift of `setInterval`. All sound synthesis is done programmatically via `AudioContext` — no audio files.

```
AudioEngine (singleton)
└── MetronomeScheduler
    ├── look-ahead: 100ms
    ├── poll interval: 25ms
    └── UI callback queue → consumed by requestAnimationFrame
```

Key files:
- `src/lib/audio/scheduler.ts` — the look-ahead scheduling loop
- `src/lib/audio/AudioEngine.ts` — singleton wrapper, manages AudioContext lifecycle
- `src/lib/audio/sounds.ts` — programmatic sound synthesis (oscillator + noise + filters)

### State Management

All metronome state lives in `useMetronome` hook. UI state (theme, open panels) lives in the page component. No external state library.

### Design Tokens

CSS variables are defined in `src/app/globals.css`:

```css
:root {
  --bg-primary: #0d0d0f;
  --bg-surface: #161619;
  --bg-control: #252530;
  --accent-primary: #ff6b2b;
  --accent-dim: rgba(255, 107, 43, 0.15);
  --text-primary: #f0ede8;
  --text-secondary: #8a8797;
  --text-muted: #4a4855;
  --border-subtle: rgba(255,255,255,0.06);
  --beat-downbeat: #ff2b2b;
}
```

## Development

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # production build
npm run lint       # eslint
```

## Adding a New Sound

1. Add the sound name to `SoundType` in `src/types/metronome.ts`
2. Implement the synthesis function in `src/lib/audio/sounds.ts`
3. Register it in `AudioEngine.ts`
4. Add the label to `SoundPicker.tsx`

## Adding a New Subdivision

1. Add the type to `SubdivisionType` in `src/types/metronome.ts`
2. Define the beat pattern in `src/lib/audio/scheduler.ts`
3. Add the label/icon to `SubdivisionPicker.tsx`

## PR Guidelines

- Keep PRs focused — one feature or fix per PR
- No new dependencies without discussion
- Audio timing changes must be tested at ≥120 BPM for at least 1 minute
- Mobile (375px+) must remain usable
