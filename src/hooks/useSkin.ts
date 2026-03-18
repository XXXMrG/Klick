'use client';

import { useState, useEffect, useCallback } from 'react';
import { applySkin } from '@/lib/skins/applySkin';
import { getSkin } from '@/lib/skins/registry';

export function useSkin() {
  const [skinId, setSkinId] = useState('default');
  const [mode, setMode] = useState<'dark' | 'light'>('dark');
  const [ready, setReady] = useState(false);

  // Read persisted values after mount
  useEffect(() => {
    const savedSkin = localStorage.getItem('metronome-skin') ?? 'default';
    const savedTheme = localStorage.getItem('metronome-theme');
    const initialMode = savedTheme === 'light' ? 'light' : 'dark';

    setSkinId(savedSkin);
    setMode(initialMode);

    // Apply immediately to sync CSS variables (blocking script only restores vars,
    // this ensures data-skin attribute and full consistency)
    applySkin(getSkin(savedSkin), initialMode);
    setReady(true);
  }, []);

  const changeSkin = useCallback((id: string) => {
    setSkinId(id);
    setMode((prev) => {
      applySkin(getSkin(id), prev);
      return prev;
    });
  }, []);

  const toggleMode = useCallback(() => {
    setMode((prev) => {
      const next = prev === 'light' ? 'dark' : 'light';
      setSkinId((currentSkin) => {
        applySkin(getSkin(currentSkin), next);
        return currentSkin;
      });
      return next;
    });
  }, []);

  return { skinId, mode, ready, changeSkin, toggleMode };
}
