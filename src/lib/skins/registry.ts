import { SkinDefinition } from './types';
import { defaultSkin } from './skins/default';
import { oceanSkin } from './skins/ocean';
import { forestSkin } from './skins/forest';
import { minimalSkin } from './skins/minimal';
import { pixelSkin } from './skins/pixel';
import { classicalSkin } from './skins/classical';

export const skins: SkinDefinition[] = [
  defaultSkin,
  oceanSkin,
  forestSkin,
  minimalSkin,
  pixelSkin,
  classicalSkin,
];

export function getSkin(id: string): SkinDefinition {
  return skins.find((s) => s.id === id) ?? defaultSkin;
}
