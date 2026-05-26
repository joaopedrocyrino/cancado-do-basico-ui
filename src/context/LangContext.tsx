import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';

export interface LanguageOption {
  /** The locale/language identifier persisted and returned to consumers (e.g. "pt", "en", "es", "pt-BR"). */
  code: string;
  /** Short label shown on the toggle button (e.g. "PT"). */
  label: string;
  /** Optional emoji/icon shown before the label (e.g. "🇧🇷"). */
  flag?: string;
  /** Accessible description (e.g. "Português"). Falls back to label. */
  ariaLabel?: string;
}

interface LangContextValue {
  lang: string;
  setLang: (value: string) => void;
}

const LangContext = createContext<LangContextValue | null>(null);

const STORAGE_KEY = 'lang-override';

function readStored(defaultLang: string): string {
  if (typeof window === 'undefined') return defaultLang;
  try {
    return window.localStorage.getItem(STORAGE_KEY) || defaultLang;
  } catch {
    return defaultLang;
  }
}

export interface LangProviderProps {
  children: ReactNode;
  /** Initial language used when no stored override exists. Defaults to "en". */
  defaultLang?: string;
}

export function LangProvider({ children, defaultLang = 'en' }: LangProviderProps) {
  const [lang, setLangState] = useState<string>(() => {
    const value = readStored(defaultLang);
    if (typeof document !== 'undefined') {
      document.documentElement.setAttribute('data-lang', value);
    }
    return value;
  });

  const setLang = useCallback((value: string) => {
    setLangState(value);
    try {
      window.localStorage.setItem(STORAGE_KEY, value);
    } catch {
      /* ignore storage errors (private mode etc.) */
    }
    document.documentElement.setAttribute('data-lang', value);
  }, []);

  const value = useMemo<LangContextValue>(() => ({ lang, setLang }), [lang, setLang]);

  return <LangContext.Provider value={value}>{children}</LangContext.Provider>;
}

export function useLang(): LangContextValue {
  const ctx = useContext(LangContext);
  if (!ctx) throw new Error('useLang must be used within LangProvider');
  return ctx;
}
