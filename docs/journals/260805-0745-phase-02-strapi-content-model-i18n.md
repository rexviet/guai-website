# Phase 2 "Strapi Content Model & i18n" Completion — One Critical Design Decision Left Unresolved

**Date**: 2026-08-05 07:45
**Severity**: Medium (architectural decision flagged, deferred for Phase 3+)
**Component**: Strapi v5 TypeScript, PostgreSQL, Cloudflare R2, i18n locales
**Status**: Resolved (with documented open decision)

## What Happened

Phase 2 content model and internationalization scaffolding completed: Strapi v5 configured with Cloudflare R2 upload provider, idempotent i18n locale bootstrap, and five production-ready content types/components. Built and deployed commits `34e6272` (implementation) and `4d53f71` (docs sync-back). Full verification against live PostgreSQL, not mocked.

**Delivered:**
- **Upload provider**: `@strapi/provider-upload-aws-s3` configured for R2 with `forcePathStyle: true` and `params.ACL: undefined` (bypasses S3 ACL headers that R2 rejects)
- **I18n bootstrap hook**: `seedI18nLocales()` in `apps/cms/src/index.ts` creates `vi`/`en` locales on every boot, sets `vi` as default, with full idempotency (verified: booted twice against real Postgres, zero duplicate locale rows)
- **Content components**: `seo-meta` (meta_title, meta_description, og_image — all localized)
- **Collection types**: `service` and `case-study` with `oneToMany`/`manyToOne` relation (`mappedBy`/`inversedBy`), `virtual-kol` (standalone)
- **Single type**: `site-setting` with all configuration fields, including video/hero/branding placeholders
- **Localization policy**: Display fields (title, description) localized; slugs, media, and relations remain non-localized (as per solution design)

## The Brutal Truth

The architecture is solid, but one decision bit us during code review and will require a future call: **`site-setting.showreel_video` should self-host to conserve R2 quota and reduce hero-video latency**, but Strapi v5's upload plugin architecture only supports one global provider per instance. Per-field provider routing requires custom middleware, which was scoped out for this phase because it felt like a yak-shave. The trade-off is now documented and visible to stakeholders, but it's not resolved. Shipping the video to R2 means burning free-tier quota on a large asset that never changes — not ideal. The alternative (custom upload middleware) is a real task that will surface again in Phase 3 or Phase 4, and we need to commit to it then, not hand-wave.

What makes this painful is that the solution design *anticipated* this decision, but we didn't validate it against Strapi's actual constraints until mid-implementation. Better to discover it now than at video-serving time.

## Technical Details

**R2 Upload Configuration** (`apps/cms/config/plugins.ts`):
```typescript
upload: {
  config: {
    provider: 'aws-s3',
    providerOptions: {
      baseUrl: env('R2_PUBLIC_URL'),
      s3Options: {
        credentials: {
          accessKeyId: env('R2_ACCESS_KEY_ID'),
          secretAccessKey: env('R2_SECRET_ACCESS_KEY'),
        },
        region: env('R2_REGION', 'auto'),
        endpoint: env('R2_ENDPOINT'),
        forcePathStyle: true,  // R2 requires path-style URLs, not virtual-hosted
        params: {
          Bucket: env('R2_BUCKET'),
          ACL: undefined,  // CRITICAL: R2 doesn't support S3 ACLs; present-but-undefined key skips the ACL header
        },
      },
    },
  },
}
```
The `forcePathStyle: true` and `params.ACL: undefined` were **verified against the actual `@strapi/provider-upload-aws-s3@5.51.1` source** (`node_modules/.../dist/index.js`), not guessed. The provider skips the default `public-read` ACL *only* when the `ACL` key exists in `params` but is `undefined` — omitting the key entirely would still trigger the default. Non-obvious, required reading the installed package's source directly.

