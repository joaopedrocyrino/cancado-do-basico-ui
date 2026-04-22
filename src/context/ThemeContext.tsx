import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';

export type ThemeOverride = 'light' | 'dark' | 'system';
type ColorScheme = 'light' | 'dark';

interface ThemeContextValue {
  theme: ColorScheme;
  override: ThemeOverride;
  setOverride: (value: ThemeOverride) => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

const STORAGE_KEY = 'theme-override';

function getSystemTheme(): ColorScheme {
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function readStoredOverride(): ThemeOverride {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored === 'light' || stored === 'dark' || stored === 'system') return stored;
  return 'system';
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [override, setOverrideState] = useState<ThemeOverride>(readStoredOverride);
  const [systemTheme, setSystemTheme] = useState<ColorScheme>(getSystemTheme);

  const theme: ColorScheme = override === 'system' ? systemTheme : override;

  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    function handleChange(e: MediaQueryListEvent) {
      setSystemTheme(e.matches ? 'dark' : 'light');
    }
    mq.addEventListener('change', handleChange);
    return () => { mq.removeEventListener('change', handleChange); };
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  function setOverride(value: ThemeOverride) {
    setOverrideState(value);
    localStorage.setItem(STORAGE_KEY, value);
  }

  return (
    <ThemeContext.Provider value={{ theme, override, setOverride }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
}
