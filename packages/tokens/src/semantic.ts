/**
 * Tier 2 — semantic tokens. One object per theme; values are primitives or "{ref}" aliases.
 * Themes: "daylight" (Mistral marketing light) and "terminal" (dark, Vibe CLI surfaces).
 */
export interface SemanticColorTokens {
  bg: {
    canvas: string;
    surface: string;
    raised: string;
    cream: string;
    creamSoft: string;
    inverse: string;
    code: string;
    overlay: string;
  };
  fg: {
    default: string;
    muted: string;
    subtle: string;
    disabled: string;
    inverse: string;
    onAccent: string;
    link: string;
  };
  accent: { primary: string; primaryHover: string; primaryActive: string; soft: string; softHover: string };
  border: { default: string; soft: string; strong: string; inverse: string; accent: string; onCream: string };
  status: {
    success: string;
    info: string;
    warning: string;
    danger: string;
    successSoft: string;
    infoSoft: string;
    warningSoft: string;
    dangerSoft: string;
    onDanger: string;
  };
  /**
   * The four semantic tones — "colour means state". One-to-one mapping to the
   * legacy status hues: attention = warning, progress = info, settled = success,
   * inactive = neutral. Each tone has surface (soft bg), border, text (fg on
   * surface) and strong (solid bg) + onStrong (fg on strong). A count of zero is
   * never toned — zero renders as inactive/neutral only.
   */
  tones: {
    attention: ToneTokens;
    progress: ToneTokens;
    settled: ToneTokens;
    inactive: ToneTokens;
  };
  /** Data-viz tokens: categorical palette (agents), sequential ramp (progress), grid/axis. */
  dataviz: {
    categorical: [string, string, string, string, string, string, string, string];
    sequential: [string, string, string, string, string, string];
    grid: string;
    axis: string;
    axisText: string;
  };
  gradient: { stripe: string; hero: string };
}

export interface ToneTokens {
  surface: string;
  border: string;
  text: string;
  strong: string;
  onStrong: string;
}

/** The signature accent band: violet → indigo → blue → ice (the "dusk sweep", from dusk/blue scale values). */
export const STRIPE_GRADIENT =
  'linear-gradient(90deg, #2E1065 0%, #4C1D95 18%, #6D28D9 36%, #8B5CF6 54%, #0EA5E9 72%, #7DD3FC 88%, #E0F2FE 100%)';
export const HERO_GRADIENT = 'linear-gradient(135deg, #8B5CF6 0%, #6D28D9 55%, #0EA5E9 100%)';

export const daylight: SemanticColorTokens = {
  bg: {
    canvas: '{neutral.white}',
    surface: '{neutral.surface}',
    raised: '{neutral.white}',
    cream: '{cream.DEFAULT}',
    creamSoft: '{cream.light}',
    inverse: '{ink.DEFAULT}',
    code: '{neutral.code}',
    overlay: 'rgba(31, 31, 31, 0.48)',
  },
  fg: {
    default: '{ink.DEFAULT}',
    muted: '{ink.steel}',
    subtle: '#6B6B6B',
    disabled: '{ink.muted}',
    inverse: '{neutral.white}',
    onAccent: '{neutral.white}',
    link: '{dusk.900}',
  },
  accent: {
    primary: '{dusk.700}',
    primaryHover: '{dusk.800}',
    primaryActive: '{dusk.950}',
    soft: '#F1EDFE',
    softHover: '#E6DEFC',
  },
  border: {
    default: '{neutral.hairline}',
    soft: '{neutral.hairlineSoft}',
    strong: '{neutral.hairlineStrong}',
    inverse: 'rgba(255, 255, 255, 0.16)',
    accent: '{dusk.700}',
    onCream: '{cream.border}',
  },
  status: {
    success: '{status.success}',
    info: '#0067B8',
    warning: '#8A5A00',
    danger: '#C40E00',
    successSoft: '#E5F4EC',
    infoSoft: '#E3F1FC',
    warningSoft: '#FFF4D6',
    dangerSoft: '#FDE7E5',
    onDanger: '{neutral.white}',
  },
  tones: {
    attention: {
      surface: '#FFF4D6',
      border: '#E8C766',
      text: '#8A5A00',
      strong: '#8A5A00',
      onStrong: '{neutral.white}',
    },
    progress: {
      surface: '#E3F1FC',
      border: '#B3D7F5',
      text: '#0067B8',
      strong: '#0067B8',
      onStrong: '{neutral.white}',
    },
    settled: {
      surface: '#E5F4EC',
      border: '#BFE3CD',
      text: '{status.success}',
      strong: '{status.success}',
      onStrong: '{neutral.white}',
    },
    inactive: {
      surface: '#F0F0F0',
      border: '{neutral.hairline}',
      text: '{ink.steel}',
      strong: '{ink.steel}',
      onStrong: '{neutral.white}',
    },
  },
  dataviz: {
    categorical: ['#8B5CF6', '#0284C7', '#16A34A', '#D97706', '#DC2645', '#0D9488', '#DB2777', '#4D7C0F'],
    sequential: ['#F1EDFE', '#DDD6FE', '#A78BFA', '#7C3AED', '#5B21B6', '#2E1065'],
    grid: '{neutral.hairlineSoft}',
    axis: '{neutral.hairlineStrong}',
    axisText: '{ink.steel}',
  },
  gradient: {
    stripe: STRIPE_GRADIENT,
    hero: HERO_GRADIENT,
  },
};

