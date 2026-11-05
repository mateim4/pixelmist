import type { ResolvedTheme } from '@pixelmist/tokens';
import type { TextStyle } from 'react-native';

export type SpaceValue = number | string;

/** Loosen the deeply-readonly token tree for index access under noUncheckedIndexedAccess. */
export const asTokens = (o: unknown): Record<string, string | number> => o as Record<string, string | number>;

/** number = dp, string = spacing token name resolved against the active theme */
export const space = (t: ResolvedTheme, v: SpaceValue): number =>
  typeof v === 'number' ? v : ((t.space as Record<string, number>)[v] ?? 0);

export const textStyle = (t: ResolvedTheme, variant: string): TextStyle => {
  const s = asTokens(asTokens(t.text)[variant] ?? {});
  return {
    fontFamily: String(s.fontFamily ?? t.font.ui),
    fontSize: Number(s.fontSize ?? 16),
    fontWeight: String(s.fontWeight ?? 400) as TextStyle['fontWeight'],
    lineHeight: Number(s.lineHeight ?? 1.5) * Number(s.fontSize ?? 16),
    ...(s.letterSpacing !== undefined && { letterSpacing: Number(s.letterSpacing) }),
    ...(s.textTransform && { textTransform: String(s.textTransform) as TextStyle['textTransform'] }),
  };
};

export const toneColor = (t: ResolvedTheme, tone: string): string => {
  const c = t.color;
  switch (tone) {
    case 'muted': return c.fg.muted;
    case 'subtle': return c.fg.subtle;
    case 'disabled': return c.fg.disabled;
    case 'inverse': return c.fg.inverse;
    case 'accent': return c.accent.primary;
    case 'link': return c.fg.link;
    case 'success': return c.status.success;
    case 'info': return c.status.info;
    case 'warning': return c.status.warning;
    case 'danger': return c.status.danger;
    default: return c.fg.default;
  }
};
