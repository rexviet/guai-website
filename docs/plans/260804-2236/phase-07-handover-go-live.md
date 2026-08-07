# Phase 7: Handover & Go-live

## Context Links
- [Solution Design](./solution-design.md)

## Overview
- **Priority:** P2
- **Current status:** Completed
- **Brief description:** Prepare the user manual for the non-tech ops team, finalize go-live checklist, and complete project handover.

## Requirements
- Document how to use the Strapi Admin UI for the operations team.
- Final infrastructure health checks.
- Transfer repository/collaboration access.

## Related Code Files
- `[NEW]` `docs/ops-manual.md`

## Implementation Steps
1. Write `docs/ops-manual.md` with screenshots/instructions on:
   - Logging into Strapi.
   - Updating Site Settings (Hero showreel, Contact Info).
   - Adding/Editing Services, Case Studies, KOLs.
   - Explaining localized fields and how to publish the EN version.
   - Managing leads.
2. Perform Go-live checklist:
   - Verify domain DNS propagation.
   - Verify SSL certificates.
   - Test contact form end-to-end in production.
   - Run Google Lighthouse on production site.
3. Add the client as a collaborator to the GitHub repository.

## Todo List
- [x] Draft Ops Manual
- [x] Finalize Go-live checklist
- [x] Run Lighthouse performance and SEO audit
- [x] Grant repository access

## Success Criteria
- Ops team can independently update website content.
- Site is publicly accessible with solid Core Web Vitals.
- Handover is formally completed.

## Risk Assessment
- **Risk:** Non-tech team uploads oversized images.
- **Mitigation:** Emphasize image optimization in the Ops Manual and verify Strapi resizing is active.
