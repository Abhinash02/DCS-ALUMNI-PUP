import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import API from '../api/api';

export const THEME_PALETTES = {
  maroon: {
    id: 'maroon',
    name: 'Ruby Crimson / Maroon (Default)',
    subtitle: 'Heritage Crimson & Academic Stole Maroon (Official)',
    primary: '#b91c1c',
    darkBlue: '#881337',
    lightBlue: '#fecdd3',
    hoverBlue: '#fff1f2',
    steelBlue: '#fca5a5',
    accent: '#e11d48',
    darkBlueAlt: '#7f1d1d',
    lightBlueAlt: '#fb7185',
    colorCircle: '#b91c1c',
  },
  default: {
    id: 'default',
    name: 'Ruby Crimson / Maroon (Default)',
    subtitle: 'Heritage Crimson & Academic Stole Maroon (Official)',
    primary: '#b91c1c',
    darkBlue: '#881337',
    lightBlue: '#fecdd3',
    hoverBlue: '#fff1f2',
    steelBlue: '#fca5a5',
    accent: '#e11d48',
    darkBlueAlt: '#7f1d1d',
    lightBlueAlt: '#fb7185',
    colorCircle: '#b91c1c',
  },
  blue: {
    id: 'blue',
    name: 'Royal DCS Blue',
    subtitle: 'Classic Punjabi University Blue',
    primary: '#005b96',
    darkBlue: '#2E5090',
    lightBlue: '#aec8e2',
    hoverBlue: '#eaf1fe',
    steelBlue: '#B0C4DE',
    accent: '#00BFFF',
    darkBlueAlt: '#1E3A8A',
    lightBlueAlt: '#60A5FA',
    colorCircle: '#005b96',
  },
  emerald: {
    id: 'emerald',
    name: 'PU Green Campus',
    subtitle: 'Lush Emerald & University Botanical Theme',
    primary: '#059669',
    darkBlue: '#065f46',
    lightBlue: '#a7f3d0',
    hoverBlue: '#ecfdf5',
    steelBlue: '#6ee7b7',
    accent: '#10b981',
    darkBlueAlt: '#064e3b',
    lightBlueAlt: '#34d399',
    colorCircle: '#059669',
  },
  purple: {
    id: 'purple',
    name: 'Imperial Purple',
    subtitle: 'Prestigious Royal Convocation Purple',
    primary: '#7c3aed',
    darkBlue: '#5b21b6',
    lightBlue: '#ddd6fe',
    hoverBlue: '#f5f3ff',
    steelBlue: '#c4b5fd',
    accent: '#8b5cf6',
    darkBlueAlt: '#4c1d95',
    lightBlueAlt: '#a78bfa',
    colorCircle: '#7c3aed',
  },
  ocean: {
    id: 'ocean',
    name: 'Cyber Cyan & Ocean',
    subtitle: 'Modern Dynamic Tech & Computing Indigo',
    primary: '#0284c7',
    darkBlue: '#0c4a6e',
    lightBlue: '#bae6fd',
    hoverBlue: '#f0f9ff',
    steelBlue: '#7dd3fc',
    accent: '#38bdf8',
    darkBlueAlt: '#075985',
    lightBlueAlt: '#38bdf8',
    colorCircle: '#0284c7',
  },
  amber: {
    id: 'amber',
    name: 'Golden Jubilee Amber',
    subtitle: 'Warm Golden Alumni Reunion & Bronze Theme',
    primary: '#d97706',
    darkBlue: '#78350f',
    lightBlue: '#fde68a',
    hoverBlue: '#fffbeb',
    steelBlue: '#fcd34d',
    accent: '#f59e0b',
    darkBlueAlt: '#92400e',
    lightBlueAlt: '#fbbf24',
    colorCircle: '#d97706',
  },
};

