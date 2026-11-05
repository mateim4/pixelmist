/**
 * Tier 2 — semantic tokens. One object per theme; values are primitives or "{ref}" aliases.
 * Themes: "daylight" (Mistral marketing light) and "terminal" (dark, Vibe CLI surfaces).
 */
export interface SemanticColorTokens {
  bg: { canvas: string; surface: string; raised: string; cream: string; creamSoft: string; inverse: string; code: string; overlay: string };
  fg: { default: string; muted: string; subtle: string; disabled: string; inverse: string; onAccent: string; link: string };
  accent: { primary: string; primaryHover: string; primaryActive: string; soft: string; softHover: string };
  border: { default: string; soft: string; strong: string; inverse: string; accent: string; onCream: string };
  status: { success: string; info: string; warning: string; danger: string; successSoft: string; infoSoft: string; warningSoft: string; dangerSoft: string };
  gradient: { sunset: string; hero: string };
}

export const daylight: SemanticColorTokens = {
  bg: { canvas: '{neutral.white}', surface: '{neutral.surface}', raised: '{neutral.white}', cream: '{cream.DEFAULT}', creamSoft: '{cream.light}', inverse: '{ink.DEFAULT}', code: '{neutral.code}', overlay: 'rgba(31, 31, 31, 0.48)' },
  fg: { default: '{ink.DEFAULT}', muted: '{ink.steel}', subtle: '{ink.stone}', disabled: '{ink.muted}', inverse: '{neutral.white}', onAccent: '{neutral.white}', link: '{sunset.700}' },
  accent: { primary: '{sunset.700}', primaryHover: '{sunset.800}', primaryActive: '{sunset.950}', soft: '#FFF1E4', softHover: '#FFE5D3' },
  border: { default: '{neutral.hairline}', soft: '{neutral.hairlineSoft}', strong: '{neutral.hairlineStrong}', inverse: 'rgba(255, 255, 255, 0.16)', accent: '{sunset.700}', onCream: '{cream.border}' },
  status: { success: '{status.success}', info: '{status.info}', warning: '{status.warning}', danger: '{status.danger}', successSoft: '#E5F4EC', infoSoft: '#E3F1FC', warningSoft: '#FFF4D6', dangerSoft: '#FDE7E5' },
  gradient: {
    sunset: 'linear-gradient(90deg, #C4001D 0%, #E51300 18%, #FA500F 36%, #FF8204 54%, #FFAF01 72%, #FFD900 88%, #FFF8E0 100%)',
    hero: 'linear-gradient(135deg, #FFA110 0%, #FF8A00 60%, #FA500F 100%)',
  },
};

export const terminal: SemanticColorTokens = {
  bg: { canvas: '#161618', surface: '#1C1C1E', raised: '#232327', cream: '#262117', creamSoft: '#1F1C15', inverse: '#F5F4F0', code: '#0F0F10', overlay: 'rgba(0, 0, 0, 0.60)' },
  fg: { default: '#F2F1EC', muted: '{ink.muted}', subtle: '{ink.stone}', disabled: '{ink.steel}', inverse: '{ink.DEFAULT}', onAccent: '{neutral.white}', link: '{sunset.500}' },
  accent: { primary: '{sunset.600}', primaryHover: '#FF9435', primaryActive: '{sunset.400}', soft: 'rgba(255, 130, 4, 0.14)', softHover: 'rgba(255, 130, 4, 0.22)' },
  border: { default: '#2C2C2E', soft: '#242426', strong: '#3D3D3F', inverse: 'rgba(255, 255, 255, 0.16)', accent: '{sunset.600}', onCream: '#4A3F28' },
  status: { success: '#3FB97C', info: '{blue.300}', warning: '{sunset.400}', danger: '#FF5A45', successSoft: 'rgba(63, 185, 124, 0.14)', infoSoft: 'rgba(85, 179, 251, 0.14)', warningSoft: 'rgba(255, 175, 1, 0.14)', dangerSoft: 'rgba(255, 90, 69, 0.14)' },
  gradient: {
    sunset: 'linear-gradient(90deg, #C4001D 0%, #E51300 18%, #FA500F 36%, #FF8204 54%, #FFAF01 72%, #FFD900 88%, #FFF8E0 100%)',
    hero: 'linear-gradient(135deg, #FFA110 0%, #FF8A00 60%, #FA500F 100%)',
  },
};

export const themes = { daylight, terminal } as const;
export type ThemeName = keyof typeof themes;
export const themeNames = Object.keys(themes) as ThemeName[];
export const defaultTheme: ThemeName = 'daylight';
