# Roadmap

## v0.1 (done)

- Token pipeline (3 tiers, refs, CSS/JSON/native artifacts), themes `daylight` + `terminal`
- Core primitives: Box/Stack, Text, Button, Badge, Card, TextField, Switch, Tabs, Icon, IconTile, CodeBlock, SunsetStripe, ThemeProvider — on web (@pixelmist/react) and mobile (@pixelmist/native)
- Apps: web playground (Vite), desktop shell (Tauri v2), mobile shell (Expo)
- 11 behavior tests (vitest), full typecheck via turbo

## v0.2 (done)
- Overlays: Dialog (focus trap, Esc, animated), Toast system, ⌘K Command palette (web)
- Forms: Select, Checkbox, RadioGroup, TextArea; Progress/XP bar with indeterminate mode
- Harness: Message, ToolCall, DiffView, TypingDots — on both renderers
- Motion pass on all interactive components (hover lift, spring knob/check, sliding tab indicator, stripe pan) with reduced-motion guards
- WCAG AA contrast gate in tokens build (58 checks); primary/badge/link/status pairs fixed
- Tabs: roving tabindex + arrow/Home/End keys; ThemeProvider: followSystem + injectable storage (web localStorage / native AsyncStorage)
- Packaging: sideEffects/publishConfig, changesets, eslint+prettier, CI (build/typecheck/test/lint + mobile typecheck job), self-hosted fonts (@fontsource), Tauri icons generated + greet IPC, native smoke tests (react-test-renderer, 6)
- 29 behavior tests total (23 web + 6 native)

## v0.2.1 (next)

- Overlay components: Dialog/Modal, Popover, Menu, Toast — same contract on both renderers
- Data display: Table, Stat (stat-display), Accordion/FAQ, Avatar, Progress
- More form controls: Select, Checkbox, Radio, TextArea, Slider
- Harness-specific: chat message list, tool-call card, diff view, run timeline
- Storybook for web; @testing-library/react-native for native; changesets + CI (GitHub Actions: build/typecheck/test)
- Auto theme from `prefers-color-scheme` (opt-in `ThemeProvider` mode)

## v0.3

- Icon expansion + Figma token export (tokens.json → Figma variables)
- Theming API for product accents (override semantic accent per product area)
- Visual regression (Chromatic/Playwright) on the playground
- Publish packages (private registry or npm), semantic versioning via changesets
