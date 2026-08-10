# CLAUDE.md

Guidance for Claude Code when working in this repository.

## What this project is

Marketing website + CMS for **GuAI Studio** (an AI creative agency in Vietnam).
Static Astro frontend fed by a Strapi v5 headless CMS, deployed to a single small VPS.
All 7 build phases are complete (see the table in `README.md`); work now is
incremental feature/content/CMS-UX changes, not greenfield.

## Monorepo layout

```
apps/cms/     Strapi v5 (TypeScript, Node 22) — content model, admin panel, REST API
apps/web/     Astro 7 (SSG) — public site, builds to apps/web/dist/
infra/        docker-compose (Strapi + Postgres), Nginx config, prune script
docs/         plans / solution-designs / brainstorms / journals + ops & deployment manuals
.github/      build-and-deploy.yml — the only CI workflow
```

There is **no root `package.json` and no workspace tooling**. Each app has its own
`package.json` and `node_modules`. Always run npm with `--prefix apps/web` /
`--prefix apps/cms`, or `cd` into the app first.

## Architecture in one pass

1. Editors publish content in Strapi Admin (`/admin`).
2. A `strapi.db.lifecycles` subscriber in `apps/cms/src/index.ts` fires
   `triggerGitHubDispatch()` (debounced 2s, `apps/cms/src/services/github-dispatch.ts`)
   → GitHub `repository_dispatch` event `strapi_content_update`.
3. `.github/workflows/build-and-deploy.yml` builds `apps/web` and rsyncs `dist/`
   to `/var/www/guai-studio/releases/<sha>` on the VPS, then atomically swaps the
   `current` symlink and prunes to the last 5 releases.
4. Nginx serves `/var/www/guai-studio/current` at `guai.studio` and proxies
   `/api` + `/admin` to `127.0.0.1:1337` (Strapi is loopback-bound; Nginx is the
   only public entrypoint).

Media uploads go to **Cloudflare R2** via the `aws-s3` provider (`apps/cms/config/plugins.ts`).
Contact form leads POST to a custom unauthenticated route `POST /api/leads`
(`apps/cms/src/api/lead/`), verified with Cloudflare Turnstile and emailed via Resend.

### Content model (`apps/cms/src/api/*/content-types/*/schema.json`)

| Type | Kind | Notes |
|---|---|---|
| `service` | collection | has `featured_video` (component) |
| `case-study` | collection | portfolio/works, has `video` |
| `virtual-kol` | collection | AI influencers |
| `site-setting` | single | `banner_video`, `cta_video`, logo, contact, default SEO |
| `lead` | collection | contact submissions; not public-readable |

Components: `seo.seo-meta`, `shared.video-source` (single `video_file` media field).

i18n: **`vi` is the default locale, `en` is secondary.** Locales are seeded on boot by
`seedI18nLocales()` in `apps/cms/src/index.ts` (Strapi v5 has no static locale config).
Astro mirrors this: `prefixDefaultLocale: false`, so `/services` is Vietnamese and
`/en/services` is English — **every page under `src/pages/` needs an `en/` twin.**

## Common commands

```bash
# Full local stack (Strapi + Postgres)
docker compose -f infra/docker-compose.yml up -d      # http://localhost:1337/admin
docker compose -f infra/docker-compose.yml down

# Or run the apps directly
npm run dev --prefix apps/cms         # strapi develop, :1337
npm run dev --prefix apps/web         # astro dev, :4321

npm run build --prefix apps/web       # → apps/web/dist
npm run build --prefix apps/cms       # builds the Strapi admin panel

# Tests use the node: built-in runner (no vitest/jest installed, no npm script)
node --test --experimental-strip-types apps/web/src/lib/*.test.ts
cd apps/cms && node --test dist/src/services/*.test.js   # after npm run build
```

Env files: `infra/.env` (compose secrets, from `infra/.env.example`),
`apps/cms/.env` (Strapi + R2, from `apps/cms/.env.example`), `apps/web/.env`.
Real `.env` files are gitignored — never commit them or print their contents.

## Landmines — read before debugging

