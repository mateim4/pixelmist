# Research — what the Mistral design system actually is

Sources (2026-11): live extraction of `mistral.ai` HTML/CSS (hex values scraped from the
served markup), `mistral.ai/products/vibe`, the VoltAgent `awesome-design-md` DESIGN.md
extraction of mistral.ai, and brand-extraction databases (oh-my-design.kr, designpieces).

## Palette (verified hexes found on the live site)

- **Sunset gradient**: `#FFE000 #FFBD00 #FFD900 #FFAF01 #FF9C00 #FF8204 #FF8A00 #FA500F (primary) #E51300 #C4001D (deep) #CC3A05 (pressed)`
- **Cream surfaces**: `#FFF8E0` (cream), `#FFFAEB` (light), `#FFF0C2` (deeper), border `#E6D5A8`, block `#FFE295`
- **Ink scale**: `#1F1F1F #3D3D3D #2C2C2C #4A4A4A #6A6A6A #8A8A8A #A8A8A8`
- **Neutrals**: canvas `#FFFFFF`, surface `#FAFAFA`, hairlines `#E5E5E5 / #EDEDED / #C7C7C7`, code-dark `#1C1C1E`
- **Blue** (links/info): `#044298 #0082E6 #55B3FB`; **Vibe purple** seen on the product page: `#6A0F7D`
- **Signature element**: the "sunset stripe" — a full-width red→orange→yellow→cream gradient band at the foot of every page.

## Typography

- Display: **PP Editorial Old** (commercial near-serif; fallbacks Georgia/Times) — hero 84/1.05/-1.5px, display-lg 64, h1 52, stat 56
- UI: **Inter** — h2 36/500 … body-md 16/1.55, body-sm 14, caption 13, micro 12, micro-uppercase 11 ls 1px, button 14/500
- Mono: **JetBrains Mono** — code 14/1.5
- Negative tracking scales with size (-1.5px at 84px → 0 below h3). We ship the fallback
  stacks (Georgia/system) and make the font stacks tokens so PP Editorial can be dropped in.

## Geometry, spacing, elevation

- Radius 4/6/8/12/16/20/full — **buttons 8, cards 12, badges/pills full; no pill buttons**
- Spacing (4px base): 4,8,12,16,20,24,32,40,48,64,96,120; card padding 24/32; container 1280 + 32 gutters; nav 64px sticky with hairline bottom
- Elevation: **predominantly flat with 1px hairline borders**; shadows reserved: L1 `rgba(0,0,0,.04) 0 1px 2px`, L2 `0 4px 12px`, L3 `0 12px 24px -4px (.08)`, L4 modal `0 16px 48px -8px (.12)`

## Components (default/pressed states as documented)

- Buttons: primary orange (pressed `#CC3A05`, disabled hairline+muted), cream (border beige-deep), dark ink, secondary outline, link orange; padding 10/20
- Cards: base/feature (white, hairline-soft, r12, pad 24/32), cream, featured (cream + **2px orange border**), photographic/code dark `#1C1C1E`
- Inputs: 44px, 1px `hairline-strong`, radius 8, focus = 2px accent border
- Tabs: pill (active = ink bg) used sparingly; segmented underline (active = orange 2px bottom border)
- Badges: orange/cream/dark, radius full, caption-bold 13/600, pad 4/10
- Code block: dark `#1C1C1E`, mono, radius 8, header bar with `rgba(255,255,255,.08)` bottom border
- Feature icon tile: cream bg, beige border, radius 8, pad 16
- Promo banner: dark strip above nav

## Vibe (the part the user loves)

Vibe is Mistral's terminal-first agent (CLI + VS Code extension, github.com/mistralai/mistral-vibe).
Its product surfaces keep the sunset palette but live on **dark terminal panels** with mono type.
→ Implication: our system ships **two themes** — `daylight` (cream/ink/orange marketing) and
`terminal` (dark, for harness/CLI surfaces).
