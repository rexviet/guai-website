# Phase 6: CI/CD Pipeline

## Context Links
- [Solution Design](./solution-design.md) - Section 5.1/5.2

## Overview
- **Priority:** P1
- **Current status:** Pending
- **Brief description:** Automate the build and deploy process using GitHub Actions triggered by Strapi webhooks.

## Requirements
- GitHub Actions workflow that builds the Astro project.
- Deploy built static files to VPS via rsync over SSH.
- Setup symlink swapping for zero-downtime deployment.
- Trigger GHA workflow from Strapi when content changes.

## Architecture
- Strapi lifecycle hooks (`afterCreate`, `afterUpdate`, `afterDelete`) trigger GitHub `repository_dispatch`.
- GitHub Actions runner performs `astro build`.
- SSH deploy key used for rsync.

## Related Code Files
- `[NEW]` `.github/workflows/build-and-deploy.yml`
- `[NEW]` `apps/cms/src/index.ts` (Strapi lifecycle hooks)

## Implementation Steps
1. Create `.github/workflows/build-and-deploy.yml` reacting to `push` on `main` and `repository_dispatch`.
2. Configure the GHA workflow to checkout code, setup Node, run `npm ci` and `astro build` in `apps/web`.
3. Add a step to rsync `dist/` to the VPS under `/var/www/guai-studio/releases/{{sha}}`.
4. Add an SSH command to update the `/var/www/guai-studio/current` symlink.
5. In Strapi `apps/cms/src/index.ts`, register a global lifecycle hook or specific model hooks to call the GitHub Actions API upon content updates.
6. Configure concurrency in GHA (`concurrency: production-build`) to cancel overlapping builds.

## Todo List
- [ ] Create GHA Workflow YAML
- [ ] Configure GitHub Secrets (SSH_DEPLOY_KEY, VPS_HOST, STRAPI_API_URL)
- [ ] Implement Strapi webhook to trigger GHA
- [ ] Test end-to-end automated deployment

## Success Criteria
- Modifying content in Strapi triggers a build on GitHub.
- The new static files are successfully deployed to the VPS.
- Zero downtime during the symlink swap.

## Risk Assessment
- **Risk:** Too many builds triggered simultaneously by rapid edits.
- **Mitigation:** Use GitHub Actions concurrency groups; implement debounce in Strapi hook if necessary.

## Security Considerations
- SSH Key should be a deploy key with restricted access.
- GitHub token used in Strapi must have minimal scopes (only repository dispatch).

## Next Steps
- Phase 7: Handover & Go-live
