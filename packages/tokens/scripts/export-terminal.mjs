/**
 * Part E — terminal palette export. Emits dist/terminal.json: a flat map of hex
 * colours per theme for the Rust/ratatui terminal interface — background, surface,
 * text, muted, accent, the four semantic tones, the 8 categorical colours and the
 * 6-step sequential ramp. rgba() values are blended over the theme canvas to hex.
 * Run after tsup + build.mjs: node scripts/export-terminal.mjs
 */
import { writeFileSync, mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import * as T from '../dist/index.js';

const dist = join(dirname(fileURLToPath(import.meta.url)), '..', 'dist');
mkdirSync(dist, { recursive: true });

const hex = (c) => {
  if (typeof c !== 'string') return c;
  if (c.startsWith('#')) return c.toUpperCase();
  const m = c.match(/rgba?\(([^)]+)\)/);
  if (!m) return c;
  const [r, g, b, a = '1'] = m[1].split(',').map((s) => parseFloat(s.trim()));
  return `#${[r, g, b].map((v) => Math.round(v).toString(16).padStart(2, '0')).join('')}`.toUpperCase() + (a < 1 ? '' : '');
};

/** Blend an rgba() colour over a hex background, returning hex. */
const over = (fg, bg) => {
  if (!fg.startsWith('rgba')) return hex(fg);
  const nums = fg.match(/[\d.]+/g).map(Number);
  const f = [nums[0], nums[1], nums[2]];
  const a = nums[3] ?? 1;
  const n = parseInt(bg.slice(1), 16);
  const b = [(n >> 16) & 255, (n >> 8) & 255, n & 255];
  const ch = (fs, bs) => Math.round(a * fs + (1 - a) * bs);
  return `#${[ch(f[0], b[0]), ch(f[1], b[1]), ch(f[2], b[2])].map((v) => v.toString(16).padStart(2, '0')).join('')}`.toUpperCase();
};

const out = {};
for (const name of T.themeNames) {
  const t = T.resolveTheme(name);
  const c = t.color;
  const canvas = hex(c.bg.canvas);
  const tone = (k) => ({
    surface: over(c.tones[k].surface, canvas),
    border: over(c.tones[k].border, canvas),
    text: hex(c.tones[k].text),
    strong: hex(c.tones[k].strong),
    onStrong: hex(c.tones[k].onStrong),
  });
  out[name] = {
    background: canvas,
    surface: hex(c.bg.surface),
    raised: hex(c.bg.raised),
    text: hex(c.fg.default),
    muted: hex(c.fg.muted),
    accent: hex(c.accent.primary),
    tones: {
      attention: tone('attention'),
      progress: tone('progress'),
      settled: tone('settled'),
      inactive: tone('inactive'),
    },
    status: {
      success: hex(c.status.success),
      info: hex(c.status.info),
      warning: hex(c.status.warning),
      danger: hex(c.status.danger),
    },
    categorical: c.dataviz.categorical.map(hex),
    sequential: c.dataviz.sequential.map(hex),
    grid: hex(c.dataviz.grid),
    axis: hex(c.dataviz.axis),
    axisText: hex(c.dataviz.axisText),
  };
}

writeFileSync(join(dist, 'terminal.json'), JSON.stringify(out, null, 2) + '\n');
console.log('terminal.json written to dist');
