# Spec — tokens, themes, component contract

## Token schema

- **Tier 1 primitives** (`packages/tokens/src/primitives.ts`, `typography.ts`, `foundations.ts`):
  raw values only, never referenced by components directly. Palette groups: `dusk` (accent), `blue`, `sunset` (Mistral reference), `cream`,
  `ink`, `neutral`, `blue`, `grape`, `status`; `fonts` (display/ui/mono); `textScale` (19 variants);
  `spacing`, `radius`, `elevation`, `motion`, `layout`.
- **Tier 2 semantic** (`semantic.ts`): one object per theme (`daylight`, `terminal`) with groups
  `bg`, `fg`, `accent`, `border`, `status` (+`onDanger`), `tones`, `dataviz`, `gradient`. Values are
  hex/rgb/gradient literals **or `{ref}` aliases** into tier 1 (e.g. `'{dusk.700}'`; `DEFAULT` keys
  collapse: `{ink.DEFAULT}` → `ink`).
  - `tones`: the four semantic tones — `attention` (needs a person; = warning), `progress` (in
    flight; = info), `settled` (done; = success), `inactive` (not in play; = neutral; a count of
    zero is never toned) — each `{surface, border, text, strong, onStrong}`.
  - `dataviz`: `categorical` (8 colours, ≥3:1 on canvas/surface), `sequential` (6-step ramp, readable
    text on every step), `grid`, `axis`, `axisText`.
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
  - `dist/terminal.json` — flat hex per theme for the Rust/ratatui terminal (background, surface,
    text, muted, accent, tones, status, categorical[8], sequential[6], grid/axis/axisText);
    exported as `@pixelmist/tokens/terminal.json`.
  - `prefers-reduced-motion` sets `--pm-motion-travel: 0` (fades stay, travel goes); components
    apply travel as `calc(var(--pm-motion-travel) * Npx)`.

## Theming contract

- Web: `<html data-theme="daylight|terminal">`; `ThemeProvider` sets it (+ optional localStorage).
  Components never hardcode colors — only `var(--pm-*)`.
- Native: `<ThemeProvider>` context exposes `resolved = resolveTheme(theme)`; components read it.
- New theme = new semantic object in `semantic.ts` + name in `themes`. Nothing else changes.

## Component contract (identical props on `@pixelmist/react` and `@pixelmist/native`)

