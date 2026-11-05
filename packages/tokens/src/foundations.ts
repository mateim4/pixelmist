/** Tier 1 — spacing, radius, elevation, motion, layout. */

export const spacing = {
  xxs: 4,
  xs: 8,
  sm: 12,
  md: 16,
  lg: 20,
  xl: 24,
  xxl: 32,
  xxxl: 40,
  'section-sm': 48,
  section: 64,
  'section-lg': 96,
  hero: 120,
} as const;

export const radius = {
  xs: 4,
  sm: 6,
  md: 8,
  lg: 12,
  xl: 16,
  xxl: 20,
  full: 9999,
} as const;

export const elevation = {
  shadow: {
    none: 'none',
    '1': 'rgba(0, 0, 0, 0.04) 0px 1px 2px 0px',
    '2': 'rgba(0, 0, 0, 0.04) 0px 4px 12px 0px',
    '3': 'rgba(0, 0, 0, 0.08) 0px 12px 24px -4px',
    '4': 'rgba(0, 0, 0, 0.12) 0px 16px 48px -8px',
  },
  focusRingColor: '{color.accent.primary}',
  focusRingWidth: 2,
  focusRingOffset: 2,
} as const;

export const motion = {
  duration: { instant: 80, fast: 120, normal: 200, slow: 320 },
  easing: {
    standard: 'cubic-bezier(0.2, 0, 0, 1)',
    emphasized: 'cubic-bezier(0.32, 0.72, 0, 1)',
    entrance: 'cubic-bezier(0, 0, 0.2, 1)',
    spring: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
  },
} as const;

export const layout = {
  breakpoints: { sm: 640, md: 768, lg: 1024, xl: 1280 },
  container: { maxWidth: 1280, gutter: 32 },
  nav: { height: 64 },
  zIndex: { base: 0, sticky: 100, overlay: 200, modal: 300, popover: 400, toast: 500, tooltip: 600 },
} as const;
