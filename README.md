# Pixelmist

A Mistral-inspired design system for an AI harness — **React + TypeScript**, targeting
**web, native desktop (Linux/Windows/macOS) and mobile (iOS/Android)** from one token source.

```bash
npm install
npm run build        # turbo: builds tokens → core/icons → react → native → web
npm run typecheck    # strict tsc everywhere (incl. real react-native types)
npm test             # vitest behavior tests for @pixelmist/react
npm run dev          # playground at http://localhost:5173 (toggle daylight/terminal in the header)
```

## Use it

```tsx
// web / desktop (DOM)
import '@pixelmist/tokens/tokens.css';
import '@pixelmist/react/styles.css';
import { ThemeProvider, Button, Text, SunsetStripe } from '@pixelmist/react';

<ThemeProvider storageKey="pm-theme">
  <Text as="h1" variant="hero-display">Frontier tooling. In your hands.</Text>
  <Button variant="primary" rightIcon="arrow-right">Start building</Button>
  <SunsetStripe />
</ThemeProvider>
```

```tsx
// mobile (React Native, Expo)
import { ThemeProvider, Button, Text, SunsetStripe } from '@pixelmist/native';
// same JSX — components resolve the theme from tokens at runtime
```

## Layout

- `packages/tokens` — the single source of truth (3 token tiers → CSS vars / JSON / RN theme)
- `packages/core` — platform-agnostic hooks/utils/types
- `packages/icons` — icon path data, rendered per platform
- `packages/react` — DOM components (web + desktop via Tauri)
- `packages/native` — React Native components (mobile)
- `apps/web` playground · `apps/desktop` Tauri v2 shell · `apps/mobile` Expo shell
- `docs/` — RESEARCH (what Mistral's system is), ARCHITECTURE (pillars + ADRs), SPEC (token + component contract), ROADMAP
