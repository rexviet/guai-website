# Phase 3: Design System

## Context Links
- [Solution Design](./solution-design.md)

## Overview
- **Priority:** P1
- **Current status:** Pending
- **Brief description:** Set up Vanilla CSS design tokens (colors, typography, spacing, dark mode) and basic Astro UI components before building full pages.

## Requirements
- No TailwindCSS; use Vanilla CSS.
- Responsive, fluid design with Dark mode support.
- Define typography (e.g., Inter/Outfit) and color palettes.
- Create base Astro layout and common components (Button, Card, Section).

## Architecture
- Global `index.css` with CSS variables (`--color-primary`, `--font-main`, etc.).
- Astro components for reusable UI elements.

## Related Code Files
- `[NEW]` `apps/web/src/styles/index.css`
- `[NEW]` `apps/web/src/styles/design-tokens.css`
- `[NEW]` `apps/web/src/layouts/BaseLayout.astro`
- `[NEW]` `apps/web/src/components/ui/Button.astro`
- `[NEW]` `apps/web/src/components/ui/Card.astro`

## Implementation Steps
1. Create `design-tokens.css` with CSS variables for colors, typography, spacing, and breakpoints.
2. Implement dark mode preferences using `prefers-color-scheme` and a toggle class.
3. Setup `BaseLayout.astro` that includes the global styles, fonts, and meta viewport tags.
4. Build primitive components like `Button.astro`, `Card.astro` ensuring they consume the defined CSS tokens.
5. Add micro-animations and hover state variables for a dynamic, premium feel.

## Todo List
- [ ] Define CSS design tokens
- [ ] Setup global typography and CSS reset
- [ ] Create `BaseLayout.astro`
- [ ] Build basic UI components
- [ ] Implement dark mode variables

## Success Criteria
- Global CSS is loaded correctly in Astro.
- Components use CSS variables effectively.
- Typography and colors reflect a premium AI studio aesthetic.

## Risk Assessment
- **Risk:** Inconsistent styling across pages.
- **Mitigation:** Strictly enforce the use of CSS variables instead of hardcoded values in component styles.

## Next Steps
- Phase 4: Astro Pages & SEO
