import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { Appearance } from 'react-native';
import { defaultTheme, resolveTheme, themeNames } from '@pixelmist/tokens';
import type { ResolvedTheme, ThemeName } from '@pixelmist/tokens';

export interface StorageLike {
  getItem: (key: string) => string | Promise<string | null>;
  setItem: (key: string, value: string) => void | Promise<void>;
}

export interface ThemeContextValue {
  theme: ThemeName;
  resolved: ResolvedTheme;
  setTheme: (t: ThemeName) => void;
  toggleTheme: () => void;
  themes: ThemeName[];
}

const ThemeContext = createContext<ThemeContextValue>({
  theme: defaultTheme,
  resolved: resolveTheme(defaultTheme),
  setTheme: () => undefined,
  toggleTheme: () => undefined,
  themes: themeNames,
});

const systemTheme = (): ThemeName => (Appearance.getColorScheme() === 'dark' ? 'terminal' : 'daylight');

export interface ThemeProviderProps {
  theme?: ThemeName;
  defaultTheme?: ThemeName;
  onThemeChange?: (t: ThemeName) => void;
  /** Follow the OS appearance (e.g. AsyncStorage-backed storage can be injected via `storage`). */
  followSystem?: boolean;
  storageKey?: string;
  /** Inject AsyncStorage (or any KV) — keeps this package dependency-free. */
  storage?: StorageLike;
  children?: React.ReactNode;
}

export function ThemeProvider({
  theme,
  defaultTheme: initial,
  onThemeChange,
  followSystem = false,
  storageKey,
  storage,
  children,
}: ThemeProviderProps) {
  const [internal, setInternal] = useState<ThemeName>(followSystem ? systemTheme() : (initial ?? defaultTheme));
  const [hydrated, setHydrated] = useState(!storageKey || !storage);

  // hydrate persisted theme (async storage)
  useEffect(() => {
    if (!storageKey || !storage) return;
    Promise.resolve(storage.getItem(storageKey)).then((saved) => {
      if (saved && (themeNames as string[]).includes(saved)) setInternal(saved as ThemeName);
      setHydrated(true);
    });
  }, [storageKey, storage]);

  // follow OS
  useEffect(() => {
    if (!followSystem || theme !== undefined) return;
    const sub = Appearance.addChangeListener(({ colorScheme }) =>
      setInternal(colorScheme === 'dark' ? 'terminal' : 'daylight'),
    );
    return () => sub.remove();
  }, [followSystem, theme]);

  const current = theme ?? internal;
  const resolved = useMemo(() => resolveTheme(current), [current]);

  useEffect(() => {
    if (storageKey && storage && hydrated) void storage.setItem(storageKey, current);
    onThemeChange?.(current);
  }, [current, storageKey, storage, hydrated, onThemeChange]);

  const setTheme = useCallback((t: ThemeName) => setInternal(t), []);
  const toggleTheme = useCallback(
    () => setTheme(current === 'daylight' ? 'terminal' : 'daylight'),
    [current, setTheme],
  );
  const value = useMemo<ThemeContextValue>(
    () => ({ theme: current, resolved, setTheme, toggleTheme, themes: themeNames }),
    [current, resolved, setTheme, toggleTheme],
  );
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeContextValue {
  return useContext(ThemeContext);
}
