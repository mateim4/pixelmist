# Architecture — pillars and decisions

## Pillars

1. **Tokens are the single source of truth.** One `@pixelmist/tokens` package (TypeScript)
   compiled to CSS custom properties (`tokens.css`), a JSON dump, and a runtime-resolved
   object for React Native. Three tiers: primitives → semantic (per theme) → component.
2. **Exactly two rendering targets.** DOM (web + desktop) and React Native (mobile).
   Desktop apps are Tauri webviews of the web build, so "native desktop" costs zero extra UI code.
3. **Headless core + platform adapters.** `@pixelmist/core` holds platform-agnostic logic
   (state hooks, `cx`, types) with no DOM/RN imports. `@pixelmist/react` and `@pixelmist/native`
   implement the _same component API_ over it.
4. **One component API, two renderers.** `Button`, `Text`, `Card`, … take identical props
   (`variant`, `size`, `tone`) on both platforms; styling comes from tokens, so each platform
   renders truly natively (CSS vars vs StyleSheet).
5. **Theming is data, not code.** Web: `[data-theme="terminal"]` swaps `--pm-*` vars — an
   attribute change, no JS restyle. Native: `ThemeProvider` resolves the theme via
   `resolveTheme(name)` into context. Both are driven by the same semantic token definitions.
6. **Monorepo with strict package boundaries.** npm workspaces + Turborepo + tsup.
   `packages/*` are publishable; `apps/*` are shells. Typed public APIs, `exports` maps.
7. **Apps share the shell, not just the parts.** `apps/web` (Vite playground),
   `apps/desktop` (Tauri v2 → `../web/dist`), `apps/mobile` (Expo → `@pixelmist/native`).
8. **Accessibility and motion are tokens too.** Focus ring, WCAG-AA-checked pairs, status
   colors, `prefers-reduced-motion` handling, tokenized durations/easings, z-index scale.

## ADRs

| #   | Decision                                                                    | Rationale                                                                               | Alternatives rejected                                                                  |
| --- | --------------------------------------------------------------------------- | --------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------- |
| 001 | Two renderers: DOM + RN                                                     | RN-web can't hit native quality on mobile; full RN-everywhere cripples web              | react-native-web everywhere; Tamagui (adds compiler complexity, desktop still webview) |
| 002 | Desktop = Tauri v2 webview, not Electron                                    | ~10x smaller bundles, OS webview, Rust IPC when native power is needed                  | Electron (heavy), native Swift/Kotlin UI (not React/TS)                                |
| 003 | Token tiers + `{ref}` alias system                                          | semantic refs survive re-theming; component tokens bind components to roles             | flat tokens (no theming), CSS-only (untyped, no RN)                                    |
| 004 | Theme switch via `data-theme` attribute on web                              | zero-JS restyle, SSR-friendly, works with `color-scheme`                                | class-based JS theming (flash of wrong theme)                                          |
| 005 | `@pixelmist/core` must never import DOM/RN                                  | guarantees portability; enforced by review + package deps                               | putting utils in each renderer (drift)                                                 |
| 006 | `--pm-` CSS var prefix, `pm-` class prefix                                  | collision-proof namespacing                                                             | unprefixed vars                                                                        |
| 007 | npm workspaces + turbo + tsup (no pnpm/Nx)                                  | zero extra tooling to install, fast enough at this scale                                | pnpm, Nx, Lerna                                                                        |
| 008 | Tests: vitest + Testing Library (react); typecheck gate for native          | behavior tests where they run today (DOM); native verified by tsc against real RN types | Storybook-only "tests"                                                                 |
| 009 | Status colors (success/info/warning/danger) added beyond the dusk accent palette | a harness UI needs semantic status; kept as _soft bg + colored fg_ to stay in-voice     | reusing only one accent hue (ambiguous)                                                 |
| 010 | Font stacks are tokens with free fallbacks (Georgia/system/mono)            | PP Editorial is commercial; Inter/JetBrains Mono load via Google Fonts in apps          | hard dependency on licensed fonts in the DS                                            |

## Repo map

```
packages/
  tokens/    @pixelmist/tokens   tier-1/2/3 tokens → tokens.css + tokens.json + resolveTheme()
  core/      @pixelmist/core     cx, useControllableState, shared types (no DOM/RN)
  icons/     @pixelmist/icons    stroke icon path data (rendered per-platform)
  react/     @pixelmist/react    DOM components + ThemeProvider + styles.css   (web, desktop)
  native/    @pixelmist/native   RN components + ThemeProvider (resolveTheme) (mobile)
apps/
  web/       @pixelmist/web      Vite playground — all components, both themes
  desktop/   @pixelmist/desktop  Tauri v2 shell → ../web/dist   (Linux/Win/macOS)
  mobile/    @pixelmist/mobile   Expo shell → @pixelmist/native (iOS/Android)
docs/        RESEARCH / ARCHITECTURE / SPEC / ROADMAP
```
