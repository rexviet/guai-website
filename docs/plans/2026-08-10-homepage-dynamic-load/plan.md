---
title: "Homepage Content & Video Dynamic Loading via Strapi"
status: completed
date: 2026-08-10
sdd: docs/solution-designs/solution-design-2026-08-10-homepage-dynamic-load.md
---

# Plan: Homepage Content & Video Dynamic Loading via Strapi

## Overview
Biến Strapi thành 100% Source of Truth cho toàn bộ nội dung trang chủ (banner video, works/case studies với đầy đủ content + video, services với video). Toàn bộ hardcode trong Astro sẽ bị xoá và thay bằng dữ liệu lấy từ API. Bao gồm bootstrap seeding để đảm bảo deploy lên VPS mới không cần nhập liệu thủ công.

---

## Phase 1: Strapi Schema — Tạo Component `video-source`

### Task 1.1 — Tạo component schema `shared/video-source`

**File mới:** `apps/cms/src/components/shared/video-source.json`

```json
{
  "collectionName": "components_shared_video_sources",
  "info": {
    "displayName": "Video Source",
    "icon": "play",
    "description": "External video URL set (mp4, webm, poster)"
  },
  "options": {},
  "attributes": {
    "mp4_url": { "type": "string" },
    "webm_url": { "type": "string" },
    "poster_url": { "type": "string" }
  }
}
```

### Task 1.2 — Cập nhật schema `site-setting`

**File:** `apps/cms/src/api/site-setting/content-types/site-setting/schema.json`

Thêm 2 component vào `attributes`:
- `banner_video` → component `shared.video-source`, repeatable: false, i18n: false
- `cta_video` → component `shared.video-source`, repeatable: false, i18n: false

### Task 1.3 — Cập nhật schema `case-study`

**File:** `apps/cms/src/api/case-study/content-types/case-study/schema.json`

Thêm 1 component vào `attributes`:
- `video` → component `shared.video-source`, repeatable: false, i18n: false

### Task 1.4 — Cập nhật schema `service`

**File:** `apps/cms/src/api/service/content-types/service/schema.json`

Thêm 1 component vào `attributes`:
- `featured_video` → component `shared.video-source`, repeatable: false, i18n: false

---

## Phase 2: Strapi Bootstrap — Seeding Data

### Task 2.1 — Viết hàm `seedHomepageData` trong `index.ts`

**File:** `apps/cms/src/index.ts`

Thêm hàm `seedHomepageData({ strapi })` và gọi nó trong `bootstrap()`. Logic:

**A. Seed `site-setting` (Single Type):**
- Dùng `strapi.query('api::site-setting.site-setting').findOne({})`.
- Nếu `banner_video` chưa có (null/undefined), gọi `update` hoặc `create` để set:
  - `banner_video.mp4_url` = Kakao banner MP4 URL
  - `banner_video.webm_url` = Kakao banner WEBM URL
  - `banner_video.poster_url` = Kakao banner poster URL
  - `cta_video.mp4_url` = Kakao CTA MP4 URL
  - `cta_video.webm_url` = Kakao CTA WEBM URL
  - `cta_video.poster_url` = Kakao CTA poster URL

**B. Seed `case-study` (Collection Type — 3 mục):**
- Dùng `count()`. Nếu = 0, tạo 3 case studies bằng tiếng Việt VÀ tiếng Anh (i18n):
  - Kakao Wcopilot AI Campaign (vi + en)
  - Virtual KOL 3D 'AURA' (vi + en)
  - NeuraCar AI Spatial Launch (vi + en)
- Mỗi case study phải có: `title`, `slug`, `description`, `category`, `video.mp4_url`, `video.webm_url`, `video.poster_url`
- Các video URLs lấy từ hardcode hiện tại trong `index.astro` (sticky-image-bar section)

**C. Seed `service` — chỉ update video, không seed content:**
- Các service đã có (hoặc đã seeded bởi mock data). Duyệt qua từng service theo `slug`, update thêm `featured_video.mp4_url`, `webm_url`, `poster_url`.
- Mapping:
  - `genai-commercial-video` → video 1 của Kakao
  - `virtual-kol-creation` → video 2 của Kakao
  - `ai-vfx-motion` → video 3 của Kakao
  - `ai-brand-storytelling` → video 1 của Kakao (xoay vòng)

> **Lưu ý quan trọng:** Tất cả data được seed phải ở trạng thái `publishedAt: new Date()` (published), không phải draft.

---

## Phase 3: Astro Frontend — `strapi-client.ts`

### Task 3.1 — Cập nhật hàm `getSiteSettings` (mới)

**File:** `apps/web/src/lib/strapi-client.ts`

- Thêm hàm `getSiteSettings(locale)` mới để fetch `/site-settings` với `populate: ['banner_video', 'cta_video']`.
- Trả về object với `banner_video` và `cta_video` chứa `mp4_url`, `webm_url`, `poster_url`.
- Thêm fallback object với Kakao URLs cho trường hợp Strapi offline.

