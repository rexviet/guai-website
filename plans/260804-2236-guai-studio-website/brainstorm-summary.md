---
title: GuAI Studio Website — Brainstorm Report
date: 2026-08-04
type: brainstorm
status: approved
source_doc: https://docs.google.com/document/d/1Y7r8iHQdvF381vKcT-491yGH8XHgRDED/edit
---

# GuAI Studio Website — Brainstorm Report

## Tóm tắt

Website giới thiệu công ty GuAI Studio (AI Creative & Media Studio: AI Video, Virtual KOL, AI Ads, AI Content Factory). Đã chốt kiến trúc **Astro (static) + Strapi (headless CMS tự host)**, không SaaS hàng tháng, chỉ trả VPS + domain. Xem "Giải pháp cuối cùng" bên dưới.

## Yêu cầu

Từ doc gốc + trao đổi với khách hàng:

- Company profile + portfolio site cho GuAI Studio, brand mới, dark theme (Midnight Blue/Electric Violet/Cyan)
- CMS bắt buộc — team operation (non-tech) tự cập nhật nội dung (video, case study, services) không cần sửa code
- Có 1 dev part-time hỗ trợ triển khai/bảo trì
- Video: không tự host — load từ YouTube
- SEO tối ưu tốt (không chỉ "cơ bản")
- Không trả phí SaaS hàng tháng — chỉ trả host/VPS + domain hàng năm
- Từ brief kỹ thuật gốc: responsive, hero video autoplay, portfolio filter+modal, form liên hệ có upload file + email notification, GA4 + Meta Pixel với event tracking cụ thể, SEO cơ bản (meta/OG/sitemap/robots/canonical/schema), CMS dễ dùng, security (HTTPS/spam protection/file validation), accessibility cơ bản, không hardcode brand name

## Các hướng đã đánh giá

### 1. Cấu trúc site
| Approach | Đánh giá |
|---|---|
| One-page thuần (theo brief gốc) | Đơn giản nhất nhưng SEO chỉ đạt mức "hygiene" — 1 URL không rank được đa từ khóa theo dịch vụ |
| **Multi-page có SEO (chọn)** | Mỗi Service/Case-study có URL riêng để rank + share link riêng, trang chủ vẫn dạng scroll dài như thiết kế gốc |

### 2. Video hosting
| Approach | Đánh giá |
|---|---|
| Toàn bộ YouTube kể cả hero | Rủi ro autoplay muted qua iframe không ổn định giữa các trình duyệt |
| Tự host toàn bộ | Tốn chi phí storage/bandwidth trên VPS ngân sách nhỏ |
| **Hybrid (chọn)** | Hero showreel (nhẹ, 10-15s) tự host để autoplay mượt; Portfolio/Case-study/Virtual KOL demo dùng YouTube embed — không tốn storage/bandwidth |

### 3. CMS platform
| Approach | Đánh giá |
|---|---|
| WordPress | Quen thuộc, plugin SEO mạnh, nhưng nặng + target phổ biến của hacker → tốn công bảo trì bảo mật hơn |
| Git-based CMS (Decap/Tina) | Rẻ/nhẹ nhất nhưng kém thân thiện cho non-tech quản lý nhiều media |
| **Headless CMS tự host — Strapi (chọn)** | Admin UI trưởng thành, quen thuộc với non-tech user, cộng đồng/tài liệu lớn nhất → tận dụng tốt AI coding agent hỗ trợ bảo trì |

### 4. Kiến trúc render
| Approach | Đánh giá |
|---|---|
| A. Next.js + Payload (unified, 1 codebase) | Publish gần tức thì (ISR), ít moving parts, nhưng CMS mới hơn (community nhỏ), 1 process Node chạy liên tục tốn RAM hơn trên VPS nhỏ |
| **B. Astro (static) + Strapi (decoupled) + webhook rebuild (chọn)** | SEO/hiệu năng tối đa (100% static file), gần như 0 RAM runtime cho public site, Strapi trưởng thành + AI-agent-friendly bù đắp cho việc có 2 process. Đánh đổi: publish có độ trễ rebuild (vài giây–vài phút) — chấp nhận được vì đây là company/portfolio site không cần real-time |

**Quyết định**: ban đầu đề xuất Approach A, sau debate đổi sang Approach B vì tách được 2 trục quyết định (CMS product vs kiến trúc render) độc lập nhau, và static output phù hợp nhất với ràng buộc ngân sách VPS nhỏ + mục tiêu SEO.

## Giải pháp cuối cùng — Tech Stack

