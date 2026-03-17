'use client';

import { useState, useCallback, useEffect } from 'react';
import { Preset, BUILT_IN_PRESETS } from '@/types/metronome';

const STORAGE_KEY = 'metronome-presets';

export function usePresets() {
  const [userPresets, setUserPresets] = useState<Preset[]>([]);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setUserPresets(JSON.parse(stored));
      }
    } catch {
      // ignore
    }
  }, []);

  const saveToStorage = useCallback((presets: Preset[]) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(presets));
    } catch {
      // ignore
    }
  }, []);

  const addPreset = useCallback(
    (preset: Omit<Preset, 'id'>) => {
      const newPreset: Preset = {
        ...preset,
        id: `user-${Date.now()}`,
        isBuiltIn: false,
      };
      setUserPresets((prev) => {
        const updated = [...prev, newPreset];
        saveToStorage(updated);
        return updated;
      });
    },
    [saveToStorage]
  );

  const deletePreset = useCallback(
    (id: string) => {
      setUserPresets((prev) => {
        const updated = prev.filter((p) => p.id !== id);
        saveToStorage(updated);
        return updated;
      });
    },
    [saveToStorage]
  );

  return {
    presets: [...BUILT_IN_PRESETS, ...userPresets],
    builtInPresets: BUILT_IN_PRESETS,
    userPresets,
    addPreset,
    deletePreset,
  };
}
