---
'@pixelmist/tokens': minor
'@pixelmist/react': minor
'@pixelmist/native': minor
---

Accent rework: the blood-orange sunset accent is replaced by a blue/violet **dusk** palette (`dusk` + full `blue` primitive scales). Semantic `accent.*`, `fg.link`, `border.accent`, button.primary/badge.accent backgrounds and the signature gradient now resolve from `dusk`; `gradient.sunset` is renamed to `gradient.stripe` (dusk sweep) and `SunsetStripe` to `AccentStripe` (old name kept as deprecated alias). Terminal status warning is now amber `#FFB224` so it no longer collides with the accent. Contrast gate still passes 58/58 (WCAG AA). The `sunset` primitive scale remains as the Mistral.ai reference palette.
