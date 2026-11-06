/**
 * Tier 1 — primitives. Raw, theme-independent values.
 * `sunset` is kept as the Mistral.ai reference palette (see docs/RESEARCH.md);
 * pixelmist's own accent is `dusk`/`blue` (blue → indigo → violet).
 * Cream, ink and hairlines verified against mistral.ai.
 */
export const palette = {
  sunset: {
    '100': '#FFE000',
    '200': '#FFBD00',
    '300': '#FFD900',
    '400': '#FFAF01',
    '500': '#FF8A00',
    '600': '#FF8204',
    '700': '#FA500F',
    '800': '#E51300',
    '900': '#C4001D',
    '950': '#CC3A05',
  },
  dusk: {
    '100': '#EDE9FE',
    '200': '#DDD6FE',
    '300': '#C4B5FD',
    '400': '#A78BFA',
    '500': '#8B5CF6',
    '600': '#7C3AED',
    '700': '#6D28D9',
    '800': '#5B21B6',
    '900': '#4C1D95',
    '950': '#2E1065',
  },
  cream: { DEFAULT: '#FFF8E0', light: '#FFFAEB', deep: '#FFF0C2', border: '#E6D5A8', block: '#FFE295' },
  ink: {
    DEFAULT: '#1F1F1F',
    tint: '#3D3D3D',
    charcoal: '#2C2C2C',
    slate: '#4A4A4A',
    steel: '#6A6A6A',
    stone: '#767676',
    muted: '#A8A8A8',
  },
  neutral: {
    white: '#FFFFFF',
    black: '#000000',
    canvas: '#FFFFFF',
    surface: '#FAFAFA',
    hairline: '#E5E5E5',
    hairlineSoft: '#EDEDED',
    hairlineStrong: '#C7C7C7',
    code: '#1C1C1E',
  },
  blue: {
    '100': '#E0F2FE',
    '200': '#BAE6FD',
    '300': '#7DD3FC',
    '400': '#38BDF8',
    '500': '#0EA5E9',
    '600': '#0284C7',
    '700': '#0369A1',
    '800': '#075985',
    '900': '#0C4A6E',
    '950': '#082F49',
  },
  status: { success: '#0E7A4B', info: '#0067B8', warning: '#8A5A00', danger: '#C40E00' },
} as const;

export type Palette = typeof palette;