export const terminal: SemanticColorTokens = {
  bg: {
    canvas: '#161618',
    surface: '#1C1C1E',
    raised: '#232327',
    cream: '#262117',
    creamSoft: '#1F1C15',
    inverse: '#F5F4F0',
    code: '#0F0F10',
    overlay: 'rgba(0, 0, 0, 0.60)',
  },
  fg: {
    default: '#F2F1EC',
    muted: '{ink.muted}',
    subtle: '#9E9E9E',
    disabled: '{ink.steel}',
    inverse: '{ink.DEFAULT}',
    onAccent: '{neutral.white}',
    link: '{dusk.400}',
  },
  accent: {
    primary: '{dusk.500}',
    primaryHover: '{dusk.400}',
    primaryActive: '{dusk.300}',
    soft: 'rgba(139, 92, 246, 0.14)',
    softHover: 'rgba(139, 92, 246, 0.22)',
  },
  border: {
    default: '#2C2C2E',
    soft: '#242426',
    strong: '#3D3D3F',
    inverse: 'rgba(255, 255, 255, 0.16)',
    accent: '{dusk.500}',
    onCream: '#4A3F28',
  },
  status: {
    success: '#3FB97C',
    info: '{blue.400}',
    warning: '#FFB224',
    danger: '#FF5A45',
    successSoft: 'rgba(63, 185, 124, 0.14)',
    infoSoft: 'rgba(56, 189, 248, 0.14)',
    warningSoft: 'rgba(255, 178, 36, 0.14)',
    dangerSoft: 'rgba(255, 90, 69, 0.14)',
    onDanger: '#161618',
  },
  tones: {
    attention: {
      surface: 'rgba(255, 178, 36, 0.14)',
      border: 'rgba(255, 178, 36, 0.45)',
      text: '#FFB224',
      strong: '#FFB224',
      onStrong: '#161618',
    },
    progress: {
      surface: 'rgba(56, 189, 248, 0.14)',
      border: 'rgba(56, 189, 248, 0.45)',
      text: '{blue.400}',
      strong: '{blue.400}',
      onStrong: '{blue.950}',
    },
    settled: {
      surface: 'rgba(63, 185, 124, 0.14)',
      border: 'rgba(63, 185, 124, 0.45)',
      text: '#3FB97C',
      strong: '#3FB97C',
      onStrong: '#06231A',
    },
    inactive: {
      surface: '#242426',
      border: '#2C2C2E',
      text: '#9E9E9E',
      strong: '#9E9E9E',
      onStrong: '#161618',
    },
  },
  dataviz: {
    categorical: ['#8B5CF6', '#38BDF8', '#4ADE80', '#FBBF24', '#FB7185', '#2DD4BF', '#F472B6', '#A3E635'],
    sequential: ['#2E1065', '#4C1D95', '#6D28D9', '#A78BFA', '#C4B5FD', '#EDE9FE'],
    grid: '#242426',
    axis: '#3D3D3F',
    axisText: '#9E9E9E',
  },
  gradient: {
    stripe: STRIPE_GRADIENT,
    hero: HERO_GRADIENT,
  },
};

export const themes = { daylight, terminal } as const;
export type ThemeName = keyof typeof themes;
export const themeNames = Object.keys(themes) as ThemeName[];
export const defaultTheme: ThemeName = 'daylight';
