---
name: design-system
description: Echo's "Friendly" design language — tokens, components, mascot states, and accessibility rules. Use when building or restyling UI.
---

# Friendly design system

Echo should feel warm and low-anxiety — practicing speaking is stressful, so the
UI reassures.

## Tokens (`app/globals.css`)

- **Background:** warm paper (`--background`). **Foreground:** soft near-black.
- **Four brand hues:** teal (calm), rose (warm), sage (growth), butter (bright).
  Each has a **soft tint** (`--teal-soft`, … → `bg-primary-soft` etc. for badges,
  halos, highlight cards) and a **deepened fill** (`--teal-deep`, …) that carries
  text accessibly.
- **Semantic roles:** primary = teal-deep, accent = rose, success = sage-deep,
  warning = butter-deep. Use the aliases (`bg-primary`, `bg-success-soft`,
  `text-warning`), never raw hex.
- Generous rounding (`--radius` 1rem; pills for buttons), soft **warm-tinted**
  shadows (`shadow-sm`…`shadow-xl`), brand glows (`--glow-primary`), ample spacing.
- **No gradients** in product UI — calm soft tints only (`<Card tint="primary">`).
- Full light/dark token sets (dark via preference or `.dark`/`[data-theme="dark"]`);
  never hardcode hex — use the `--color-*` Tailwind tokens.
- Mirrors the **Echo Design System** project on claude.ai/design; keep them in sync.

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
