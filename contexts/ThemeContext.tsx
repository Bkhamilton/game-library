import React, { createContext, useState, useContext, ReactNode } from 'react';
import { THEMES, GameTheme } from '@/constants/Themes';

interface ThemeContextType {
  currentTheme: GameTheme;
  themeId: string;
  setTheme: (themeId: string) => void;
  availableThemes: GameTheme[];
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [themeId, setThemeId] = useState<string>('light');

  const setTheme = (newThemeId: string) => {
    if (THEMES[newThemeId]) {
      setThemeId(newThemeId);
    }
  };

  const value: ThemeContextType = {
    currentTheme: THEMES[themeId],
    themeId,
    setTheme,
    availableThemes: Object.values(THEMES),
  };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export const useThemeContext = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useThemeContext must be used within a ThemeProvider');
  }
  return context;
};
