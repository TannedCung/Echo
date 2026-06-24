---
name: design-system
description: Echo's "Friendly" design language — tokens, components, mascot states, and accessibility rules. Use when building or restyling UI.
---

# Friendly design system

Echo should feel warm and low-anxiety — practicing speaking is stressful, so the
UI reassures.

## Tokens (`app/globals.css`)

- **Background:** warm paper (`--background`). **Foreground:** soft near-black.
- **Primary:** teal (`--primary`). **Accent:** coral (`--accent`).
- Generous rounding (`--radius` 1rem; pills for buttons), soft shadows, ample spacing.
- Full light/dark token sets; never hardcode hex in components — use the `--color-*`
  Tailwind tokens (`bg-primary`, `text-muted-foreground`, etc.).

## Components

- Use `components/ui/*` primitives (e.g. `Button` with `variant`/`size`). Compose,
  don't fork. Add new primitives there following the same cva pattern.
- Buttons are pill-shaped; cards are `rounded-2xl border border-border bg-card`.

## Mascot (Echo)

- States: `idle`, `listening`, `thinking`, `speaking`. Animate reactions to the
  conversation to lower test anxiety. Always ship a reduced-motion fallback
  (`prefers-reduced-motion` is already handled globally in `globals.css`).

## Voice & a11y

- Microcopy is encouraging, growth-framed, never blaming.
- Captions for all audio; keyboard-operable recorder; visible focus rings.

@app/globals.css
@components/ui/button.tsx
