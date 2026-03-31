# Practice Page — Technical Specification

## Overview

New `/practice` route for the Klick metronome app. A daily drumming fundamentals trainer based on two canonical books:

1. **Stick Control** (George Lawrence Stone, 1935) — Single-beat combinations for hand independence
2. **PAS 40 International Drum Rudiments** (Percussive Arts Society, 1984) — The 40 standard rudiments

Core UX: Open daily → see recommended exercises → tap play to hear the pattern demonstrated → practice along with integrated metronome → mark complete → track progress over time.

---

## Key Design Decisions

### Audio: Pattern Playback
Each exercise can be played back as audio. The app synthesizes R and L hand hits using existing Web Audio API sounds, differentiated by pitch:
- **R (right hand)**: Higher pitch
- **L (left hand)**: Lower pitch  
- **Accent**: Louder + brighter
- **Ghost**: Very soft, short decay
- **Flam**: Grace note ~20ms before main note
- **Drag**: Two grace notes ~15ms apart before main note
- **Buzz/Roll**: Rapid retriggering (simplified as double stroke for audio)

### Metronome Integration
Bottom of practice page has a **sticky mini metronome bar** (reuses the existing AudioEngine/MetronomeScheduler). When user selects an exercise and hits "Practice", the metronome auto-sets to the exercise's BPM and starts.

### Data Storage
All in localStorage:
- Practice log entries (per-exercise, per-day)
- Today's plan  
- User settings

### Navigation
- Metronome page header gets a link/icon to `/practice`
- Practice page header gets a link/icon back to `/` (metronome)

---

## Exercise Data — PAS 40 International Drum Rudiments

Complete list with stickings. Categories and tier system from Vic Firth / Dr. Wooton:

### I. ROLL RUDIMENTS

**A. Single Stroke Roll Rudiments**
1. Single Stroke Roll*: `R L R L R L R L` (continuous alternating)
2. Single Stroke Four: `R L R L` (4 notes)
3. Single Stroke Seven: `R L R L R L R` (7 notes)

**B. Multiple Bounce Roll Rudiments**  
4. Multiple Bounce Roll*: `R— L—` (buzz strokes, sustained)
5. Triple Stroke Roll: `R R R L L L` 

**C. Double Stroke Open Roll Rudiments**
6. Double Stroke Open Roll*: `R R L L R R L L`
7. Five Stroke Roll*: `R R L L R` (or `L L R R L`)
8. Six Stroke Roll: `R L R R L L`
9. Seven Stroke Roll*: `R R L L R R L`
10. Nine Stroke Roll*: `R R L L R R L L R`
11. Ten Stroke Roll*: `R R L L R R L L R L`
12. Eleven Stroke Roll*: `R R L L R R L L R R L`
13. Thirteen Stroke Roll*: `R R L L R R L L R R L L R`
14. Fifteen Stroke Roll*: `R R L L R R L L R R L L R R L`
15. Seventeen Stroke Roll: `R R L L R R L L R R L L R R L L R`

### II. DIDDLE RUDIMENTS (Paradiddles)
16. Single Paradiddle*: `R L R R L R L L`
17. Double Paradiddle*: `R L R L R R L R L R L L`
18. Triple Paradiddle: `R L R L R L R R L R L R L R L L`
19. Single Paradiddle-diddle*: `R L R R L L`

### III. FLAM RUDIMENTS (lowercase = grace note)
20. Flam*: `lR rL` 
21. Flam Accent*: `lR L R rL R L` (in triplets)
22. Flam Tap*: `lR R rL L`
23. Flamacue*: `lR L R L rL`
24. Flam Paradiddle*: `lR L R R rL R L L`
25. Single Flammed Mill: `lR R L rL L R`
26. Flam Paradiddle-diddle*: `lR L R R L L rL R L L R R`
27. Pataflafla: `lR L rL R`
28. Swiss Army Triplet: `lR R L rL L R` (in triplets)
29. Inverted Flam Tap: `lR L rL R`
30. Flam Drag: `lR L lR rL R rL`

### IV. DRAG RUDIMENTS (double lowercase = drag grace notes)
31. Drag*: `llR rrL`
32. Single Drag Tap*: `llR L rrL R`
33. Double Drag Tap*: `llR llR L rrL rrL R`
34. Lesson 25*: `llR L R L rrL R L R`
35. Single Dragadiddle: `llR R L L rrL L R R`
36. Drag Paradiddle #1*: `R llR L R R L rrL R L L`
37. Drag Paradiddle #2*: `R llR L R R L L L rrL R L L R R`
38. Single Ratamacue*: `llR L R rrL R L`
39. Double Ratamacue*: `llR L R llR L R rrL R L rrL R L`
40. Triple Ratamacue*: `llR L R llR L R llR L R rrL R L rrL R L rrL R L`

(* = also in the original 26 American Drum Rudiments)

