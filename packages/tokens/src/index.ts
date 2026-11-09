import { palette } from './primitives';
import { fonts, textScale } from './typography';
import { spacing, radius, elevation, motion, layout } from './foundations';
import { themes, defaultTheme, themeNames } from './semantic';
import type { ThemeName, SemanticColorTokens } from './semantic';
import { componentTokens } from './components';

export {
  palette,
  fonts,
  textScale,
  spacing,
  radius,
  elevation,
  motion,
  layout,
  themes,
  defaultTheme,
  themeNames,
  componentTokens,
};
export type { ThemeName, SemanticColorTokens };
export type { TextVariant } from './typography';

type Flat = Record<string, string | number>;

/** "{dusk.700}" -> "dusk.700" */
const refPath = (v: string) => v.replace(/^\{|\}$/g, '').replace(/\.DEFAULT(?=\.|$)/g, '');
const isRef = (v: unknown): v is string => typeof v === 'string' && /^\{.+\}$/.test(v);

/** Flatten a nested token tree into dot paths; DEFAULT keys collapse into the parent path. */
export function flatten(tree: Record<string, unknown>, prefix = ''): Flat {
  const out: Flat = {};
  for (const [k, v] of Object.entries(tree)) {
    let path = prefix ? `${prefix}.${k}` : k;
    if (k === 'DEFAULT') path = prefix;
    if (v !== null && typeof v === 'object') Object.assign(out, flatten(v as Record<string, unknown>, path));
    else out[path] = v as string | number;
  }
  return out;
}

/** Rebuild a nested object from dot-path keys. */
function unflatten(entries: [string, string | number][]): Record<string, unknown> {
  const root: Record<string, unknown> = {};
  for (const [path, value] of entries) {
    const parts = path.split('.');
    let node = root;
    for (let i = 0; i < parts.length - 1; i++) {
      const p = parts[i]!;
      node = (node[p] ??= {}) as Record<string, unknown>;
    }
    node[parts[parts.length - 1]!] = value;
  }
  return root;
}

/** Resolve "{a.b}" refs against a flat lookup; refs to groups expand to nested objects. */
export function resolveRefs<T>(node: T, lookup: Flat): T {
  if (typeof node === 'string' && isRef(node)) {
    const p = refPath(node);
    if (p in lookup) return lookup[p] as T;
    const sub = Object.entries(lookup).filter(([k]) => k.startsWith(p + '.'));
    if (sub.length) return unflatten(sub.map(([k, v]) => [k.slice(p.length + 1), v])) as T;
    throw new Error(`Unresolved token ref: ${node}`);
  }
  if (Array.isArray(node)) return node.map((v) => resolveRefs(v, lookup)) as T;
  if (node !== null && typeof node === 'object') {
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(node as Record<string, unknown>)) out[k] = resolveRefs(v, lookup);
    return out as T;
  }
  return node;
}

/**
 * Full runtime theme for React Native: tier-1 + semantic + component tokens with every
 * ref resolved to a concrete value. e.g. resolveTheme('terminal').components.button.primary.bg
 */
export function resolveTheme(name: ThemeName) {
  const semantic = themes[name];
  const primitives = { ...palette, font: fonts, text: textScale, space: spacing, radius, elevation, motion, layout };
  const lookup = flatten({ ...primitives, color: semantic });
  const initial = {
    palette,
    font: fonts,
    text: textScale,
    space: spacing,
    radius,
    elevation,
    motion,
    layout,
    color: semantic,
    components: componentTokens,
  };
  // refs can chain (component -> semantic -> primitive); iterate until stable
  let out = resolveRefs(initial, lookup);
  for (let i = 0; i < 8; i++) {
    const next = resolveRefs(out, lookup);
    if (JSON.stringify(next) === JSON.stringify(out)) return next;
    out = next;
  }
  return out;
}

export type ResolvedTheme = ReturnType<typeof resolveTheme>;

/** CSS custom property name for a token path: "color.bg.canvas" -> "--pm-color-bg-canvas" */
export const cssVar = (path: string) =>
  `--pm-${path
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .toLowerCase()
    .replace(/\./g, '-')}`;
