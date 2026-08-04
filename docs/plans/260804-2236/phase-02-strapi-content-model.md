# Phase 2: Strapi Content Model & i18n

## Context Links
- [Solution Design](./solution-design.md) - Section 6: Database Changes

## Overview
- **Priority:** P1
- **Current status:** Pending
- **Brief description:** Configure Strapi plugins, i18n, and create the schema for all content types (`service`, `case-study`, `virtual-kol`, `site-setting`, `seo-meta`).

## Requirements
- Define schema for services, case studies, KOLs, and site settings.
- Implement i18n (`vi` default, `en` secondary).
- Set up Cloudflare R2 for media uploads.

## Architecture
- Use Strapi Content-Type Builder / schema.json.
- Configure `@strapi/provider-upload-aws-s3` for R2.

## Related Code Files
- `[NEW]` `apps/cms/config/plugins.ts`
- `[NEW]` `apps/cms/src/api/service/content-types/service/schema.json`
- `[NEW]` `apps/cms/src/api/case-study/content-types/case-study/schema.json`
- `[NEW]` `apps/cms/src/api/virtual-kol/content-types/virtual-kol/schema.json`
- `[NEW]` `apps/cms/src/api/site-setting/content-types/site-setting/schema.json`
- `[NEW]` `apps/cms/src/components/seo/seo-meta.json`

## Implementation Steps
1. Install and enable the `i18n` plugin if not enabled by default. Add `vi` and `en` locales.
2. Configure R2 provider in `plugins.ts`. Use S3-compatible API.
3. Create reusable component `seo-meta` with `meta_title`, `meta_description`, and `og_image`.
4. Create Single Type `site-setting` for global configuration.
5. Create Collection Types: `service`, `case-study`, `virtual-kol`.
6. Ensure relations are properly set (Service has many Case Studies).
7. Configure localization options: enable localized on display fields, disable on relationships/slugs/media if appropriate.

## Todo List
- [ ] Configure R2 Upload Provider
- [ ] Define `seo-meta` component
- [ ] Define `site-setting` schema
- [ ] Define `service` schema
- [ ] Define `case-study` schema
- [ ] Define `virtual-kol` schema

## Success Criteria
- Strapi Admin allows creating localized entries for all content types.
- Image uploads successfully save to Cloudflare R2.
- Relations work correctly.

## Risk Assessment
- **Risk:** R2 CORS or Bucket policy issues.
- **Mitigation:** Follow Cloudflare R2 and S3 API docs closely for Strapi integration.

## Security Considerations
- R2 API Keys must be securely stored in `.env`.
- Limit API public access to only required endpoints (find, findOne).

## Next Steps
- Phase 3: Design System
