# Color Variable & UI Mapping Guide

This guide details the custom semantic token system defined in [`app/globals.css`](file:///f:/drpython-solutons/frontend/app/globals.css). Use these tokens instead of hardcoded hex values (`#020617`, etc.), Tailwind default slates (`text-slate-400`), or harsh pure whites (`text-white`).

---

## 1. Core Canvas & Surface Colors

These variables set the structure, page containers, and depth of the app layout.

| CSS Variable | Tailwind Utility | HEX / Value | Main Usage & Webpage Content |
| :--- | :--- | :--- | :--- |
| `--color-background` | `bg-background` | `#020617` (Deep Dark Navy) | Full-screen webpage backgrounds, html/body tags, and root page wrappers. |
| `--color-bg-app` | `bg-bg-app` | `#020617` | Layout background alias. |
| `--color-surface-900` | `bg-surface-900` | `#0f172a` (Slightly Lighter Slate-Navy) | Side drawers, action panels, modifiable dialog grids, and sticky headers/footers. |
| `--color-surface-800` | `bg-surface-800` | `#1e293b` | Secondary component backgrounds, tooltip boxes, and container hovers. |
| `--color-surface-700` | `bg-surface-700` | `#334155` | Focused borders, input states, and dropdown menu options. |

---

## 2. Typography & Text System

A 4-tier semantic hierarchy ensures that colors visually convey structure and importance.

| CSS Variable | Tailwind Utility | HEX / Value | Main Usage & Webpage Content |
| :--- | :--- | :--- | :--- |
| `--color-text-primary` | `text-text-primary` | `#e2e8f0` (Warm Off-White) | Page titles (`h1`, `h2`), high-contrast table content, main action texts, navigation items, and text on top of button backgrounds. |
| `--color-text-secondary`| `text-text-secondary` | `#8fa8c8` (Soft Slate-Blue) | Descriptive paragraphs, client names, detailed table body values, and secondary metadata. |
| `--color-text-muted` | `text-text-muted` | `#6b809c` (Lighter Slate-Blue) | Table headers (`th`), service/technology tag texts, small date stamps, and form label descriptors. |
| `--color-text-dim` | `text-text-dim` | `#374f6b` (Dim Navy-Slate) | Unique system identifiers (e.g., Client ID `CLI-0012`), placeholder values in input fields, and inactive hints. |

---

## 3. Brand & Accent Palette

Matches the agency logo theme, with teal as the primary color and red as the secondary alert accent.

| CSS Variable | Tailwind Utility | HEX / Value | Main Usage & Webpage Content |
| :--- | :--- | :--- | :--- |
| `--color-brand-teal` | `bg-brand-teal` / `text-brand-teal` | `#2A9D8F` (Logo Teal) | Primary active states, buttons, progress bars, interactive links, highlights, and icons. |
| `--color-brand-red` | `bg-brand-red` / `text-brand-red` | `#D60000` (Logo Red) | Error boxes, critical status updates, destructive action items (e.g., Delete), and primary highlights. |
| `--color-brand-blue` | `bg-brand-blue` / `text-brand-blue` | `#3b82f6` (System Blue) | Stable tags, info pills, and milestone tracking. |
| `--color-brand-indigo` | `bg-brand-indigo` / `text-brand-indigo`| `#6366f1` (System Indigo) | Clients counters, metrics, and multi-team status updates. |

---

## 4. Borders & Subtle Dividers

Ensures visual layout lines are clean and avoid unnecessary contrast glare.

| CSS Variable | Tailwind Utility | HEX / Value | Main Usage & Webpage Content |
| :--- | :--- | :--- | :--- |
| `--color-border-subtle`| `border-border-subtle` | `rgba(255, 255, 255, 0.05)` | Default component borders, layout grid boundaries, card dividers, and sidebar edges. |
| `--color-border-light` | `border-border-light` | `rgba(255, 255, 255, 0.1)` | Active container states, header bottom borders, and focus rings. |

---

## 5. UI Best Practices for Colors

1. **Never use pure white (`#ffffff` / `text-white`) for body/heading text**
   - Use `text-text-primary` (`#e2e8f0`) to avoid visual fatigue on dark backgrounds.
   - Use `text-text-primary` even on colored backgrounds like `bg-brand-teal` as it has high readability.
2. **Layering Depth**
   - Always put `bg-surface-900` elements (e.g., drawers) on top of a `bg-background` canvas.
   - Separate elements with `border-border-subtle` to keep the layout clean and modern.
3. **Draft vs Live States**
   - Live/Success states: `text-emerald-400` / `bg-emerald-500/10`
   - Draft/Inactive states: `text-text-muted` / `bg-white/5`
   - Critical/Danger: `text-brand-red` / `bg-brand-red/10`
