# Brainstorm: Homepage Content & Video Dynamic Loading via Strapi

## Problem Statement & Requirements
1. **Dynamic Video Loading**: All videos on the homepage (banner, services, works, etc.) must be loaded dynamically from the Strapi database using URL strings, replacing the hardcoded Kakao theme videos.
2. **Works Section & Source of Truth**: The entire "Works" section is currently 100% hardcoded (both text content and videos). This must be fully migrated so that Strapi is the absolute source of truth for all homepage content.
3. **Database Migration / Seeding**: A database migration (bootstrap script) is required to automatically seed all the hardcoded Kakao content (titles, descriptions, metrics, clients, and video URLs) into Strapi, preparing it for server deployment.

## Evaluated Approaches
1. **String URLs + Full Content Seeding (Recommended)**
   - *Pros*: Perfectly aligns with the spec. The bootstrap script will insert the exact text content (titles, descriptions, etc.) and the Kakao CDN links (as strings) directly into the Strapi database. This ensures 0 downtime and fast seeding during deployment. Admin can later update text or replace the string URLs with R2 URLs.
   - *Cons*: Admin will manage video URLs via text fields instead of the Media Library for these specific fields.

2. **Media Uploads for Videos + Content Seeding**
   - *Pros*: Uses Strapi's native Media Library for videos.
   - *Cons*: Seeding is extremely risky and slow, as the bootstrap script would have to physically download all Kakao videos and upload them to R2 during server startup.

## Final Recommended Solution
**Approach 1 (String URLs + Full Content Seeding)**
*Rationale*: By using String fields for video URLs, we can seamlessly seed the entire hardcoded Kakao "Works" section (both text content and video links) via a lightweight bootstrap script. Strapi becomes the 100% source of truth for the homepage without the massive overhead of downloading/uploading gigabytes of video during deployment.

## Implementation Considerations & Risks
- **Strapi Schemas**: 
  - Modify `case-study` (Works) to include string fields for videos (`video_mp4_url`, `video_webm_url`, `poster_url`). Text fields (`title`, `description`, `client`, `metrics`) already exist or need mapping.
  - Modify `site-setting` (Banner & CTA) and `service` schemas similarly for their respective video URLs.
- **Bootstrap Seeding (`apps/cms/src/index.ts`)**: 
  - Write a robust seeding script that checks if `case-study` data exists. If not, it will insert the 3 hardcoded Kakao works (full text content + video URLs).
  - Seed `site-setting` and `service` video URLs similarly.
- **Astro Integration**: Update `index.astro` to completely remove all hardcoded HTML for the Works section and videos, replacing them with dynamic loops fetching from the Strapi API.

## Success Metrics & Validation
- `index.astro` contains 0 hardcoded Kakao text content for the Works section and 0 hardcoded video URLs.
- VPS deployment successfully auto-seeds all text and video data on first boot.
- Website renders identically to the original theme but is 100% powered by Strapi.

## Next Steps
Proceed to technical planning/execution.
