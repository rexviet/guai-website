# GuAI Studio Website

A modern, high-performance website and CMS platform for GuAI Studio. Built with a TypeScript Strapi v5 backend, PostgreSQL database, and Astro frontend (reserved for Phase 4).

## Monorepo Layout

- **`apps/cms/`** — Strapi v5 CMS (Node.js + TypeScript). Manages content, admin interface (`/admin`), and REST/GraphQL APIs (`/api`).
- **`apps/web/`** — Astro static site generator (Phase 4). Builds the public-facing website from Strapi content.
- **`infra/`** — Infrastructure: Docker Compose orchestration, Nginx reverse proxy, and deployment scripts.

## Local Development (Phase 1+)

### Prerequisites 
- Docker and Docker Compose (v2.20+)

### Setup

1. **Copy environment template and generate real secrets:**
   ```bash
   cp infra/.env.example infra/.env
   ```
   Edit `infra/.env` and replace all `replace_with_generated_*` placeholders with real, unique values. Use:
   ```bash
   node -e "console.log(require('crypto').randomBytes(16).toString('base64'))"
   ```
   to generate secrets.

2. **Start the stack:**
   ```bash
   docker compose -f infra/docker-compose.yml up -d
   ```

3. **Access the services:**
   - **Strapi Admin**: http://localhost:1337/admin (create an account on first visit)
   - **Strapi REST API**: http://localhost:1337/api

### Security Notes
- Strapi is bound to `127.0.0.1:1337` only (loopback). Nginx is the public entrypoint (Phase 6+ deployment).
- PostgreSQL has no host port exposure; only Strapi can reach it via Docker's internal network.
- Both services have hard logging caps (10MB × 3 files) to prevent disk-full incidents.

### Cleanup
```bash
docker compose -f infra/docker-compose.yml down --volumes  # Stop and remove volumes
```

> **Do not run `infra/scripts/prune-docker.sh` on a local dev machine.** It calls
> `docker system prune -af --volumes`, which wipes *all* unused Docker
> containers/images/volumes on the host — safe only on the dedicated,
> single-purpose production VPS (see the script's own header comment). On a
> local machine with other Docker projects, it will delete unrelated work.

### Full Deployment Guide
Tham khảo hướng dẫn chi tiết đầy đủ tại: **[`docs/deployment.md`](docs/deployment.md)**.

## Phase Status

| Phase | Component | Status |
|-------|-----------|--------|
| 1 | Monorepo setup, Strapi CMS, Docker infrastructure | ✅ Complete |
| 2 | Content model (i18n, R2 provider, content types) | ✅ Complete |
| 3 | Design system & Tailwind tokens | ✅ Complete |
| 4 | Astro frontend & SEO | ✅ Complete |
| 5 | Contact form & lead pipeline | ✅ Complete |
| 6 | CI/CD build & deploy pipeline | ✅ Complete |
| 7 | Handover, Ops manual & Go-live | ✅ Complete |

## Phase 2: Content Model (Complete)

Phase 2 implemented the Strapi CMS content model with:

- **Content Types**: `service`, `case-study`, `virtual-kol`, and `site-setting` (single type)
- **Components**: `seo-meta` reusable component for SEO metadata
- **Internationalization (i18n)**: Vietnamese (default) and English locales enabled
- **Media Upload Provider**: Cloudflare R2 S3-compatible storage configured
- **Relationships**: Full relationship configuration between content types (see `apps/cms/src/api/*/content-types/*/schema.json`)

**Required Environment Variables** (in `apps/cms/.env` or container):
- `R2_ACCESS_KEY_ID` — Cloudflare R2 API token access key
- `R2_SECRET_ACCESS_KEY` — Paired secret key
- `R2_BUCKET` — R2 bucket name for media uploads
- `R2_ENDPOINT` — R2 S3 API endpoint URL
- `R2_REGION` — R2 region (`auto` is default)
- `R2_PUBLIC_URL` — Public CDN domain for serving media

See [`apps/cms/.env.example`](apps/cms/.env.example) for full environment setup.

## Infrastructure Reference

- **Docker Compose**: [`infra/docker-compose.yml`](infra/docker-compose.yml) — Strapi + PostgreSQL topology, resource limits, logging configuration.
- **Environment Variables**: [`infra/.env.example`](infra/.env.example) — Required secrets and database configuration.
- **Nginx Config**: [`infra/nginx/guai-studio.conf`](infra/nginx/guai-studio.conf) — Reverse proxy, static site serving, and TLS placeholders for Phase 6.
- **Docker Prune Script**: [`infra/scripts/prune-docker.sh`](infra/scripts/prune-docker.sh) — Weekly cron cleanup for production VPS (see file for setup instructions).

## Notes for Solo/Part-Time Development

- All inline comments in Docker, Nginx, and script files document design decisions and edge cases; read them when modifying infra.
- The `.env` file (containing real secrets) is in `.gitignore` and must never be committed.
- Strapi v5 compiles TypeScript to `dist/` at build time; the Dockerfile's multi-stage build keeps the production image small.
