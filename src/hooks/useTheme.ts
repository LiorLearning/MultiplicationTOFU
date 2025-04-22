import { create } from 'zustand';
import { GameTheme } from '../types/theme';
import { themeConfig } from '../themes';

interface ThemeStore {
  currentTheme: GameTheme;
  setTheme: (themeId: string) => void;
}

export const useTheme = create<ThemeStore>((set) => ({
  currentTheme: themeConfig.themes.find(t => t.id === themeConfig.defaultTheme) || themeConfig.themes[0],
  setTheme: (themeId) => {
    const theme = themeConfig.themes.find(t => t.id === themeId);
    if (theme) {
      set({ currentTheme: theme });
    }
  },
}));