**I18n Idempotency** (`apps/cms/src/index.ts`):
```typescript
export async function seedI18nLocales({ strapi }: { strapi: Core.Strapi }): Promise<void> {
  const localesService = strapi.plugin('i18n').service('locales');

  for (const locale of REQUIRED_LOCALES) {  // [{ code: 'vi', name: 'Vietnamese (vi)' }, { code: 'en', ... }]
    try {
      const existing = await localesService.findByCode(locale.code);
      if (!existing) {
        await localesService.create(locale);
      }
    } catch (error) {
      // code is unique — swallow a concurrent-boot race on the unique
      // constraint, rethrow anything else so real errors still fail boot
      const isUniqueConstraintError = error instanceof Error && /unique/i.test(error.message);
      if (!isUniqueConstraintError) throw error;
    }
  }

  const currentDefault = await localesService.getDefaultLocale();
  if (currentDefault !== 'vi') {
    await localesService.setDefaultLocale({ code: 'vi' });
  }
}
```
**Verified**: Booted `strapi develop` twice against a real temporary PostgreSQL 16 container (`docker run postgres:16-alpine`, not the project's docker-compose — faster than building the Strapi image just for a boot check). After the second boot, `i18n_locale` table contained exactly 2 rows (`en`, `vi`, no duplicates), and the core-store key `plugin_i18n_default_locale` was `"vi"`. The try/catch around the unique-constraint race was added after code review flagged the original version had no error handling around the `findByCode`→`create` check-then-act race.

**Content Model Structure:**
- `seo-meta` component: `meta_title`, `meta_description`, `og_image` — all localized
- `site-setting` single type: `seo-meta` under `default_seo` (localized) + `tagline` (localized) + non-localized `site_name`, `showreel_video`, `logo`, `phone`, `email`, `zalo_link`, `social_links`
- `service` collection: `title`, `short_description`, `full_description`, `seo` all localized; `slug` (uid, not localized), `icon`, `order` not localized; `case_studies` — `oneToMany` to `case-study`, `mappedBy: "service"`
- `case-study` collection: `title`, `description`, `seo` localized; `slug`, `category`, `youtube_video_url`, `thumbnail`, `featured` not localized; `service` — `manyToOne` to `service`, `inversedBy: "case_studies"` (the owning side of the pair above)
- `virtual-kol` collection standalone: `short_bio` localized; `name`, `character_type`, `avatar`, `demo_video_youtube_url`, `order` not localized

**Verification Results:**
- `tsc --noEmit`: clean, no TS errors
- First boot against fresh Postgres created 9 tables cleanly, no migration errors: 5 base tables (`case_studies`, `components_seo_seo_metas`, `services`, `site_settings`, `virtual_kols`), 3 component-link tables (`case_studies_cmps`, `services_cmps`, `site_settings_cmps` — one per content type that embeds `seo-meta`), 1 relation-link table (`case_studies_service_lnk`)
- Second boot: zero new locale rows (idempotency confirmed), `Strapi started successfully` both times

## What We Tried

No real R2 bucket or credentials existed yet for this phase (`.env` only has placeholder R2 values), so the provider config couldn't be validated against a live upload — it was verified statically instead:

1. Rather than trust the provider's README (sparse on R2-specific ACL behavior), pulled `@strapi/provider-upload-aws-s3@5.51.1` via `npm pack` and read `dist/index.js` directly to confirm exactly how it decides whether to send an `ACL` header, before writing the config — not by hitting a live rejection and reacting to it.

2. Wrote the i18n bootstrap hook idempotent from the start (`findByCode` before `create`), since a containerized app that re-runs its bootstrap on every restart makes a non-idempotent seed a predictable eventual failure, not an edge case. Code review then flagged that the `findByCode`→`create` sequence still had a check-then-act race with no error handling if it lost that race — fixed by wrapping in try/catch and only swallowing a unique-constraint error specifically.

3. Considered custom middleware for per-field upload routing so `showreel_video` could bypass R2. Confirmed the blocker: `plugin::upload`'s config (`provider`/`providerOptions`) is a single global setting read by the upload service for every file, with no built-in per-field or per-content-type override. Routing one field differently would mean writing a custom controller for `site-setting` that bypasses the plugin's upload service for that field — real engineering, not a config tweak. Deferred as an explicit open decision in the Risk Assessment rather than scoping unplanned work mid-phase.

4. Content model was checked with `tsc --noEmit` first (passed), but that only validates TypeScript — it says nothing about whether Strapi's own schema/migration engine accepts the JSON. Live-booted against Postgres twice to actually confirm the tables, relations, and locale seeding behave as intended.

## Root Cause Analysis

**R2 ACL Handling Is Not Obvious From Docs**: AWS S3 and Cloudflare R2 share an API surface but diverge on ACLs — R2 doesn't support them. The provider's own README doesn't spell out how to disable the default `public-read` ACL for R2; the answer (set `params.ACL` to `undefined`, not omit it) was only found by reading the provider's source.

**I18n Idempotency Isn't Automatic**: Strapi v5's i18n plugin seeds one default locale on first boot but has no static locale config — anything beyond that single default has to be seeded by application code, and a container that re-runs `bootstrap()` on every restart needs that seed to be safe to repeat.

**Per-Field Provider Routing Isn't Supported**: Strapi's upload plugin treats the provider as a single global setting. The solution design's "self-host just the showreel video" requirement assumed field-level routing was available as a config option — it isn't; it would require custom middleware. This surfaced only once the schema was actually being wired up against the real plugin config shape, not during design.

## Lessons Learned

1. **Verify provider config against the actual source code, not docs**: R2 + S3 API compatibility is subtle. The provider source is the source of truth for how ACL headers are sent.

2. **Containerized i18n bootstrap must be idempotent**: Every boot will run migrations and seeds. Build idempotency checks into locale setup from day one.

3. **Validate solution design assumptions against implementation constraints early**: The "self-host showreel_video" decision was a good intent but missed a Strapi architectural limitation. Catch these in design review, not mid-implementation.

4. **Document open decisions with a clear resolution path**: This decision is now in the risk assessment section of the Phase 2 plan, marked for a Phase 3+ call. Future developers won't wonder why it's not done; they'll see the rationale.

5. **Test content models against real databases, not mocks**: SQLite (if `better-sqlite3` were installed) would hide junction table issues that Postgres reveals. Real database testing is worth the setup time.

## Next Steps

1. **Resolve showreel_video routing (Phase 3+)**: Either commit to scoping a custom upload path so the hero video stays self-hosted, or accept that all uploads go to R2 (a single optimized hero video is small against the 10GB free tier). Requires an explicit decision, not another deferral — see the open item in `docs/plans/260804-2236/phase-02-strapi-content-model.md`'s Risk Assessment.

2. **Add R2 provider config to CI secret docs**: `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`, `R2_BUCKET`, `R2_ENDPOINT`, `R2_REGION`, `R2_PUBLIC_URL` are already documented with placeholders in `apps/cms/.env.example` and the project README — carry them into whatever CI/CD secrets setup Phase 6 introduces.

3. **Monitor i18n locale table**: Add a simple logging statement or metric to track locale count on each boot. If it ever exceeds 2, the idempotency check failed silently.

4. **Phase 3 content population**: The models are ready; next phase is seeding example data (services, case studies, site settings). Use live Postgres from day one (don't mock).

5. **Phase 4 frontend integration**: The Astro frontend will consume these endpoints. Coordinate with Phase 4 on query shape (which fields to include, which to localize).

---

**Commits involved**: `34e6272` (implementation), `4d53f71` (docs sync-back).
