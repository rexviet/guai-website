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

## Reflection
- **Granular replacements vs. Bulk copy:** When working with highly structured exports from site builders like Webflow, stripping out sections to paste into components is extremely dangerous without fully understanding the global wrappers. It is often safer to copy the whole DOM tree and then selectively inject dynamic variables.
- **Visual testing with animations:** Automated debugging scripts with Puppeteer (`capture_debug.js`) were helpful, but initially misleading. Puppeteer took a snapshot before Webflow's scroll-based `opacity: 0` -> `1` animations could fire, making it look like text was missing when it was actually just invisible. Modifying the script to force `opacity: 1` helped verify that the text was indeed in the DOM and correctly formatted.
- **Port management:** Leaving lingering Astro dev servers on different ports (e.g., 4321, 4322) caused confusion as the debug script fetched outdated cached states.

## Decisions
- Used the full `kakao_home.html` body content inside Astro's `<BaseLayout>` to guarantee 100% fidelity to the original theme.
- Added strict fallback logic for all multimedia fields to prevent structure collapse if Strapi data is incomplete.
- Chose to inject dynamic data natively using Astro's JSX interpolation rather than attempting complex client-side hydration, maximizing performance and SEO.

## Unresolved Issues (To-Do for Next Session)
- **CSS Overlaps / Z-index conflicts:** Several elements are currently overlapping or bleeding into each other (e.g., the large "GUAI" typography is overlapping with the "Variety/Quality/Innovation" sections, and sticky elements are bleeding into other sections). We need to debug the z-index, absolute positioning, and flex layout overrides that are causing this.

## Next Steps
- **Fix CSS Overlaps:** Resolve the layout/overlapping issues documented above.
- Verify if the user wants to adapt other pages (e.g., About Us, Contact) to this Webflow theme structure.
- Replace the mock Strapi data with the real API endpoints once the backend is fully populated.
- Clean up any unused legacy Astro components that were replaced by the Webflow structure.