const applyPaletteVariables = (palette) => {
  const root = document.documentElement;
  root.style.setProperty('--portal-primary', palette.primary);
  root.style.setProperty('--portal-dark-blue', palette.darkBlue);
  root.style.setProperty('--portal-light-blue', palette.lightBlue);
  root.style.setProperty('--portal-hover-blue', palette.hoverBlue);
  root.style.setProperty('--portal-steel-blue', palette.steelBlue);
  root.style.setProperty('--portal-accent', palette.accent);
  root.style.setProperty('--portal-dark-blue-alt', palette.darkBlueAlt);
  root.style.setProperty('--portal-light-blue-alt', palette.lightBlueAlt);
};

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [isDark, setIsDark] = useState(() => {
    try {
      const saved = localStorage.getItem('dcs_theme');
      if (saved) {
        return saved === 'dark';
      }
      return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    } catch {
      return false;
    }
  });

  const [activePaletteId, setActivePaletteId] = useState(() => {
    try {
      const saved = localStorage.getItem('dcs_portal_color_theme');
      if (!saved || saved === 'default') {
        return 'maroon';
      }
      return saved;
    } catch {
      return 'maroon';
    }
  });

  // Synchronize with global theme from backend (MongoDB)
  useEffect(() => {
    let isMounted = true;

    const fetchGlobalTheme = async () => {
      // Don't poll if device is offline
      if (typeof navigator !== 'undefined' && !navigator.onLine) {
        return;
      }
      try {
        const res = await API.get('/theme');
        if (res.data && res.data.activePaletteId && isMounted) {
          const remotePalette = res.data.activePaletteId;
          if (THEME_PALETTES[remotePalette]) {
            setActivePaletteId((prev) => {
              if (prev !== remotePalette) {
                const pal = THEME_PALETTES[remotePalette];
                applyPaletteVariables(pal);
                try {
                  localStorage.setItem('dcs_portal_color_theme', remotePalette);
                } catch {}
                return remotePalette;
              }
              return prev;
            });
          }
        }
      } catch (err) {
        // Silently use cached/default theme if backend is unreachable
      }
    };

    fetchGlobalTheme();

    // Re-check when window or tab regains focus
    const handleVisibility = () => {
      if (document.visibilityState === 'visible') {
        fetchGlobalTheme();
      }
    };
    document.addEventListener('visibilitychange', handleVisibility);

    // Sync periodically every 45 seconds for real-time live synchronization across visitors
    const interval = setInterval(fetchGlobalTheme, 45000);

    return () => {
      isMounted = false;
      document.removeEventListener('visibilitychange', handleVisibility);
      clearInterval(interval);
    };
  }, []);

  // Apply dark mode class
  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add('dark');
      try {
        localStorage.setItem('dcs_theme', 'dark');
      } catch {}
    } else {
      root.classList.remove('dark');
      try {
        localStorage.setItem('dcs_theme', 'light');
      } catch {}
    }
  }, [isDark]);

  // Apply color palette variables whenever activePaletteId changes
  useEffect(() => {
    const palette = THEME_PALETTES[activePaletteId] || THEME_PALETTES.maroon;
    applyPaletteVariables(palette);
    try {
      localStorage.setItem('dcs_portal_color_theme', activePaletteId);
    } catch {}
  }, [activePaletteId]);

  const toggleTheme = () => {
    setIsDark((prev) => !prev);
  };

  // Change color palette with IMMEDIATE local effect + instant backend broadcast to all visitors
  const changeColorPalette = useCallback(async (paletteId) => {
    if (THEME_PALETTES[paletteId]) {
      // 1. Immediate local effect (0ms delay for user/admin)
      setActivePaletteId(paletteId);
      const palette = THEME_PALETTES[paletteId];
      applyPaletteVariables(palette);
      try {
        localStorage.setItem('dcs_portal_color_theme', paletteId);
      } catch {}

      // 2. Broadcast and persist to MongoDB so live site (vercel & vishalpup.in) immediately updates for all visitors!
      try {
        await API.put('/theme', { paletteId });
      } catch (err) {
        console.warn('Theme updated locally. Could not sync with backend:', err.message);
      }
    }
  }, []);

  const resetToDefaultColor = useCallback(async () => {
    await changeColorPalette('maroon');
  }, [changeColorPalette]);

  const activePalette = THEME_PALETTES[activePaletteId] || THEME_PALETTES.maroon;

  return (
    <ThemeContext.Provider value={{ 
      isDark, 
      toggleTheme, 
      activePaletteId, 
      activePalette, 
      changeColorPalette, 
      resetToDefaultColor,
      palettes: THEME_PALETTES
    }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    return { 
      isDark: false, 
      toggleTheme: () => {}, 
      activePaletteId: 'maroon',
      activePalette: THEME_PALETTES.maroon,
      changeColorPalette: () => {},
      resetToDefaultColor: () => {},
      palettes: THEME_PALETTES
    };
  }
  return context;
};

export default ThemeContext;
