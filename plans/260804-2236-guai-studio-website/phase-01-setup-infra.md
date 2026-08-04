# Phase 1: Setup Infrastructure

## Context Links
- [Solution Design](./solution-design.md)

## Overview
- **Priority:** P1
- **Current status:** Pending
- **Brief description:** Set up the monorepo structure, Docker Compose for Strapi & PostgreSQL on the VPS, Nginx reverse proxy, and Docker pruning cron jobs.

## Requirements
- VPS (Ubuntu, 2GB+ RAM) provisioned.
- Domain name pointed to VPS IP via Cloudflare.
- Strapi + PostgreSQL running in Docker Compose.
- Nginx configured to reverse proxy to Strapi and serve Astro static files.
- Log rotation and periodic cleanup configured to prevent disk space issues.

## Architecture
- `infra/docker-compose.yml` defining `strapi` and `postgres` services.
- Nginx proxy passing `/api` and `/admin` to Strapi (port 1337).
- Nginx serving `/` from `/var/www/guai-studio/current` (symlinked).

## Related Code Files
- `[NEW]` `infra/docker-compose.yml`
- `[NEW]` `infra/nginx/guai-studio.conf`
- `[NEW]` `infra/scripts/prune-docker.sh`
- `[NEW]` `apps/cms/Dockerfile`
- `[NEW]` `apps/web/package.json`

## Implementation Steps
1. Initialize the monorepo structure with `apps/cms`, `apps/web`, and `infra` directories.
2. Initialize Strapi project in `apps/cms` without starting it.
3. Create `infra/docker-compose.yml` for Strapi and PostgreSQL, configuring strict `logging` options (`max-size: 10m`, `max-file: 3`).
4. Write `apps/cms/Dockerfile` for Strapi production build.
5. Create `infra/scripts/prune-docker.sh` to run `docker system prune -af --volumes` and setup instructions to add it to crontab.
6. Create `infra/nginx/guai-studio.conf` defining server blocks, SSL setup (can use Certbot), reverse proxy to port 1337, and static root at `current` symlink.

## Todo List
- [ ] Initialize monorepo structure
- [ ] Initialize Strapi v5 project
- [ ] Create `docker-compose.yml` with logging constraints
- [ ] Create Nginx config
- [ ] Create Docker cleanup script

## Success Criteria
- Strapi runs locally via docker-compose.
- Nginx configuration is syntactically valid and ready for deployment.
- Monorepo structure is cleanly defined.

## Risk Assessment
- **Risk:** Database initialization failure due to env var mismatch.
- **Mitigation:** Document required `.env` variables clearly in a `.env.example`.

## Security Considerations
- Ensure database ports are not exposed to the public internet (only internal Docker network).
- Secure Strapi admin panel behind HTTPS.

## Next Steps
- Phase 2: Strapi Content Model & i18n
