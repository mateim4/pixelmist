# Roadmap

## v0.1 (done)
- Token pipeline (3 tiers, refs, CSS/JSON/native artifacts), themes `daylight` + `terminal`
- Core primitives: Box/Stack, Text, Button, Badge, Card, TextField, Switch, Tabs, Icon, IconTile, CodeBlock, SunsetStripe, ThemeProvider — on web (@pixelmist/react) and mobile (@pixelmist/native)
- Apps: web playground (Vite), desktop shell (Tauri v2), mobile shell (Expo)
- 11 behavior tests (vitest), full typecheck via turbo

## v0.2 (next)
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
