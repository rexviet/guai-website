---
date: 2026-08-07
time: 22:35
topic: Kakao Theme Integration
---

# Journal: Kakao Theme Integration

## Context
The user requested integrating the Kakao Wcopilot HTML/CSS theme into our Astro-based GuAI Studio website (`index.astro`), specifically wiring it up with dynamic content from Strapi (Services and Case Studies mock data). However, initial attempts severely broke the layout and Webflow interactions because sections were copied individually without their outer wrappers and necessary `<head>` metadata. The user was frustrated that the result didn't look like the original theme at all.

## What Happened
- Discovered that previous file replacements stripped away critical Webflow wrappers and initialized states (e.g., `data-w-id`, `opacity: 0`).
- Replaced the entire body of `index.astro` with the complete structure from `kakao_home.html`, carefully removing only the `<!doctype html>` and head section which were already handled by Astro's `<BaseLayout>`.
- Restored the Webflow HTML structure completely, preserving grid systems, absolute positioning for videos, and scroll interactions.
- Mapped Strapi mock data for Services and Case Studies properly using regex replacements on the static HTML, injecting `{caseStudies[0]?.title}` and `{services[i]?.title}`.
- Identified and fixed an issue where missing `featured_image` data caused the Webflow video elements to collapse to 0x0 height. We added a fallback to a generic `bannerVideo` and `bannerPoster` to preserve the layout.
- Resolved an Astro compiler error (`Expected corresponding JSX closing tag for 'div'`) caused by improperly cutting the footer wrapper section.
- Converted the Header's static "Services" dropdown to dynamically fetch and map Strapi services, widening the CSS container to prevent text clipping.
- Refactored the homepage "Our Services" grid to dynamically loop through Strapi data instead of using 3 hardcoded blocks. 
- Transformed the "Our Services" grid into a horizontal slider to fix visual imbalance (holes in the grid) when rendering an odd number of items (5 services). Added absolutely positioned custom left/right navigation buttons for a standard carousel UX.
- Applied final UI polishes: Replaced Kakao logos with "GUAI", fixed hero title line-breaking using `<br />`, and aggressively removed the injected "Made in Webflow" badge via a MutationObserver script.

## Reflection
- **Granular replacements vs. Bulk copy:** When working with highly structured exports from site builders like Webflow, stripping out sections to paste into components is extremely dangerous without fully understanding the global wrappers. It is often safer to copy the whole DOM tree and then selectively inject dynamic variables.
- **Webflow JS Interference:** Webflow's `webflow.js` script enforces certain behaviors, such as injecting the Webflow badge and relying heavily on `data-w-id` for animations. Circumventing these requires aggressive JS overrides (like MutationObservers) or careful preservation of attributes (like ensuring `autoplay` boolean attributes compile correctly in Astro).
- **Visual testing with animations:** Automated debugging scripts with Puppeteer (`capture_debug.js`) were helpful, but initially misleading. Puppeteer took a snapshot before Webflow's scroll-based `opacity: 0` -> `1` animations could fire, making it look like text was missing when it was actually just invisible. Modifying the script to force `opacity: 1` helped verify that the text was indeed in the DOM and correctly formatted.

## Decisions
- Used the full `kakao_home.html` body content inside Astro's `<BaseLayout>` to guarantee 100% fidelity to the original theme.
- Added strict fallback logic for all multimedia fields to prevent structure collapse if Strapi data is incomplete.
- Replaced Webflow's default wrapping grid for Services with a custom horizontal flex slider and JS navigation to gracefully handle any number of dynamic CMS entries without breaking the grid aesthetics.

## Resolved Issues
- **CSS Overlaps / Z-index conflicts (FIXED 2026-08-07 22:55):** The Kakao theme uses a "sticky footer reveal" pattern where `.footer-con` has `position: sticky; inset: auto 0% 0%`. Content sections must have `position: relative` + proper `z-index` to scroll OVER the footer. Added CSS overrides in `BaseLayout.astro` establishing a z-index hierarchy: header (z:1000, from `.w-nav`), hero (z:90), content sections (z:50 down to z:15), footer (z:1). All sections now stack correctly.
- **Webflow Badge Removal (FIXED):** CSS `!important` was insufficient to hide the Webflow badge due to how `webflow.js` injects it. Solved using a `MutationObserver` in `BaseLayout.astro` to remove the DOM node aggressively upon insertion.

## Next Steps
- Verify if the user wants to adapt other pages (e.g., About Us, Contact) to this Webflow theme structure.
- Replace the mock Strapi data with the real API endpoints once the backend is fully populated.
- Clean up any unused legacy Astro components that were replaced by the Webflow structure.
