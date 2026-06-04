# Benefits Section Design

**Date:** 2026-06-04
**File:** `starting-project/app/page.tsx`

## Goal

Add a benefits section to the main page targeting developers considering learning Claude Code. The section should function as a marketing component — answering "why should I care?" rather than listing features.

## Layout

- **2-column grid**, 3 rows × 2 columns = 6 cards total
- Section sits below the existing hero/CTA content in `page.tsx`
- Full-width dark section (`bg-black` / `#0a0a0a`) to visually separate from the white hero above

## Visual Style

- **Dark / developer aesthetic**: dark background, dark cards (`#111`), subtle borders (`#222`)
- **Card anatomy**: emoji icon (left) + title + 1–2 sentence description
- Fits the existing Geist font and zinc/black palette of the page
- Responsive: stacks to 1 column on mobile (`grid-cols-1 sm:grid-cols-2`)

## Section Structure

```
[eyebrow label]    WHY CLAUDE CODE
[heading]          Built for how developers actually work
[subheading]       Six reasons developers are switching their workflow to Claude Code.
[2-col grid]       6 benefit cards
```

## The 6 Benefits (outcome-led)

| # | Icon | Title | Description |
|---|------|-------|-------------|
| 1 | ⚡ | Ship faster | Stop writing boilerplate. Claude Code generates, edits, and refactors end-to-end so you focus on what matters. |
| 2 | 🧠 | Stay in flow | Work entirely in the terminal. No tab switching, no context breaks — just you and your editor. |
| 3 | 🔍 | Understand any codebase | Ask Claude to explain code, trace logic, or map dependencies. Get up to speed on unfamiliar repos fast. |
| 4 | 🛡️ | Fewer bugs | Claude writes tests, spots edge cases, and catches issues before they reach production. |
| 5 | 🤖 | Automate the tedious | Git commits, PR descriptions, docs — offload the work that doesn't need your full attention. |
| 6 | 🎯 | Stay in control | Claude shows its reasoning and diffs before applying changes. Every edit is yours to accept or reject. |

## Implementation Notes

- Add as a new `<section>` inside the existing `<main>` in `page.tsx`
- Use Tailwind classes consistent with the existing file (no new dependencies)
- Dark section should support both light and dark mode (already dark, so dark mode is the default look)
- Icons are plain emoji — no icon library needed
