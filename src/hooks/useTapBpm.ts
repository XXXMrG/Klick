'use client';

import { useState, useCallback, useRef } from 'react';

export function useTapBpm(onBpmDetected: (bpm: number) => void) {
  const [taps, setTaps] = useState<number[]>([]);
  const [detectedBpm, setDetectedBpm] = useState<number | null>(null);
  const resetTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const tap = useCallback(() => {
    const now = performance.now();

    // Reset if too long since last tap (> 2 seconds)
    if (resetTimeoutRef.current) clearTimeout(resetTimeoutRef.current);
    resetTimeoutRef.current = setTimeout(() => {
      setTaps([]);
      setDetectedBpm(null);
    }, 2000);

    setTaps((prev) => {
      const newTaps = [...prev, now].slice(-8); // Keep last 8 taps

      if (newTaps.length >= 2) {
        // Calculate average interval
        const intervals: number[] = [];
        for (let i = 1; i < newTaps.length; i++) {
          intervals.push(newTaps[i] - newTaps[i - 1]);
        }
        const avgInterval =
          intervals.reduce((sum, i) => sum + i, 0) / intervals.length;
        const bpm = Math.round(60000 / avgInterval);

        if (bpm >= 1 && bpm <= 300) {
          setDetectedBpm(bpm);
          onBpmDetected(bpm);
        }
      }

      return newTaps;
    });
  }, [onBpmDetected]);

  const reset = useCallback(() => {
    setTaps([]);
    setDetectedBpm(null);
    if (resetTimeoutRef.current) clearTimeout(resetTimeoutRef.current);
  }, []);

  return { tap, reset, tapCount: taps.length, detectedBpm };
}
