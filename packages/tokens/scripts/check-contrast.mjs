/**
 * WCAG contrast gate. Resolves every theme and asserts the fg/bg pairs we actually
 * use for text meet AA (4.5:1; 3:1 for large text / UI graphics). Fails the build on regression.
 */
import * as T from '../dist/index.js';

const lin = (c) => {
  c /= 255;
  return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
};
const lum = (hex) => {
  const n = parseInt(hex.slice(1), 16);
  return 0.2126 * lin((n >> 16) & 255) + 0.7152 * lin((n >> 8) & 255) + 0.0722 * lin(n & 255);
};
const blend = (fg, alpha, bg) => {
  const f = parseInt(fg.slice(1), 16),
    b = parseInt(bg.slice(1), 16);
  const ch = (fs, bs) => Math.round(alpha * fs + (1 - alpha) * bs);
  return (
    '#' +
    [ch((f >> 16) & 255, (b >> 16) & 255), ch((f >> 8) & 255, (b >> 8) & 255), ch(f & 255, b & 255)]
      .map((v) => v.toString(16).padStart(2, '0'))
      .join('')
  );
};
const ratio = (a, b) => {
  const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p);
  return (x + 0.05) / (y + 0.05);
};
const over = (fg, bg) =>
  fg.startsWith('rgba')
    ? blend(
        fg
          .match(/[\d.]+/g)
          .slice(0, 3)
          .map(Number)[0] !== undefined
          ? '#' +
              fg
                .match(/[\d.]+/g)
                .slice(0, 3)
                .map((v) => Number(v).toString(16).padStart(2, '0'))
                .join('')
          : fg,
        parseFloat(fg.match(/[\d.]+/g)[3]),
        bg,
      )
    : fg;

let failures = 0;
const check = (theme, fg, bg, min, label) => {
  const f = over(String(fg), String(bg));
  const r = ratio(f, String(bg));
  const ok = r >= min;
  if (!ok) failures++;
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${theme.padEnd(9)} ${label.padEnd(34)} ${r.toFixed(2)}:1 (min ${min})`);
};

for (const name of T.themeNames) {
  const t = T.resolveTheme(name);
  const c = t.color;
  for (const bg of ['canvas', 'surface', 'raised', 'cream', 'creamSoft']) {
    check(name, c.fg.default, c.bg[bg], 4.5, `fg.default on bg.${bg}`);
    check(name, c.fg.muted, c.bg[bg], 4.5, `fg.muted on bg.${bg}`);
    check(name, c.fg.subtle, c.bg[bg], 4.5, `fg.subtle on bg.${bg}`);
    check(name, c.fg.link, c.bg[bg], 4.5, `fg.link on bg.${bg}`);
  }
  check(name, c.fg.inverse, c.bg.inverse, 4.5, 'fg.inverse on bg.inverse');
  check(name, c.fg.onAccent, t.components.button.primary.bg, 4.5, 'onAccent on button.primary.bg');
  check(name, c.fg.onAccent, t.components.badge.accent.bg, 4.5, 'onAccent on badge.accent.bg');
  check(name, c.accent.primary, c.bg.canvas, 3.0, 'accent.primary on bg.canvas (graphics)');
  for (const tone of ['success', 'info', 'warning', 'danger']) {
    check(name, c.status[tone], c.status[tone + 'Soft'], 4.5, `status.${tone} on status.${tone}Soft`);
  }
  check(name, c.status.onDanger, c.status.danger, 4.5, 'status.onDanger on status.danger');
  // semantic tones: text on surface (AA text), onStrong on strong (AA text), strong on canvas (graphics 3:1)
  for (const tone of ['attention', 'progress', 'settled', 'inactive']) {
    const tn = c.tones[tone];
    const surfaceHex = over(String(tn.surface), String(c.bg.canvas)); // blend rgba surface over canvas
    check(name, tn.text, surfaceHex, 4.5, `tones.${tone}.text on tones.${tone}.surface`);
    check(name, tn.onStrong, tn.strong, 4.5, `tones.${tone}.onStrong on tones.${tone}.strong`);
    check(name, tn.strong, c.bg.canvas, 3.0, `tones.${tone}.strong on bg.canvas (graphics)`);
    check(name, tn.text, c.bg.canvas, 3.0, `tones.${tone}.text on bg.canvas (graphics)`);
  }
  // dataviz: categorical >= 3:1 on canvas and surface (non-text graphics); every sequential
  // step must carry readable text with one of the two fg colours (AA 4.5)
  for (const [i, col] of c.dataviz.categorical.entries()) {
    check(name, col, c.bg.canvas, 3.0, `dataviz.categorical[${i}] on bg.canvas`);
    check(name, col, c.bg.surface, 3.0, `dataviz.categorical[${i}] on bg.surface`);
  }
  for (const [i, col] of c.dataviz.sequential.entries()) {
    const rDef = ratio(over(String(c.fg.default), c.bg.canvas), col);
    const rInv = ratio(over(String(c.fg.inverse), c.bg.canvas), col);
    const ok = Math.max(rDef, rInv) >= 4.5;
    if (!ok) failures++;
    console.log(`${ok ? 'PASS' : 'FAIL'}  ${name.padEnd(9)} dataviz.sequential[${i}] readable text   ${Math.max(rDef, rInv).toFixed(2)}:1 (min 4.5)`);
  }
  check(name, c.dataviz.axisText, c.bg.canvas, 4.5, 'dataviz.axisText on bg.canvas');
  check(name, '#F2F1EC', c.bg.code, 4.5, 'code text on bg.code');
}

if (failures) {
  console.error(`\n${failures} contrast check(s) failed`);
  process.exit(1);
}
console.log('\nAll contrast checks passed (WCAG AA).');
