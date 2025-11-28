
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Theme, ThemeConfig } from '../types';

const themes: Record<Theme, ThemeConfig> = {
  calm: {
    name: 'calm',
    label: 'Lavender Dream',
    gradient: 'from-indigo-50 via-purple-50 to-pink-50',
    accent: 'purple',
    primaryColor: '#9333ea', // purple-600
    orbColors: ['bg-purple-300', 'bg-pink-300', 'bg-indigo-300'],
    buttonGradient: 'from-indigo-500 to-purple-500',
    textColor: 'text-slate-950',
    glassColor: 'bg-white/90',
    isDark: false
  },
  ocean: {
    name: 'ocean',
    label: 'Ocean Breeze',
    gradient: 'from-cyan-50 via-blue-50 to-teal-50',
    accent: 'cyan',
    primaryColor: '#0891b2', // cyan-600
    orbColors: ['bg-cyan-300', 'bg-blue-300', 'bg-teal-300'],
    buttonGradient: 'from-cyan-500 to-blue-500',
    textColor: 'text-slate-950',
    glassColor: 'bg-white/90',
    isDark: false
  },
  emerald: {
    name: 'emerald',
    label: 'Emerald Zen',
    gradient: 'from-emerald-50 via-teal-50 to-green-50',
    accent: 'emerald',
    primaryColor: '#059669', // emerald-600
    orbColors: ['bg-emerald-300', 'bg-teal-300', 'bg-green-300'],
    buttonGradient: 'from-emerald-500 to-teal-600',
    textColor: 'text-slate-950',
    glassColor: 'bg-white/90',
    isDark: false
  },
  energy: {
    name: 'energy',
    label: 'Sunset Glow',
    gradient: 'from-orange-50 via-amber-50 to-rose-50',
    accent: 'orange',
    primaryColor: '#ea580c', // orange-600
    orbColors: ['bg-orange-300', 'bg-amber-300', 'bg-rose-300'],
    buttonGradient: 'from-orange-500 to-red-500',
    textColor: 'text-slate-950',
    glassColor: 'bg-white/90',
    isDark: false
  },
  midnight: {
    name: 'midnight',
    label: 'Deep Space',
    gradient: 'from-slate-900 via-purple-950 to-slate-900',
    accent: 'indigo',
    primaryColor: '#818cf8', // indigo-400 (lighter for dark mode contrast)
    orbColors: ['bg-indigo-600', 'bg-purple-600', 'bg-blue-600'],
    buttonGradient: 'from-indigo-600 to-purple-700',
    textColor: 'text-white',
    glassColor: 'bg-slate-900/85',
    isDark: true
  },
  forest: {
    name: 'forest',
    label: 'Mystic Forest',
    gradient: 'from-green-950 via-emerald-950 to-teal-900',
    accent: 'emerald',
    primaryColor: '#34d399', // emerald-400
    orbColors: ['bg-emerald-600', 'bg-green-700', 'bg-teal-600'],
    buttonGradient: 'from-emerald-600 to-green-600',
    textColor: 'text-emerald-50',
    glassColor: 'bg-emerald-950/85',
    isDark: true
  }
};

interface ThemeContextType {
  theme: ThemeConfig;
  setTheme: (theme: Theme) => void;
  availableThemes: ThemeConfig[];
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentTheme, setCurrentTheme] = useState<Theme>('calm');

  const value = {
    theme: themes[currentTheme],
    setTheme: setCurrentTheme,
    availableThemes: Object.values(themes)
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
