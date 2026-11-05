import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { defaultTheme, themeNames } from '@pixelmist/tokens';
import type { ThemeName } from '@pixelmist/tokens';

export interface StorageLike {
  getItem: (key: string) => string | null;
  setItem: (key: string, value: string) => void;
}

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

const systemTheme = (): ThemeName =>
  typeof window !== 'undefined' && window.matchMedia?.('(prefers-color-scheme: dark)').matches
    ? 'terminal'
    : 'daylight';

export interface ThemeProviderProps {
  /** Controlled theme. */
  theme?: ThemeName;
  /** Initial theme when uncontrolled. */
  defaultTheme?: ThemeName;
  onThemeChange?: (t: ThemeName) => void;
  /** Follow the OS color scheme (overrides defaultTheme/storage when uncontrolled). */
  followSystem?: boolean;
  /** Persist the choice under this key. `storage` defaults to localStorage on web. */
  storageKey?: string;
  storage?: StorageLike;
  children?: React.ReactNode;
}

/**
 * Sets data-theme="<name>" on <html>. All component styling is driven by the
 * CSS custom properties that @pixelmist/tokens emits per [data-theme] block,
 * so switching themes is a pure attribute change — no re-render of styles.
 */
export function ThemeProvider({
  theme,
  defaultTheme: initial,
  onThemeChange,
  followSystem = false,
  storageKey,
  storage,
  children,
}: ThemeProviderProps) {
  const store: StorageLike | undefined = storage ?? (typeof window !== 'undefined' ? window.localStorage : undefined);

  const [internal, setInternal] = useState<ThemeName>(() => {
    if (followSystem) return systemTheme();
    if (storageKey && store) {
      const saved = store.getItem(storageKey);
      if (saved && (themeNames as string[]).includes(saved)) return saved as ThemeName;
    }
    return initial ?? defaultTheme;
  });
  const current = theme ?? internal;

  // follow the OS when asked (uncontrolled only)
  useEffect(() => {
    if (!followSystem || theme !== undefined) return;
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const onChange = () => setInternal(mq.matches ? 'terminal' : 'daylight');
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, [followSystem, theme]);

  useEffect(() => {
    document.documentElement.dataset.theme = current;
    if (storageKey && store) store.setItem(storageKey, current);
    onThemeChange?.(current);
  }, [current, storageKey, store, onThemeChange]);

  const setTheme = useCallback((t: ThemeName) => setInternal(t), []);
  const toggleTheme = useCallback(() => setInternal((c) => (c === 'daylight' ? 'terminal' : 'daylight')), []);

  const value = useMemo<ThemeContextValue>(
    () => ({ theme: current, setTheme, toggleTheme, themes: themeNames }),
    [current, setTheme, toggleTheme],
  );
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeContextValue {
  return useContext(ThemeContext);
}
