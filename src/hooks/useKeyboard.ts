'use client';

import { useEffect } from 'react';

interface KeyboardActions {
  toggle: () => void;
  setBpm: (bpm: number) => void;
  bpm: number;
}

export function useKeyboard({ toggle, setBpm, bpm }: KeyboardActions) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      // Don't trigger when typing in input fields
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      ) {
        return;
      }

      switch (e.code) {
        case 'Space':
          e.preventDefault();
          toggle();
          break;
        case 'ArrowUp':
          e.preventDefault();
          if (e.ctrlKey || e.metaKey) {
            setBpm(bpm + 10);
          } else if (e.shiftKey) {
            setBpm(bpm + 5);
          } else {
            setBpm(bpm + 1);
          }
          break;
        case 'ArrowDown':
          e.preventDefault();
          if (e.ctrlKey || e.metaKey) {
            setBpm(bpm - 10);
          } else if (e.shiftKey) {
            setBpm(bpm - 5);
          } else {
            setBpm(bpm - 1);
          }
          break;
      }
    };

    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [toggle, setBpm, bpm]);
}
