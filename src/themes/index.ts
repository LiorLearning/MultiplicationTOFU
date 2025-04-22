import { ThemeConfig } from '../types/theme';
import { superheroTheme } from './superhero';
import { spaceTheme } from './space';

export const themeConfig: ThemeConfig = {
  themes: [superheroTheme, spaceTheme],
  defaultTheme: 'superhero',
};

export * from './superhero';
export * from './space';