**Tier System (Dr. Wooton / Vic Firth):**
- Tier 1: #1 Single Stroke Roll, #4 Multiple Bounce, #6 Double Stroke Roll, #16 Single Paradiddle, #20 Flam, #31 Drag
- Tier 2: #2 Single Stroke Four, #3 Single Stroke Seven, #17 Double Paradiddle, #18 Triple Paradiddle, #19 Paradiddle-diddle, #7 Five Stroke Roll, #10 Nine Stroke Roll, #9 Seven Stroke Roll, #22 Flam Tap, #21 Flam Accent, #34 Lesson 25, #32 Single Drag Tap
- Tier 3: #13 Thirteen Stroke Roll, #14 Fifteen Stroke Roll, #15 Seventeen Stroke Roll, #8 Six Stroke Roll, #11 Ten Stroke Roll, #12 Eleven Stroke Roll, #35 Single Dragadiddle, #36 Drag Paradiddle #1, #37 Drag Paradiddle #2, #25 Single Flammed Mill, #28 Swiss Army Triplet, #23 Flamacue, #24 Flam Paradiddle
- Tier 4: #5 Triple Stroke Roll, #26 Flam Paradiddle-diddle, #27 Pataflafla, #29 Inverted Flam Tap, #30 Flam Drag, #33 Double Drag Tap, #38 Single Ratamacue, #39 Double Ratamacue, #40 Triple Ratamacue

---

## Exercise Data — Stick Control Page 5 (First 12)

These are all 8-note patterns in sixteenth notes (one bar of 2/4 or half a bar of 4/4):

1. `R L R L R L R L` — basic alternating
2. `L R L R L R L R` — left lead alternating
3. `R R L L R R L L` — double stroke
4. `L L R R L L R R` — double stroke left lead
5. `R L R R L R L L` — paradiddle
6. `R L L R L R R L` — paradiddle inversion
7. `R R L R L L R L`
8. `R R L L R L R L`
9. `R L L R R L R L`
10. `R L R L R R L L`
11. `R R L R L R L L`
12. `R L R R L L R L`

---

## Technical Architecture

### New File Structure
```
src/
├── app/practice/
│   └── page.tsx                    — Practice page (client component)
├── components/practice/
│   ├── TodayPlan.tsx               — Smart daily recommendations
│   ├── ExerciseBrowser.tsx         — Full exercise library with category filters
│   ├── ExerciseCard.tsx            — Single exercise row/card
│   ├── ExerciseDetail.tsx          — Expanded exercise with play/practice controls
│   ├── CategorySidebar.tsx         — Category/book navigation sidebar
│   ├── ProgressDashboard.tsx       — Calendar heatmap + streak + stats
│   ├── MiniMetronome.tsx           — Sticky bottom metronome bar
│   └── StickingDisplay.tsx         — Visual R/L pattern with active beat highlighting
├── hooks/
│   ├── usePracticeLog.ts           — CRUD for practice entries in localStorage
│   ├── usePracticePlayer.ts        — Controls PatternScheduler for demos
│   └── useRecommendation.ts        — Smart daily plan algorithm
├── lib/practice/
│   ├── types.ts                    — Type definitions
│   ├── data/
│   │   ├── stick-control.ts        — Stick Control exercises
│   │   └── pas-40.ts               — PAS 40 rudiments
│   ├── recommend.ts                — Recommendation engine
│   └── storage.ts                  — localStorage helpers
└── lib/audio/
    └── PatternScheduler.ts         — Plays exercise patterns via Web Audio API
```

### Data Types (key types)

```typescript
interface PatternNote {
  position: number;        // 0-indexed position in subdivisions
  hand: 'R' | 'L';
  type: 'accent' | 'normal' | 'ghost' | 'flam' | 'drag' | 'buzz';
  graceOffset?: number;    // seconds before main hit for flam/drag grace notes
}

interface Exercise {
  id: string;                    // 'sc-001', 'pas-01', etc.
  book: 'stick-control' | 'pas-40';
  category: string;              // 'single-beat', 'rolls', 'paradiddles', 'flams', 'drags'
  number: number;
  name: string;
  nameZh: string;
  nameJa: string;
  sticking: string;              // display string like 'R L R R L R L L'
  pattern: PatternNote[];        // for audio playback
  patternLength: number;         // total subdivisions per cycle
  grid: 'sixteenth' | 'triplet' | 'eighth';
  timeSignature: { beats: number; noteValue: number };
  defaultBpm: number;
  targetBpm: number;
  tier: 1 | 2 | 3 | 4;
  tags: string[];
}

interface PracticeEntry {
  date: string;             // 'YYYY-MM-DD'
  exerciseId: string;
  bpm: number;
  completed: boolean;
  durationSeconds: number;
}
```

### PatternScheduler
New audio module that takes an Exercise and BPM, uses the same Web Audio API synthesis (oscillators + noise, NO audio samples) to play the pattern. Differentiates R/L by frequency. Supports loop mode and beat-by-beat callbacks for UI sync (highlighting current note in StickingDisplay).

### Smart Recommendation
Algorithm inputs: all exercises, user's practice history, current date.
Logic:
1. Include 1-2 new exercises user hasn't tried
2. Prioritize exercises with BPM far below target
3. Rotate categories (don't repeat same category daily)
4. Include 2-3 "easy wins" near target BPM for motivation
5. Session size: 6-8 exercises (configurable)

### Visual Design
- MUST use existing CSS variable system (--bg-primary, --accent-primary, etc.)
- MUST work with all 6 skins (default, ocean, forest, minimal, pixel, classical)
- Same header/footer pattern as metronome page
- Calendar heatmap similar to GitHub contribution graph

### i18n
Add practice-related keys to all three locale files (zh.ts, en.ts, ja.ts).

### Constraints
- Do NOT break existing metronome functionality
- Only modify existing files for navigation links (add Practice link in metronome header)
- Reuse existing skin/theme/i18n infrastructure
- All new code follows existing patterns (functional React, hooks, TypeScript, Tailwind CSS v4)
