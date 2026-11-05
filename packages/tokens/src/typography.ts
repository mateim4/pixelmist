/** Tier 1 — typography primitives: font stacks + type scale (Mistral editorial pairing). */
export const fonts = {
  display: '"PP Editorial New", "PP Editorial Old", Georgia, "Times New Roman", serif',
  ui: 'Inter, ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
  mono: '"JetBrains Mono", "SF Mono", SFMono-Regular, Menlo, Consolas, "Liberation Mono", monospace',
} as const;

export type FontStack = keyof typeof fonts;

export interface TextStyle {
  fontFamily: string;
  fontSize: number;
  fontWeight: number;
  lineHeight: number;
  letterSpacing?: number;
  textTransform?: string;
  /** Responsive bounds for display sizes: clamp(min, vw, max) in CSS. */
  responsive?: { min: number; max: number };
}

export const textScale = {
  'hero-display':    { fontFamily: '{font.display}', fontSize: 84, fontWeight: 400, lineHeight: 1.05, letterSpacing: -1.5, responsive: { min: 44, max: 84 } },
  'display-lg':      { fontFamily: '{font.display}', fontSize: 64, fontWeight: 400, lineHeight: 1.10, letterSpacing: -1,   responsive: { min: 40, max: 64 } },
  'heading-1':       { fontFamily: '{font.display}', fontSize: 52, fontWeight: 400, lineHeight: 1.15, letterSpacing: -0.5, responsive: { min: 34, max: 52 } },
  'stat-display':    { fontFamily: '{font.display}', fontSize: 56, fontWeight: 400, lineHeight: 1.10, letterSpacing: -1,   responsive: { min: 36, max: 56 } },
  'heading-2':       { fontFamily: '{font.ui}', fontSize: 36, fontWeight: 500, lineHeight: 1.20, letterSpacing: -0.5, responsive: { min: 28, max: 36 } },
  'heading-3':       { fontFamily: '{font.ui}', fontSize: 28, fontWeight: 500, lineHeight: 1.25 },
  'heading-4':       { fontFamily: '{font.ui}', fontSize: 22, fontWeight: 500, lineHeight: 1.30 },
  'heading-5':       { fontFamily: '{font.ui}', fontSize: 18, fontWeight: 500, lineHeight: 1.40 },
  subtitle:          { fontFamily: '{font.ui}', fontSize: 18, fontWeight: 400, lineHeight: 1.50 },
  'body-md':         { fontFamily: '{font.ui}', fontSize: 16, fontWeight: 400, lineHeight: 1.55 },
  'body-md-medium':  { fontFamily: '{font.ui}', fontSize: 16, fontWeight: 500, lineHeight: 1.55 },
  'body-sm':         { fontFamily: '{font.ui}', fontSize: 14, fontWeight: 400, lineHeight: 1.50 },
  'body-sm-medium':  { fontFamily: '{font.ui}', fontSize: 14, fontWeight: 500, lineHeight: 1.50 },
  caption:           { fontFamily: '{font.ui}', fontSize: 13, fontWeight: 400, lineHeight: 1.40 },
  'caption-bold':    { fontFamily: '{font.ui}', fontSize: 13, fontWeight: 600, lineHeight: 1.40 },
  micro:             { fontFamily: '{font.ui}', fontSize: 12, fontWeight: 500, lineHeight: 1.40 },
  'micro-uppercase': { fontFamily: '{font.ui}', fontSize: 11, fontWeight: 600, lineHeight: 1.40, letterSpacing: 1, textTransform: 'uppercase' },
  'button-md':       { fontFamily: '{font.ui}', fontSize: 14, fontWeight: 500, lineHeight: 1.30 },
  'code-md':         { fontFamily: '{font.mono}', fontSize: 14, fontWeight: 400, lineHeight: 1.50 },
} as const satisfies Record<string, TextStyle>;

export type TextVariant = keyof typeof textScale;
