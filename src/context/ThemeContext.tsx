import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';

export type ThemeOverride = 'light' | 'dark' | 'system';
type ColorScheme = 'light' | 'dark';

export type BrandAccent = 'blue' | 'indigo' | 'purple' | 'pink' | 'orange' | 'green';

export const BRAND_ACCENTS: BrandAccent[] = ['blue', 'indigo', 'purple', 'pink', 'orange', 'green'];

interface ThemeContextValue {
  theme: ColorScheme;
  override: ThemeOverride;
  setOverride: (value: ThemeOverride) => void;
  accent: BrandAccent;
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

export interface ThemeProviderProps {
  children: ReactNode;
  /**
   * Brand accent color applied across the library (focus rings, active nav,
   * primary buttons, links). Defaults to `'blue'`. Pick from 6 built-in tokens —
   * pass any other value via CSS by setting `--color-accent` yourself.
   */
  accent?: BrandAccent;
}

export function ThemeProvider({ children, accent = 'blue' }: ThemeProviderProps) {
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

  useEffect(() => {
    document.documentElement.setAttribute('data-accent', accent);
  }, [accent]);

  function setOverride(value: ThemeOverride) {
    setOverrideState(value);
    localStorage.setItem(STORAGE_KEY, value);
  }

  return (
    <ThemeContext.Provider value={{ theme, override, setOverride, accent }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
}