- **`STRAPI_URL` vs `STRAPI_API_URL`.** The Astro code reads `STRAPI_URL`
  (`apps/web/src/lib/strapi-client.ts:5`, `lead-client.ts:66`, `ContactForm.astro:10`),
  but the CI workflow and `docs/deployment.md` set `STRAPI_API_URL`. The mismatch is
  silent — the client falls back to `http://localhost:1337`, the fetch fails, and the
  page renders **fallback mock data instead of erroring**. If production shows stale or
  wrong content, check this first.
- **Fallback mock data hides API failures.** Every `getX()` in `strapi-client.ts`
  wraps its fetch in `try/catch` and returns a hardcoded fallback object on failure.
  Great for offline dev, terrible for diagnosis. When content looks wrong, verify the
  Strapi response directly (`curl localhost:1337/api/services?populate=*`) before
  touching the Astro template.
- **Fresh Strapi returns 403 on every public API.** After a first boot you must grant
  the `Public` role `find`/`findOne` on service, case-study, virtual-kol, and `find` on
  site-setting (Settings → Users & Permissions → Roles → Public). Documented in
  `docs/ops-manual.md` §1.3.
- **`infra/docker-compose.yml` publishes Postgres on `5433:5432`** despite an inline
  comment saying it deliberately does not. Don't trust that comment; the port is open
  on the host.
- **Compose does not pass R2 / Turnstile / Resend / GitHub-dispatch vars** into the
  `strapi` service — only DB and Strapi secrets. Media upload, lead email, and the
  rebuild webhook stay disabled under compose unless you add those env keys.
- **Do not run `infra/scripts/prune-docker.sh` locally.** It is
  `docker system prune -af --volumes` and will wipe unrelated Docker work.
- **`seedHomepageData()` runs on every boot** (`apps/cms/src/index.ts`). It backfills
  missing videos and force-rewrites Content-Manager edit layouts for
  `shared.video-source`. If an admin field ordering change "reverts itself" after a
  restart, this is why.
- **`generateSeoTags()` expects `{ title, description }`** but several pages pass
  `{ metaTitle, metaDescription }` (e.g. `apps/web/src/pages/index.astro`), so those
  pages silently get the default title. Fix the caller, not the helper, if you touch it.

## Conventions

- **Frontend markup is a ported Webflow theme** ("Kakao"), pulled from a remote
  Webflow CDN stylesheet in `BaseLayout.astro`. Pages carry Webflow's `data-w-id`
  attributes and class names (`base-container`, `advantages-list`, …) — keep them,
  the theme's JS animations key off them. Local `src/styles/design-tokens.css`
  overrides Webflow's CSS variables to the GuAI palette (Midnight Blue `#0B1026`,
  Electric Violet `#6C4DFF`, Cyan `#22D3EE`) rather than restyling components.
  Tailwind is *not* installed despite what `apps/web/AGENTS.md` implies.
- **User-facing copy is Vietnamese first**, English in the `/en/` pages and locale
  branches. Validation and API messages returned to users are Vietnamese too.
- **Commits are Conventional Commits with a scope**: `feat(cms):`, `fix(web):`,
  `style(web):`, `docs:`. Keep that shape.
- **Docs live in `docs/` under dated folders.** Non-trivial work is expected to leave
  a trail: `docs/brainstorms/` → `docs/solution-designs/` → `docs/plans/<date>/` →
  `docs/journals/`. Read the newest solution design before changing the CMS schema.
- Infra files (compose, Nginx, Dockerfile) carry long explanatory comments recording
  hard-won fixes — the sharp/libvips build workaround, the `tsconfig.json`-in-production
  requirement, the loopback bind. Read them before editing; preserve them.

## Deployment

Push to `main` (or an editor publishing content) triggers the frontend deploy
automatically. The backend is deployed by hand on the VPS:
`docker compose -f infra/docker-compose.yml up -d --build`.
Required GitHub secrets: `VPS_HOST`, `VPS_USER`, `SSH_DEPLOY_KEY`, `STRAPI_API_URL`,
`SITE_URL`. Full procedure in `docs/deployment.md`; editor-facing runbook in
`docs/ops-manual.md`.
