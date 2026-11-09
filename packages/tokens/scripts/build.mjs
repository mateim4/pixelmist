/**
 * Emits dist/tokens.css (CSS custom properties per theme) and dist/tokens.json
 * (fully resolved token trees per theme, for React Native / tooling).
 * Run after tsup: node scripts/build.mjs
 */
import { writeFileSync, mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import * as T from '../dist/index.js';

const dist = join(dirname(fileURLToPath(import.meta.url)), '..', 'dist');
mkdirSync(dist, { recursive: true });

const isRef = (v) => typeof v === 'string' && /^\{.+\}$/.test(v);
const refPath = (v) => v.replace(/^\{|\}$/g, '').replace(/\.DEFAULT(?=\.|$)/g, '');
const cssVar = (p) =>
  `--pm-${p
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .toLowerCase()
    .replace(/\./g, '-')}`;

/** number -> css unit, path-aware */
function cssVal(path, v) {
  if (typeof v !== 'number') return v;
  if (/(lineHeight|fontWeight|zIndex|travel)/.test(path)) return String(v);
  if (/duration/.test(path)) return `${v}ms`;
  return `${v}px`;
}

const flatPrim = T.flatten({
  ...T.palette,
  font: T.fonts,
  text: T.textScale,
  space: T.spacing,
  radius: T.radius,
  elevation: T.elevation,
  motion: T.motion,
  layout: T.layout,
});

const lines = [];
lines.push('/* @pixelmist/tokens — generated. Do not edit. Source: packages/tokens/src */');
lines.push('/* Tier 1: primitives */');
lines.push(':root {');
for (const [p, v] of Object.entries(flatPrim)) {
  if (p.startsWith('text.')) continue; // text handled below
  lines.push(`  ${cssVar(p)}: ${isRef(v) ? `var(${cssVar(refPath(v))})` : cssVal(p, v)};`);
}
// text scale (refs to font stacks become var aliases; responsive sizes become clamp())
for (const [name, style] of Object.entries(T.textScale)) {
  const base = `text.${name}`;
  lines.push(`  ${cssVar(`${base}.fontFamily`)}: var(${cssVar(refPath(style.fontFamily))});`);
  if (style.responsive) {
    const vw = ((style.responsive.max / 1280) * 100).toFixed(3);
    lines.push(
      `  ${cssVar(`${base}.fontSize`)}: clamp(${style.responsive.min}px, ${vw}vw, ${style.responsive.max}px);`,
    );
  } else {
    lines.push(`  ${cssVar(`${base}.fontSize`)}: ${style.fontSize}px;`);
  }
  lines.push(`  ${cssVar(`${base}.fontWeight`)}: ${style.fontWeight};`);
  lines.push(`  ${cssVar(`${base}.lineHeight`)}: ${style.lineHeight};`);
  if (style.letterSpacing !== undefined) lines.push(`  ${cssVar(`${base}.letterSpacing`)}: ${style.letterSpacing}px;`);
  if (style.textTransform) lines.push(`  ${cssVar(`${base}.textTransform`)}: ${style.textTransform};`);
}
lines.push('}');

// Tier 2: semantic themes
for (const name of T.themeNames) {
  const selector = name === T.defaultTheme ? `:root, [data-theme="${name}"]` : `[data-theme="${name}"]`;
  lines.push(`\n/* Tier 2: theme "${name}" */`);
  lines.push(`${selector} {`);
  if (name === 'terminal') lines.push('  color-scheme: dark;');
  else lines.push('  color-scheme: light;');
  for (const [p, v] of Object.entries(T.flatten({ color: T.themes[name] }))) {
    lines.push(`  ${cssVar(p)}: ${isRef(v) ? `var(${cssVar(refPath(v))})` : v};`);
  }
  lines.push('}');
}

// Tier 3: component tokens (aliases → var refs), theme-independent
lines.push('\n/* Tier 3: component tokens (aliases over semantic vars) */');
lines.push(':root {');
for (const [p, v] of Object.entries(T.flatten({ components: T.componentTokens }))) {
  const bare = p.replace(/^components\./, '');
  if (isRef(v)) {
    const rp = refPath(v);
    const leaves = Object.keys(flatPrim).filter((k) => k.startsWith(rp + '.'));
    if (leaves.length) {
      // group ref (e.g. {text.button-md}) — expand per leaf as var aliases
      for (const lp of leaves)
        lines.push(`  ${cssVar(`comp.${bare}.${lp.slice(rp.length + 1)}`)}: var(${cssVar(lp)});`);
    } else {
      // leaf ref — primitives live in :root, semantic colors are per-theme vars; both use the same naming
      lines.push(`  ${cssVar(`comp.${bare}`)}: var(${cssVar(rp)});`);
    }
    continue;
  }
  lines.push(`  ${cssVar(`comp.${bare}`)}: ${cssVal(p, v)};`);
}
lines.push('}');

// Reduced motion: fades (opacity/colour) stay; travel (transform distance) goes.
// Components apply --pm-motion-travel as calc(var(--pm-motion-travel) * Npx).
lines.push('\n@media (prefers-reduced-motion: reduce) {');
lines.push('  :root {');
lines.push('    --pm-motion-travel: 0;');
lines.push('  }');
lines.push('}');

writeFileSync(join(dist, 'tokens.css'), lines.join('\n') + '\n');

// tokens.json — fully resolved per theme (React Native consumes resolveTheme() at runtime;
// this file is for tooling / inspection / codegen)
const json = {
  $meta: {
    name: '@pixelmist/tokens',
    generatedAt: new Date().toISOString(),
    themes: T.themeNames,
    defaultTheme: T.defaultTheme,
  },
  palette: T.palette,
  fonts: T.fonts,
  textScale: T.textScale,
  spacing: T.spacing,
  radius: T.radius,
  elevation: T.elevation,
  motion: T.motion,
  layout: T.layout,
  themes: Object.fromEntries(T.themeNames.map((n) => [n, T.resolveTheme(n)])),
};
writeFileSync(join(dist, 'tokens.json'), JSON.stringify(json, null, 2));

console.log(`tokens.css: ${lines.length} lines, tokens.json written to ${dist}`);
