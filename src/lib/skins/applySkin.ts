import { SkinDefinition, SkinColorSet } from './types';

const FONT_LINK_ID = 'skin-google-fonts';

/** Map from SkinFonts keys to the actual CSS variable names used by components */
const FONT_MAP = {
  '--skin-font-display': '--font-display',
  '--skin-font-mono': '--font-mono',
  '--skin-font-body': '--font-body',
} as const;

export function applySkin(skin: SkinDefinition, mode: 'dark' | 'light') {
  const root = document.documentElement;
  const colors: SkinColorSet = mode === 'light' ? skin.light : skin.dark;

  // Write color variables
  for (const [key, value] of Object.entries(colors)) {
    root.style.setProperty(key, value);
  }

  // Write font overrides on <body> inline style.
  // Next.js sets --font-display/mono/body via class on <body>, so we must
  // override at the same element with inline style (highest specificity).
  const body = document.body;
  for (const [skinKey, cssKey] of Object.entries(FONT_MAP)) {
    const value = skin.fonts?.[skinKey as keyof typeof FONT_MAP];
    if (value) {
      body.style.setProperty(cssKey, value);
    } else {
      body.style.removeProperty(cssKey);
    }
  }

  // Write extra CSS custom properties
  const prevExtras = root.dataset.skinExtras;
  if (prevExtras) {
    for (const key of prevExtras.split(',')) {
      root.style.removeProperty(key);
    }
  }
  if (skin.extras) {
    const keys = Object.keys(skin.extras);
    for (const [key, value] of Object.entries(skin.extras)) {
      root.style.setProperty(key, value);
    }
    root.dataset.skinExtras = keys.join(',');
  } else {
    delete root.dataset.skinExtras;
  }

  // Load Google Fonts if needed
  const existingLink = document.getElementById(FONT_LINK_ID) as HTMLLinkElement | null;
  if (skin.googleFontsUrl) {
    if (existingLink) {
      existingLink.href = skin.googleFontsUrl;
    } else {
      const link = document.createElement('link');
      link.id = FONT_LINK_ID;
      link.rel = 'stylesheet';
      link.href = skin.googleFontsUrl;
      document.head.appendChild(link);
    }
  } else if (existingLink) {
    existingLink.remove();
  }

  root.setAttribute('data-skin', skin.id);
  root.setAttribute('data-theme', mode);

  // Serialize for blocking script
  const varsToSave: Record<string, string> = { ...colors };
  // Save font overrides using the real CSS variable names
  if (skin.fonts) {
    for (const [skinKey, cssKey] of Object.entries(FONT_MAP)) {
      const value = skin.fonts[skinKey as keyof typeof FONT_MAP];
      if (value) varsToSave[cssKey] = value;
    }
  }
  if (skin.extras) Object.assign(varsToSave, skin.extras);

  localStorage.setItem('metronome-skin', skin.id);
  localStorage.setItem('metronome-theme', mode);
  localStorage.setItem('metronome-skin-vars', JSON.stringify(varsToSave));
  if (skin.googleFontsUrl) {
    localStorage.setItem('metronome-skin-fonts-url', skin.googleFontsUrl);
  } else {
    localStorage.removeItem('metronome-skin-fonts-url');
  }
}