### Task 3.2 — Cập nhật hàm `getCaseStudies`

- Cập nhật populate thành `populate: ['thumbnail', 'video']` để lấy cả component `video`.
- Cập nhật fallback mock data để có trường `video: { mp4_url, webm_url, poster_url }`.

### Task 3.3 — Cập nhật hàm `getServices`

- Cập nhật populate thành `populate: ['icon', 'featured_video']`.
- Cập nhật fallback mock data để có trường `featured_video: { mp4_url, webm_url, poster_url }`.

---

## Phase 4: Astro Frontend — `pages/index.astro` (VI)

### Task 4.1 — Xoá hardcode, load từ Strapi

**File:** `apps/web/src/pages/index.astro`

- Import và gọi `getSiteSettings('vi')` ở frontmatter.
- **Banner video section (lines ~24-57):** Thay hardcode URLs bằng `siteSettings.banner_video.mp4_url`, `.webm_url`, `.poster_url`.
- **Services section (lines ~203-271):** Thay `fallbackVideos` array bằng `service.featured_video?.mp4_url`, `.webm_url`, `.poster_url`. Xoá toàn bộ `fallbackVideos` constant.
- **Works "sticky image bar" section (lines ~306-402):** Thay 3 video hardcodes bằng `caseStudies[0..2]?.video?.mp4_url`, `.webm_url`, `.poster_url`.
- **Works "sticky box list" section (lines ~419-671):** Tương tự.
- **CTA video section (lines ~717-746):** Thay bằng `siteSettings.cta_video.mp4_url`, `.webm_url`, `.poster_url`.
- **"Project grid" section (lines ~871-1145) — Works 2nd layout:** Xoá toàn bộ hardcode (Digital Dreamscape, Visual Alchemy, Motion Mosaics), thay bằng vòng lặp `caseStudies.map(work => ...)`.

> **Chú ý:** `index.astro` cực kỳ dài (1533 dòng). Cần đọc kỹ từng section trước khi sửa để không mất layout.

### Task 4.2 — Làm tương tự cho `pages/en/index.astro` (EN)

**File:** `apps/web/src/pages/en/index.astro`

- `bannerVideo` và `bannerPoster` hardcode ở dòng 9-10 → thay bằng `getSiteSettings('en')`.
- CTA video section (dòng 166-168) → thay bằng `siteSettings.cta_video`.

---

## Phase 5: Kiểm tra & Xác nhận

### Task 5.1 — Build test Strapi
```bash
cd apps/cms && npm run build
```

### Task 5.2 — Build test Astro (offline mode)
```bash
cd apps/web && npm run build
```

### Task 5.3 — Manual check
Khởi động Docker stack, verify:
1. Strapi admin hiển thị component `Video Source` trong các content types.
2. Seed data đã có trong DB (kiểm tra qua Strapi Admin UI).
3. Trang chủ Astro render đúng video.

---

## Kakao CDN URLs cần seed (reference)

### Banner (site-setting.banner_video)
- mp4: `https://cdn.prod.website-files.com/648aca18f05d659650f20acc/64ae84a2fd7e81e18cc7150f_pexels shvets production 7547007 2160p-transcode.mp4`
- webm: `https://cdn.prod.website-files.com/648aca18f05d659650f20acc/64ae84a2fd7e81e18cc7150f_pexels shvets production 7547007 2160p-transcode.webm`
- poster: `https://cdn.prod.website-files.com/648aca18f05d659650f20acc/64ae84a2fd7e81e18cc7150f_pexels shvets production 7547007 2160p-poster-00001.jpg`

### CTA (site-setting.cta_video)
- mp4: `https://cdn.prod.website-files.com/648aca18f05d659650f20acc/64959fae3c43f45d2db99e4e_pexels marian croitoru 4524595 1920x1080 25fps 1-transcode.mp4`
- webm: `https://cdn.prod.website-files.com/648aca18f05d659650f20acc/64959fae3c43f45d2db99e4e_pexels marian croitoru 4524595 1920x1080 25fps 1-transcode.webm`
- poster: `https://cdn.prod.website-files.com/648aca18f05d659650f20acc/64959fae3c43f45d2db99e4e_pexels marian croitoru 4524595 1920x1080 25fps 1-poster-00001.jpg`

### Works videos (case-study.video)
- Work 1 (image-three): `...64959a5b7c779f4ff028f8f3_pexels life of pix 852286...`
- Work 2 (image-two): `...6495984d65a257fb519f0dac_pexels rdne stock project 8097473...`
- Work 3 (image-one): `...64959d51c577f9fcdc252f82_pexels shvets production 7547019...`

### Services videos (service.featured_video)
- Service 1: `...64958ccf35b706f1aa59b538_pexels mikhail nilov 8058474...`
- Service 2: `...64958cddad3aa0c1f3b11c8d_pexels pixabay 854877...`
- Service 3: `...64958ce7cb95688383fcb95a_pexels koolshooters 7322712...`
