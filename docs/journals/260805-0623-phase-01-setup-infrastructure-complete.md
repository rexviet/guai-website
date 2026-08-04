# Phase 1 "Setup Infrastructure" Completion — Real Issues Found and Fixed

**Date**: 2026-08-05 03:15
**Severity**: High (4 config issues found and fixed before commit)
**Component**: Docker, Strapi v5 TypeScript, Nginx, PostgreSQL
**Status**: Resolved

## What Happened

Phase 1 infrastructure scaffolding completed for the GuAI Studio monorepo: Strapi v5 CMS + PostgreSQL in Docker, Nginx reverse proxy, deployed on a 2GB RAM VPS. Built and deployed commits `e316cf1` (infra scaffold) and `d56ce8c` (README + plan sync). All work passed code review after fixes.

**Delivered:**
- Monorepo skeleton: `apps/cms` (Strapi v5 TS, Postgres-configured), `apps/web` (reserved for Phase 4), `infra/{nginx,scripts}`
- `apps/cms/Dockerfile` — multi-stage production build, non-root user
- `infra/docker-compose.yml` — Strapi + Postgres with hard log rotation (10m max-size), memory limits (512M/768M)
- `infra/scripts/prune-docker.sh` — weekly cron for disk cleanup (VPS has a documented history of disk-full incidents)
- `infra/nginx/guai-studio.conf` — reverse proxy, Certbot-ready, real 404 fallback
- Root `README.md` — monorepo layout + dev quick start

## The Brutal Truth

Three types of issues surfaced: build system footguns, one critical security hole, and architectural assumptions that would break the stated success criteria. The real kick in the teeth is that the Strapi exposure — binding the admin panel directly to `0.0.0.0:1337` — would have put an unauthenticated, plain-HTTP admin interface on the public internet. This isn't a "nice to fix" — this is production-breaking without code review. The other issues (upload size limits, SPA routing) would have silently broken functionality or made SEO impossible.

The frustrating part is that `docker build` and `docker compose config` alone didn't catch any of these. Static checks are incomplete.

## Technical Details

**Build Issues (during Dockerfile implementation):**
1. **sharp/npm race condition**: `npm ci` triggered parallel rebuilds that failed. The fix was non-obvious: `npm ci --ignore-scripts && npm rebuild` (force serial rebuild).
2. **vips-dev in build stage**: Presence of `vips-dev` broke sharp's prebuilt-binary detection, forcing a failed from-source compile. Removing all native build toolchain packages fixed it — but only after 20 minutes of debugging why sharp wouldn't build.
3. **Missing tsconfig.json in production**: Strapi's `start` command reads `tsconfig.json` to resolve the `distDir` for the TypeScript config. Without it in the production stage, Strapi crashed at boot with:
   ```
   Cannot destructure property 'client' of 'db.config.connection' of undefined
   ```
   This was caught by an optional full `docker compose up` smoke test, not by `docker build` alone.

**Code Review Issues (4 found, all fixed):**
- **CRITICAL**: `docker-compose.yml` published Strapi on `0.0.0.0:1337` — exposed unauthenticated admin panel to the public internet over plain HTTP. Fixed: bound to `127.0.0.1:1337`.
- **High**: Nginx had no `client_max_body_size` directive, defaulting to 1MB. Would silently reject media uploads (hero video, thumbnails, lead attachments) with a generic 413 at the Nginx layer. Fixed: added `client_max_body_size 50m`.
- **Medium**: Nginx routing had `try_files ... /index.html` fallback — an SPA-style catch-all that soft-200s every unmatched URL to the homepage. This directly contradicts the success criteria ("improve Google-indexable multi-page SSG site"). Fixed: real `404` fallback.
- **Medium**: No per-container memory limits despite the VPS's documented disk-exhaustion history from unbounded Docker logs. Fixed: added `deploy.resources.limits.memory: {512M, 768M}`.

## What We Tried

1. Initial Dockerfile built clean locally but failed on `docker compose up` due to missing tsconfig.json — solved with full smoke test, not static check.
2. Sharp build failures prompted investigation of prebuilt binaries vs. source compilation — initially tried adding `python3`, then realized `vips-dev` was the culprit.
3. `npm ci --ignore-scripts` alone didn't work (rebuild step needed); `npm ci --ignore-scripts && npm rebuild` was the fix.
4. Nginx config validated with `nginx -t`, but this doesn't catch missing directives like `client_max_body_size` — only syntax errors.

## Root Cause Analysis

**Build System Complexity**: Node.js native module rebuilds (sharp, bcrypt, etc.) are fragile across different build environments. The VPS has musl libc (Alpine-based or similar container), which is incompatible with glibc prebuilt binaries. This isn't documented in the Strapi setup; it's a Docker-specific footgun.

**Incomplete Validation**: `docker build` + `docker compose config` don't validate runtime behavior. The tsconfig.json issue only manifested at boot. Static checks caught syntax but not semantic config holes.

**Security Default Assumption**: Docker Compose's default is to expose all published ports to `0.0.0.0`. This is fine for local dev, dangerous for production. The fix is trivial (`127.0.0.1:1337`), but requires active recall of the threat model. No enforcement mechanism caught it.

**Routing Assumptions**: The nginx `try_files /index.html` fallback is standard for SPAs (React, Vue, Svelte). Blindly copied from a boilerplate. The project is explicitly not an SPA — it's a multi-page SSG site (Astro, Phase 4). This assumption was never validated against the actual requirements.

## Lessons Learned

1. **Static checks are incomplete**: Run a live smoke test (`docker compose up`, hit an endpoint) for infra phases, not just `docker build`. Tsconfig.json wouldn't be caught otherwise.

2. **Security defaults require active recall**: Binding to `0.0.0.0` is never the right default for production services. Make this a checklist item, not a code review surprise.

3. **Understand the deployment context**: A 2GB VPS with disk-exhaustion history isn't the same as a dev laptop. Resource limits and log rotation aren't nice-to-have; they're required from day one.

4. **Validate architectural assumptions**: "SPA-style routing" is muscle memory. This project is multi-page static. The routing config should have been validated against the stated success criteria before shipping.

5. **Document build footguns**: Node.js native module rebuilds in containers are common but fragile. Future implementers need a written note: "If sharp fails, check for native build toolchain packages in the base image."

## Next Steps

1. **Document known build workarounds**: Add a note to `apps/cms/Dockerfile` or the Phase 1 checklist about the `npm ci --ignore-scripts && npm rebuild` dance and why.

2. **Add a smoke test to CI**: Before Phase 2 (Strapi configuration), ensure `docker compose up` reaches a ready state with health checks or a quick curl to the Nginx endpoint.

3. **Security checklist for Phase 2**: Any new service binding (Redis, API, admin panels) needs a bindings review — document which should be localhost-only vs. externally accessible.

4. **Memory/resource monitoring**: Phase 2 should add `docker stats` logging or a simple Prometheus exporter. The VPS is small; we need visibility before it runs out of disk again.

5. **Routing validation**: Phase 4 (Astro frontend) must confirm that Nginx routing assumptions match the actual SSG structure, not copy SPA patterns.

---

**Commits involved**: `e316cf1` (infra scaffold), `d56ce8c` (README + plan sync). Out-of-band commit `fc2652a` moved docs structure mid-session (not part of this phase's work, but required plan-sync adaptation).
