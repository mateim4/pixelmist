---
'@pixelmist/native': patch
---

Gamification primitives with the same API as web: `XPBar`, `LevelBadge`, `Streak`, `AchievementToast`, `useTweenedNumber` (uses RN `useReducedMotion`). `Progress` loses the decorative `tone` prop (status drives tone), animates at 200ms, and is now forwardRef with prop pass-through. forwardRef + pass-through added across Badge, Icon, IconTile, TypingDots, Switch, CodeBlock, DiffView, ToolCall, AccentStripe, AccentScope, Message, Markdown, Popover, Tooltip, InfoTip, HoverCard, Dialog, Select, Checkbox, ToastProvider. Toasts gain `icon`/`action`.
