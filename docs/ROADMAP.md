# Roadmap

## v0.1 (done)

- Token pipeline (3 tiers, refs, CSS/JSON/native artifacts), themes `daylight` + `terminal`
- Core primitives: Box/Stack, Text, Button, Badge, Card, TextField, Switch, Tabs, Icon, IconTile, CodeBlock, AccentStripe, ThemeProvider — on web (@pixelmist/react) and mobile (@pixelmist/native)
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

## v0.3 (done)

- Semantic tones (attention/progress/settled/inactive × surface/border/text/strong/onStrong), dataviz tokens (8 categorical, 6 sequential, grid/axis), `motion.travel` multiplier (`--pm-motion-travel` → 0 under reduced motion), `status.onDanger`, terminal palette export (`@pixelmist/tokens/terminal.json` for ratatui)
- Carbon-swap set on both renderers: Popover, Tooltip, InfoTip, InlineNotification, Tag/SelectableTag, Link, InlineLoading, PasswordInput, Search, ComboBox, DateInput, Disclosure, Table, AppShell (Header/SideNav/SkipToContent), Layer, Grid + upgrades to Button (ghost/tertiary/danger/dangerTertiary, icon-only+tooltip), TextField, Select (typed items), Checkbox (indeterminate), RadioGroup, TextArea (counter), Dialog (sizes/danger/passive/footer actions), Progress (pass-through fix, status), Tabs.Panel
- Live views: ActivityMarker, AgentChip, HoverCard, Legend. Chat: Composer, Markdown, PermissionPrompt, PlanList, SessionListItem
- 15 new icons (60 total); density web 32/40/48 (native md 44); outline focus ring that never animates
- `@pixelmist/art`: tray icon set (brdcrmb mark, 4 states × light/dark × 16/22/24/32 PNG+SVG) + categorical-tinted agent avatars (pixel-forge)
- MIT LICENSE; publishConfig → GitHub Packages (private); changesets v0.3.0; docs/CARBON-MIGRATION.md
- 101 web tests + 34 native tests; Storybook stories for all new components; contrast gate extended and green
- Gamification primitives (D3, owner-approved): `XPBar`, `LevelBadge`, `Streak`, `AchievementToast` + `useTweenedNumber` on both renderers; `flame`/`trophy`/`medal` icons (67 total)
- Adversarial quality pass: forwardRef/pass-through completed on every component (web + native); ARIA fixes (Select/ComboBox activedescendant, RadioGroup arrows + labelling, AppShell menu/SideNav focus return + overlay containment, Dialog trap + full pass-through, Escape focus-return without reopen in Tooltip/HoverCard/InfoTip, InfoTip stays open over portaled content); motion-rule fixes (no box-shadow/width/top transitions, progress fill 200ms, skip link via transform, Disclosure fold animates via visibility, Grid base columns via CSS not inline style); 14 corrupted icon paths repaired; Progress `tone` prop removed (status drives tone)

## v0.4 (next)

- Visual regression (Chromatic/Playwright) on the playground
- Publish to the owner's private GitHub repo (GitHub Packages) and wire brdcrmb's install
