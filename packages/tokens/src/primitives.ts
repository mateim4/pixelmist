/**
 * Tier 1 — primitives. Raw, theme-independent values.
 * Palette verified against mistral.ai (sunset gradient, cream, ink, hairlines).
 */
export const palette = {
  sunset: {
    '100': '#FFE000', '200': '#FFBD00', '300': '#FFD900', '400': '#FFAF01',
    '500': '#FF8A00', '600': '#FF8204', '700': '#FA500F', '800': '#E51300',
    '900': '#C4001D', '950': '#CC3A05',
  },
  cream: { DEFAULT: '#FFF8E0', light: '#FFFAEB', deep: '#FFF0C2', border: '#E6D5A8', block: '#FFE295' },
  ink: { DEFAULT: '#1F1F1F', tint: '#3D3D3D', charcoal: '#2C2C2C', slate: '#4A4A4A', steel: '#6A6A6A', stone: '#8A8A8A', muted: '#A8A8A8' },
  neutral: { white: '#FFFFFF', black: '#000000', canvas: '#FFFFFF', surface: '#FAFAFA', hairline: '#E5E5E5', hairlineSoft: '#EDEDED', hairlineStrong: '#C7C7C7', code: '#1C1C1E' },
  blue: { '300': '#55B3FB', '500': '#0082E6', '700': '#044298' },
  grape: { '700': '#6A0F7D' },
  status: { success: '#0E7A4B', info: '#0082E6', warning: '#9A6700', danger: '#E51300' },
} as const;

export type Palette = typeof palette;
