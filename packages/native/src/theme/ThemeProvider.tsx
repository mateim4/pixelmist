import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { defaultTheme, resolveTheme, themeNames } from '@pixelmist/tokens';
import type { ResolvedTheme, ThemeName } from '@pixelmist/tokens';

export interface ThemeContextValue {
  theme: ThemeName;
  /** Fully resolved token tree for the active theme (colors, component styles, type). */
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

export interface ThemeProviderProps {
  theme?: ThemeName;
  defaultTheme?: ThemeName;
  onThemeChange?: (t: ThemeName) => void;
  children?: React.ReactNode;
}

/**
 * Native counterpart of @pixelmist/react's ThemeProvider. There are no CSS
 * variables on native, so the provider resolves the token tree for the active
 * theme (resolveTheme) and hands it to every component via context.
 */
export function ThemeProvider({ theme, defaultTheme: initial = defaultTheme, onThemeChange, children }: ThemeProviderProps) {
  const [internal, setInternal] = useState<ThemeName>(initial);
  const current = theme ?? internal;
  const resolved = useMemo(() => resolveTheme(current), [current]);
  const setTheme = useCallback((t: ThemeName) => { setInternal(t); onThemeChange?.(t); }, [onThemeChange]);
  const toggleTheme = useCallback(() => setTheme(current === 'daylight' ? 'terminal' : 'daylight'), [current, setTheme]);
  const value = useMemo<ThemeContextValue>(() => ({ theme: current, resolved, setTheme, toggleTheme, themes: themeNames }), [current, resolved, setTheme, toggleTheme]);
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeContextValue {
  return useContext(ThemeContext);
}
