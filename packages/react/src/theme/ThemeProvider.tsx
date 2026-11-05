import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { defaultTheme, themeNames } from '@pixelmist/tokens';
import type { ThemeName } from '@pixelmist/tokens';

export interface ThemeContextValue {
  theme: ThemeName;
  setTheme: (t: ThemeName) => void;
  toggleTheme: () => void;
  themes: ThemeName[];
}

const ThemeContext = createContext<ThemeContextValue>({
  theme: defaultTheme,
  setTheme: () => undefined,
  toggleTheme: () => undefined,
  themes: themeNames,
});

export interface ThemeProviderProps {
  /** Controlled theme. */
  theme?: ThemeName;
  /** Initial theme when uncontrolled. */
  defaultTheme?: ThemeName;
  onThemeChange?: (t: ThemeName) => void;
  /** Persist the choice in localStorage under this key (web only). */
  storageKey?: string;
  children?: React.ReactNode;
}

/**
 * Sets data-theme="<name>" on <html>. All component styling is driven by the
 * CSS custom properties that @pixelmist/tokens emits per [data-theme] block,
 * so switching themes is a pure attribute change — no re-render of styles.
 */
export function ThemeProvider({ theme, defaultTheme: initial = defaultTheme, onThemeChange, storageKey, children }: ThemeProviderProps) {
  const [internal, setInternal] = useState<ThemeName>(() => {
    if (typeof window !== 'undefined' && storageKey) {
      const saved = window.localStorage.getItem(storageKey);
      if (saved && (themeNames as string[]).includes(saved)) return saved as ThemeName;
    }
    return initial;
  });
  const current = theme ?? internal;

  useEffect(() => {
    document.documentElement.dataset.theme = current;
    if (storageKey) window.localStorage.setItem(storageKey, current);
    onThemeChange?.(current);
  }, [current, storageKey, onThemeChange]);

  const setTheme = useCallback((t: ThemeName) => setInternal(t), []);
  const toggleTheme = useCallback(
    () => setInternal((c) => (c === 'daylight' ? 'terminal' : 'daylight')),
    [],
  );

  const value = useMemo<ThemeContextValue>(
    () => ({ theme: current, setTheme, toggleTheme, themes: themeNames }),
    [current, setTheme, toggleTheme],
  );
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeContextValue {
  return useContext(ThemeContext);
}