| Component                    | Key props                                                                                              | Notes                                               |
| ---------------------------- | ------------------------------------------------------------------------------------------------------ | --------------------------------------------------- |
| `ThemeProvider` / `useTheme` | `theme?`, `defaultTheme?`, `onThemeChange?` (+`storageKey` web)                                        | sets `data-theme` (web) / resolved context (native) |
| `Box` / `Stack`              | `display direction gap padding* margin* align justify wrap flex width maxWidth radius bg color as?`    | spacing props: token name (`"xl"`) or px number     |
| `Text`                       | `as? variant tone`                                                                                     | 19 type variants × 11 tones                         |
| `Button`                     | `variant: primary/secondary/dark/cream/link/ghost/tertiary/danger/dangerTertiary`, `size: sm/md/lg`, `loading fullWidth leftIcon rightIcon icon label tooltip` | web 32/40/48px (native md 44), radius 8             |
| `Popover`/`Tooltip`/`InfoTip`/`HoverCard` | `open onOpenChange anchor placement offset flip` (Popover); `label` (Tooltip); `label children align` (InfoTip) | 12 placements + auto-flip; Escape closes, focus returns; WCAG 1.4.13 |
| `InlineNotification`         | `tone: error/warning/success/info`, `title subtitle onClose action` | role=alert (error) / status                        |
| `Tag`/`SelectableTag`        | `tone: attention/progress/settled/inactive/neutral`, `variant: soft/outline/highContrast`, `size: sm/md`; SelectableTag adds `selected onSelectedChange` (aria-pressed) | zero counts never toned |
| `Link`                       | `as? external? variant: inline/standalone` + anchor props | polymorphic for router links                        |
| `InlineLoading`              | `status: active/finished/error`, `label finishedLabel errorLabel` | role=status                                         |
| `PasswordInput`/`Search`     | TextField props + `revealed…`; Search: `value/defaultValue/onValueChange onClear` | role=search, Escape clears                          |
| `ComboBox`                   | `items itemToString value/defaultValue/onValueChange onSelect` | APG combobox, type-to-filter                        |
| `DateInput`                  | ISO `YYYY-MM-DD` value + field props | native `<input type="date">` / RN ISO text field    |
| `Disclosure`                 | `title open/defaultOpen onOpenChange` | grid-rows fold; reduced-motion fade                 |
| `Table` compound             | `Table density stickyHeader`, `TableHeaderCell sort={{direction,onSort}}` | aria-sort; sideways scroll in wrapper               |
| `AppShell`/`Header`/`SideNav`/`SkipToContent` | `groups=[{heading,links:[{label,href,icon,current}]}]`, `linkAs`, `targetId` | aria-current; overlay < lg; router-agnostic         |
| `Layer`/`Grid`               | `Layer level?`; `Grid columns gap` | nested surface levels; responsive columns           |
| `ActivityMarker`/`AgentChip` | `state: working/idle/stopped`; `name color state` | pulsing/steady/no ring; reduced-motion still marker |
| `Legend`                     | `items=[{label,color}] direction` | categorical index or CSS colour                     |
| `Composer`                   | `value onValueChange onSend running onStop onAttach disabled` | Enter sends, Shift+Enter newline, Send→Stop         |
| `Markdown` (`Message markdown`) | `source` | code blocks/lists/links/inline code; no raw HTML  |
| `PermissionPrompt`/`PlanList`/`SessionListItem` | `action onAllowOnce onAlwaysAllow onDeny`; `steps`; `title project workItem state lastActive` | chat with agents |
| `XPBar`/`LevelBadge`/`Streak`/`AchievementToast` | `value max level? showValue? hint? size`; `level size?`; `days size?`; `title description? icon? action? onClose? duration?` | gamification (D3): progress/settled/attention tones; zero streak never toned; tweened readout ≤400ms, instant under reduced motion |
| `Badge`                      | `variant: accent/cream/dark/outline`, `tone: neutral/success/info/warning/danger`                      | radius full                                         |
| `Card`                       | `variant: base/feature/cream/featured/code`, `padding?`                                                | featured = 2px accent border                        |
| `TextField`                  | `label hint error size leftIcon rightIcon` + input props                                               | 44px, accent focus ring, `role=alert` errors        |
| `Switch`                     | `checked defaultChecked onCheckedChange label`                                                         | `role="switch"` / RN Switch                         |
| `Tabs`                       | `variant: pill/underline`, `value defaultValue onValueChange`; `Tabs.List`, `Tabs.Tab`                 | `role=tablist/tab`, `aria-selected`                 |
| `Icon`                       | `name size strokeWidth color? title?`                                                                  | paths from `@pixelmist/icons`                       |
| `IconTile`                   | `icon label?`                                                                                          | cream tile                                          |
| `CodeBlock`                  | `title code actions?`                                                                                  | dark `#1C1C1E` panel + header                       |
| `AccentStripe` (`SunsetStripe` deprecated alias) | `height?`                                                          | brand gradient band (dusk sweep)                |

## Accessibility contract

- Interactive components expose correct roles/states (`switch`+`aria-checked`, `tab`+`aria-selected`,
  `aria-invalid`/`aria-describedby` on inputs, `role=alert` on errors, `aria-busy` on loading).
- Shared focus ring token (`elevation.focusRingColor/Width/Offset`); `:focus-visible` on web,
  rendered as an **outline** so the ring never animates; all interactive targets ≥24px.
- `prefers-reduced-motion` zeroes token durations (CSS) and all pm animations/transitions (web); RN components avoid loops.
- **Contrast gate**: `scripts/check-contrast.mjs` runs in the tokens build and fails CI if any fg/bg text pair drops below WCAG AA 4.5:1 (58 checks across both themes).
- **Motion system**: tokenized durations (`instant/fast/normal/slow`) + easings (`standard/emphasized/entrance/spring`); hover lift on buttons/cards/icon tiles, sliding tab indicator, overlay enter/exit keyframes, toast slide + progress, panning accent stripe — all disabled under reduced motion. Only opacity/transform/colour ever animate; travel distances go through `calc(var(--pm-motion-travel) * Npx)`; most transitions ≤240ms (only chart first draw, the Disclosure fold and number tweens may run longer, ≤400ms).
- **Pass-through convention**: every component is `forwardRef` and spreads remaining props onto its root element. Exception, documented: field components (`TextField`, `Search`, `PasswordInput`, `DateInput`, `TextArea`, `Composer`, `Select`, `ComboBox`, `Checkbox`, `Radio`, `Switch`) spread `...rest` + ref onto the inner control (the element tests interact with) and put `className` on the outer wrapper. `InfoTip` puts `data-testid` on the "?" button.
- Color pairs are chosen WCAG-AA (accent on white, soft-status pairs, on-accent white).
