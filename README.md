# Klick — Web Metronome

A precision metronome built for musicians. Runs in the browser, no installation needed.

<div align="center">
  <img src="public/og-preview.png" alt="Klick preview" height="500" />
</div>

## Features

- **Precise timing** — Web Audio API scheduler with sub-millisecond accuracy
- **Tap Tempo** — tap any key or button to set BPM
- **Beat visualizer** — per-beat accent control (normal / accent / ghost)
- **Time signatures** — any numerator, 4 common denominators
- **Subdivisions** — 11 types: quarter, eighth, triplet, sixteenth, dotted, syncopated, and more
- **Sound picker** — multiple click sounds + separate accent sound
- **Tempo Trainer** — auto-increase BPM over time to build speed
- **Timer** — count-down practice sessions, auto-stops playback
- **Flash Mode** — full-screen flash overlay for visual cueing
- **Keyboard shortcuts** — Space to play/stop, ↑↓ to adjust BPM
- **Dark / Light theme** — persisted across sessions
- **Wake Lock** — screen stays on while playing on mobile
- **Settings persistence** — BPM, time sig, sounds saved to localStorage

## Tech Stack

- [Next.js 15](https://nextjs.org/) (App Router)
- [React 19](https://react.dev/)
- [Tailwind CSS v4](https://tailwindcss.com/)
- [Web Audio API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API) — no audio libraries
- [Lucide React](https://lucide.dev/) — icons
- TypeScript throughout

## Getting Started

```bash
# Install dependencies
npm install

# Run dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

```bash
# Production build
npm run build
npm start
```

## Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `Space` | Play / Stop |
| `↑` / `↓` | BPM ±1 |
| `Shift + ↑` / `↓` | BPM ±5 |
| `Esc` | Exit Flash Mode |

## Project Structure

```
src/
├── app/              # Next.js app entry, global styles
├── components/
│   └── metronome/    # UI components (BpmDisplay, BeatVisualizer, etc.)
├── hooks/            # useMetronome, useTapBpm, useKeyboard, usePresets
├── lib/
│   └── audio/        # AudioEngine, scheduler, sound definitions
└── types/            # Shared TypeScript types
```

## License

MIT
