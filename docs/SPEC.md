# Spec — tokens, themes, component contract

## Token schema

- **Tier 1 primitives** (`packages/tokens/src/primitives.ts`, `typography.ts`, `foundations.ts`):
  raw values only, never referenced by components directly. Palette groups: `sunset`, `cream`,
  `ink`, `neutral`, `blue`, `grape`, `status`; `fonts` (display/ui/mono); `textScale` (19 variants);
  `spacing`, `radius`, `elevation`, `motion`, `layout`.
- **Tier 2 semantic** (`semantic.ts`): one object per theme (`daylight`, `terminal`) with groups
  `bg`, `fg`, `accent`, `border`, `status`, `gradient`. Values are hex/rgb/gradient literals **or
  `{ref}` aliases** into tier 1 (e.g. `'{sunset.700}'`; `DEFAULT` keys collapse: `{ink.DEFAULT}` → `ink`).
- **Tier 3 component** (`components.ts`): `button.*`, `badge.*`, `card.*`, `input.default`,
  `iconTile` — aliases over tiers 1–2 (`'{color.accent.primary}'`, `'{radius.md}'`, `'{text.button-md}'`).

## Ref resolution & artifacts

- `resolveRefs()` iterates until stable (component → semantic → primitive chains).
- `resolveTheme(name)` → fully concrete token tree (used at runtime by `@pixelmist/native`).
- `scripts/build.mjs` emits:
  - `dist/tokens.css` — `:root` primitives as `--pm-*`; per-theme blocks `[data-theme="…"]`
    (default theme also on `:root`); component tokens as `var(--pm-…)` aliases; responsive
    display sizes as `clamp()`; `prefers-reduced-motion` overrides. Var naming: kebab-cased
    (`color.bg.canvas` → `--pm-color-bg-canvas`).
  - `dist/tokens.json` — everything, resolved per theme (tooling/codegen/Figma export).

## Theming contract

- Web: `<html data-theme="daylight|terminal">`; `ThemeProvider` sets it (+ optional localStorage).
  Components never hardcode colors — only `var(--pm-*)`.
- Native: `<ThemeProvider>` context exposes `resolved = resolveTheme(theme)`; components read it.
- New theme = new semantic object in `semantic.ts` + name in `themes`. Nothing else changes.

## Component contract (identical props on `@pixelmist/react` and `@pixelmist/native`)

| Component | Key props | Notes |
|---|---|---|
| `ThemeProvider` / `useTheme` | `theme?`, `defaultTheme?`, `onThemeChange?` (+`storageKey` web) | sets `data-theme` (web) / resolved context (native) |
| `Box` / `Stack` | `display direction gap padding* margin* align justify wrap flex width maxWidth radius bg color as?` | spacing props: token name (`"xl"`) or px number |
| `Text` | `as? variant tone` | 19 type variants × 11 tones |
| `Button` | `variant: primary/secondary/dark/cream/link`, `size: sm/md/lg`, `loading fullWidth leftIcon rightIcon` | 44px min height, radius 8 |
| `Badge` | `variant: accent/cream/dark/outline`, `tone: neutral/success/info/warning/danger` | radius full |
| `Card` | `variant: base/feature/cream/featured/code`, `padding?` | featured = 2px accent border |
| `TextField` | `label hint error size leftIcon rightIcon` + input props | 44px, accent focus ring, `role=alert` errors |
| `Switch` | `checked defaultChecked onCheckedChange label` | `role="switch"` / RN Switch |
| `Tabs` | `variant: pill/underline`, `value defaultValue onValueChange`; `Tabs.List`, `Tabs.Tab` | `role=tablist/tab`, `aria-selected` |
| `Icon` | `name size strokeWidth color? title?` | paths from `@pixelmist/icons` |
| `IconTile` | `icon label?` | cream tile |
| `CodeBlock` | `title code actions?` | dark `#1C1C1E` panel + header |
| `SunsetStripe` | `height?` | brand gradient band |

## Accessibility contract

- Interactive components expose correct roles/states (`switch`+`aria-checked`, `tab`+`aria-selected`,
  `aria-invalid`/`aria-describedby` on inputs, `role=alert` on errors, `aria-busy` on loading).
- Shared focus ring token (`elevation.focusRingColor/Width/Offset`); `:focus-visible` on web.
- `prefers-reduced-motion` zeroes token durations (CSS) and slows the spinner.
- Color pairs are chosen WCAG-AA (accent on white, soft-status pairs, on-accent white).
