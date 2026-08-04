# Phase 4: Astro Pages & SEO

## Context Links
- [Solution Design](./solution-design.md)

## Overview
- **Priority:** P1
- **Current status:** Pending
- **Brief description:** Build the actual web pages, fetch content from Strapi, and implement i18n routing and dynamic SEO metadata.

## Requirements
- Pages: Homepage, Services, Work, Virtual KOL, About, Contact.
- Dynamic routing for `[slug].astro`.
- Multi-language support: `vi` at `/`, `en` at `/en/`.
- Fallbacks for missing translations.
- Helper scripts for SEO, `hreflang` tags, and generating sitemaps.

## Architecture
- Fetch wrappers in `lib/strapi-client.ts` to call Strapi REST API at build time.
- Astro dynamic routing (`getStaticPaths`).
- SEO helper `lib/seo.ts` to map Strapi `seo-meta` to HTML tags.

## Related Code Files
- `[NEW]` `apps/web/src/lib/strapi-client.ts`
- `[NEW]` `apps/web/src/lib/seo.ts`
- `[NEW]` `apps/web/src/pages/index.astro`, `apps/web/src/pages/en/index.astro`
- `[NEW]` `apps/web/src/pages/work/[slug].astro`
- `[MODIFY]` `apps/web/astro.config.mjs`

## Implementation Steps
1. Create `strapi-client.ts` with typed functions to fetch content (`getServices`, `getCaseStudies`, etc.) passing `locale`.
2. Configure `astro.config.mjs` for `@astrojs/sitemap` and internal i18n routing.
3. Build `lib/seo.ts` to handle metadata fallback and generate `<link rel="alternate" hreflang="...">`.
4. Build Homepage, displaying hero showreel, featured services, and featured works.
5. Build dynamic pages for Services and Work details.
6. Implement EN versions using the same Astro components but fetching `locale=en`.
7. Handle fallback logic if EN content is empty.

## Todo List
- [ ] Build Strapi API client wrapper
- [ ] Implement SEO helper and sitemap
- [ ] Build Homepage (VI & EN)
- [ ] Build Services & Work dynamic routes
- [ ] Build About & KOL pages
- [ ] Integrate analytics tags (GA4 / Meta Pixel)

## Success Criteria
- Running `astro build` successfully generates all static pages in both languages.
- SEO tags, og:images, and hreflang are correct on all pages.
- Data accurately reflects Strapi content.

## Risk Assessment
- **Risk:** Build failures due to missing data in Strapi.
- **Mitigation:** Implement robust null-checking and fallbacks in the Astro templates.

## Next Steps
- Phase 5: Contact Form & Lead Pipeline
