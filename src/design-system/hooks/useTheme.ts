/**
 * Theme Management Hook
 * 
 * Enhanced theme management with persistence, system preference detection,
 * and smooth transitions between light and dark modes.
 */

import { useEffect, useState, useCallback } from 'react';
import { useColorMode, useColorModeValue } from '@/components/ui/color-mode';
import { lightThemeColors, darkThemeColors } from '../tokens/colors';

export interface ThemeState {
  mode: 'light' | 'dark' | 'system';
  resolvedMode: 'light' | 'dark';
  isSystemMode: boolean;
  colors: typeof lightThemeColors | typeof darkThemeColors;
}

export interface ThemeActions {
  setLightMode: () => void;
  setDarkMode: () => void;
  setSystemMode: () => void;
  toggleMode: () => void;
  setMode: (mode: 'light' | 'dark' | 'system') => void;
}

const THEME_STORAGE_KEY = 'dreamplace-theme';

// Custom hook for enhanced theme management
export const useTheme = (): ThemeState & ThemeActions => {
  const { colorMode, setColorMode } = useColorMode();
  const [preferredMode, setPreferredMode] = useState<'light' | 'dark' | 'system'>('system');
  const [systemPreference, setSystemPreference] = useState<'light' | 'dark'>('light');

  // Get current theme colors based on resolved mode
  const colors = useColorModeValue(lightThemeColors, darkThemeColors);

  // Listen for system theme changes
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = (e: MediaQueryListEvent) => {
      setSystemPreference(e.matches ? 'dark' : 'light');
    };

    setSystemPreference(mediaQuery.matches ? 'dark' : 'light');
    mediaQuery.addEventListener('change', handleChange);

    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  // Load theme preference from storage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(THEME_STORAGE_KEY);
      if (stored && ['light', 'dark', 'system'].includes(stored)) {
        setPreferredMode(stored as 'light' | 'dark' | 'system');
      }
    } catch (error) {
      console.warn('Failed to load theme preference:', error);
    }
  }, []);

  // Save theme preference to storage
  const saveThemePreference = useCallback((mode: 'light' | 'dark' | 'system') => {
    try {
      localStorage.setItem(THEME_STORAGE_KEY, mode);
      setPreferredMode(mode);
    } catch (error) {
      console.warn('Failed to save theme preference:', error);
    }
  }, []);

  // Apply theme based on preference and system setting
  useEffect(() => {
    let targetMode: 'light' | 'dark';

    if (preferredMode === 'system') {
      targetMode = systemPreference;
    } else {
      targetMode = preferredMode;
    }

    if (colorMode !== targetMode) {
      setColorMode(targetMode);
    }
  }, [preferredMode, systemPreference, colorMode, setColorMode]);

  // Theme actions
  const setLightMode = useCallback(() => {
    saveThemePreference('light');
  }, [saveThemePreference]);

  const setDarkMode = useCallback(() => {
    saveThemePreference('dark');
  }, [saveThemePreference]);

  const setSystemMode = useCallback(() => {
    saveThemePreference('system');
  }, [saveThemePreference]);

  const setMode = useCallback((mode: 'light' | 'dark' | 'system') => {
    saveThemePreference(mode);
  }, [saveThemePreference]);

  const toggleMode = useCallback(() => {
    if (preferredMode === 'system') {
      // If in system mode, toggle based on current system preference
      setMode(systemPreference === 'light' ? 'dark' : 'light');
    } else {
      // Toggle between light and dark
      setMode(preferredMode === 'light' ? 'dark' : 'light');
    }
  }, [preferredMode, systemPreference, setMode]);

  const resolvedMode = preferredMode === 'system' ? systemPreference : preferredMode;

  return {
    // State
    mode: preferredMode,
    resolvedMode,
    isSystemMode: preferredMode === 'system',
    colors,
    
    // Actions
    setLightMode,
    setDarkMode,
    setSystemMode,
    setMode,
    toggleMode
  };
};

// Hook for getting theme-aware values
export const useThemeValue = <T>(lightValue: T, darkValue: T): T => {
  return useColorModeValue(lightValue, darkValue);
};

// Hook for theme-aware CSS variables
export const useThemeCSSVars = () => {
  const { resolvedMode, colors } = useTheme();
  
  return {
    '--bg-primary': colors.background.primary,
    '--bg-secondary': colors.background.secondary,
    '--text-primary': colors.text.primary,
    '--text-secondary': colors.text.secondary,
    '--border-primary': colors.border.primary,
    '--theme-mode': resolvedMode
  };
};

// Higher-order component for theme-aware components moved to separate file
// See: useThemeComponents.tsx