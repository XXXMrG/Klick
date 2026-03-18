export interface SkinColorSet {
  '--bg-primary': string;
  '--bg-surface': string;
  '--bg-elevated': string;
  '--bg-control': string;
  '--accent-primary': string;
  '--accent-secondary': string;
  '--accent-dim': string;
  '--text-primary': string;
  '--text-secondary': string;
  '--text-muted': string;
  '--border-subtle': string;
  '--border-accent': string;
  '--beat-flash': string;
  '--beat-downbeat': string;
  '--beat-downbeat-dim': string;
  '--success': string;
  '--error': string;
}

export interface SkinFonts {
  '--skin-font-display'?: string;
  '--skin-font-mono'?: string;
  '--skin-font-body'?: string;
}

export interface SkinDefinition {
  id: string;
  name: string;
  emoji: string;
  dark: SkinColorSet;
  light: SkinColorSet;
  fonts?: SkinFonts;
  /** Extra CSS custom properties (e.g. border-radius overrides) */
  extras?: Record<string, string>;
  /** Google Fonts URL to load for this skin */
  googleFontsUrl?: string;
}