| Layer | Lựa chọn |
|---|---|
| Frontend | Astro (SSG), islands architecture cho phần tương tác nhẹ (portfolio filter, modal video) |
| CMS | Strapi (self-hosted), Postgres làm DB (khuyến nghị chính thức của Strapi cho production) |
| Media storage | Cloudflare R2 (free tier, 10GB, không tính egress bandwidth) |
| Video | Hero: tự host (MP4/WebM nhẹ, muted/autoplay/loop/playsinline, poster fallback). Portfolio/Case-study/Virtual KOL: YouTube embed (lite-youtube pattern để tối ưu tốc độ) |
| Email form | Resend hoặc Brevo (free tier) cho notification khi có lead mới |
| CDN/Proxy | Cloudflare free (SSL, cache static asset, DDoS protection) trước VPS |
| Reverse proxy trên VPS | Nginx + Cloudflare Origin CA certificate (valid 15 năm, không cần renew) — chọn thay Caddy vì trưởng thành/tài liệu/cộng đồng lớn hơn hẳn, nhất quán với lý do chọn Strapi (AI-agent-friendly nhờ corpus lớn) |
| Hosting | VPS tiết kiệm, khuyến nghị tối thiểu 2GB RAM để chạy ổn định Strapi + Postgres + build process (nhiều provider có mức giá ~$5-7/mo cho 2GB, vẫn trong ngân sách "tiết kiệm") |
| Deploy | Docker Compose (Strapi + Postgres), Astro build output serve qua Caddy |
| Rebuild pipeline | Webhook listener nhỏ: Strapi publish → gọi webhook → chạy `astro build` → swap thư mục Caddy đang serve (atomic, giữ bản cũ nếu build lỗi) |

### Cấu trúc route (multi-page, khớp menu brief)
```
/                    — Home (hero showreel, overview, portfolio highlight, CTA)
/services            — Services overview
/services/[slug]     — AI Video Production, Virtual KOL, AI Ad Creative, AI Content Factory
/work                — Portfolio index (filter theo category)
/work/[slug]         — Case study chi tiết
/ai-kol               — Virtual KOL showcase
/about
/contact             — Form brief (upload file, checkbox nhu cầu) + Zalo/Messenger CTA
```

### SEO implementation
- Astro sitemap integration (`@astrojs/sitemap`) → sitemap.xml tự động theo route multi-page
- Meta title/description + Open Graph riêng từng page (lấy từ Strapi content field)
- JSON-LD schema Organization/LocalBusiness ở layout gốc, schema Service/CreativeWork cho từng service/case-study page
- Canonical tag tự động theo route
- robots.txt tĩnh

### Analytics & tracking
- GA4 + Meta Pixel (client script)
- Custom event: `view_work`, `play_showreel`, `click_contact`, `start_brief`, `submit_brief` (theo đúng brief kỹ thuật gốc)

### Security & form
- HTTPS qua Cloudflare + Caddy
- Cloudflare Turnstile (free) chống spam cho form liên hệ
- Validate loại/kích thước file upload trước khi lưu R2
- Strapi admin sau auth riêng, cân nhắc giới hạn IP truy cập `/admin` sau này

## Cân nhắc triển khai & rủi ro

- **RAM sizing**: Strapi khuyến nghị tối thiểu ~2GB RAM cho production — nên chọn VPS 2GB thay vì mức 1GB thấp nhất để tránh nghẽn khi build + Strapi + Postgres chạy cùng lúc.
- **Webhook rebuild script**: cần xây 1 lần (nghe webhook → build → swap thư mục), sau đó gần như không cần sửa. Cần có cơ chế rollback nếu build lỗi (giữ bản build cũ).
- **Docker disk hygiene** (đã có tiền sử full disk không rõ nguyên nhân ở dự án khác — nguyên nhân phổ biến nhất là log driver mặc định không giới hạn dung lượng): bắt buộc set `logging.driver: json-file` với `max-size`/`max-file` cho từng service trong `docker-compose.yml`; cron job hàng tuần `docker system prune -f` (không đụng named volume Postgres); script rebuild Astro phải dọn `dist/` cũ trước khi build mới, chỉ giữ 1 bản để rollback; cảnh báo email khi disk > 80%.
- **Đào tạo non-tech ops**: Strapi phổ biến nên dễ tìm hướng dẫn, nhưng vẫn nên có 1 tài liệu ngắn hướng dẫn nội bộ cho team update content.
- **Backup**: cần cron job backup Postgres (chứa nội dung Strapi) định kỳ; R2 tự có độ bền cao sẵn.
- **Domain + DNS**: trỏ qua Cloudflare để tận dụng proxy/CDN free.

## Success metrics

- Core Web Vitals tốt (LCP/CLS) nhờ static output
- Toàn bộ multi-page được Google Search Console index trong vài tuần đầu
- Tỷ lệ submit form/lead tăng dần theo traffic
- Chi phí vận hành = VPS + domain, $0 SaaS hàng tháng

## Next steps

1. Thu thập asset còn thiếu từ khách: logo/brand guideline, showreel, 6-9 video portfolio, 4-6 mẫu Virtual KOL, case study, copy giới thiệu
2. Chốt domain (đã có hay cần đăng ký mới)
3. Đi tiếp `/solution-design` để chi tiết hóa workflow, content model Strapi, và các side-effect module trước khi lập `/plan`

## Câu hỏi chưa giải quyết

- Website có cần song ngữ VI/EN không? (brief có xen copy tiếng Anh — vd "YOUR BRAND. YOUR KOL.")
- Domain đã sở hữu sẵn hay cần đăng ký mới?
- VPS provider cụ thể khách muốn dùng (Hetzner, DigitalOcean, Vultr, Contabo...)?
- Ai chịu trách nhiệm vận hành/training Strapi cho team ops sau khi bàn giao?
