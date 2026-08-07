# Hướng Dẫn Vận Hành Hệ Thống (Ops Manual) - GuAI Studio Website

Tài liệu này dành cho đội ngũ vận hành nội dung (non-tech ops team) của **GuAI Studio** để quản lý nội dung website, cấu hình các thành phần hiển thị, xử lý Lead khách hàng và nguyên tắc tối ưu tài nguyên truyền thông trên nền tảng **Strapi CMS v5**.

---

## 1. Đăng Nhập & Tổng Quan Giao Diện Strapi Admin

### 1.1 Đường dẫn & Đăng nhập
- **Production URL:** `https://cms.guai.studio/admin` (hoặc domain CMS được cấp phát).
- **Quyền hạn:** Sử dụng tài khoản được quản trị viên hệ thống cấp (Email + Password).
- **Yêu cầu bảo mật:** Không chia sẻ thông tin đăng nhập. Đổi mật khẩu định kỳ trong phần **Profile settings**.

### 1.2 Cấu trúc Bảng Điều Khiển
Sau khi đăng nhập thành công, thanh điều hướng bên trái bao gồm:
- **Content Manager:** Nơi thực hiện toàn bộ các thao tác chỉnh sửa, tạo mới và xuất bản nội dung.
- **Media Library:** Nơi quản lý toàn bộ tệp hình ảnh, video showreel, tài liệu đính kèm.
- **Settings:** Quản lý tài khoản, phân quyền và cài đặt ngôn ngữ i18n.

### 1.3 Cấu Hình Quyền API Public (Giải Quyết Lỗi HTTP 403 Forbidden)
Khi khởi tạo hệ thống Strapi mới, mặc định các API sẽ bị khóa. Cần thực hiện các bước sau để giao diện Web công khai lấy được dữ liệu:
1. Vào **Settings** ➔ **Users & Permissions plugin** ➔ **Roles** ➔ Bấm vào role **Public**.
2. Tại bảng danh sách Permissions, tích chọn các quyền đọc (`find`, `findOne`):
   - **Service**: `find`, `findOne`
   - **Case-study**: `find`, `findOne`
   - **Virtual-kol**: `find`, `findOne`
   - **Site-setting**: `find`
3. Bấm **Save** ở góc trên bên phải.

---

## 2. Quản Lý Nội Dung Chi Tiết (Content Manager)

### 2.1 Cấu hình Chung Website (Site Setting - Single Type)
`Site Setting` chứa các thông tin toàn cục của website:
- **Logo & Showreel Video:** Upload video giới thiệu thương hiệu (dạng MP4/WebM) và Logo chính thức.
- **Thông tin liên hệ:** Số điện thoại, Email hỗ trợ, Link Zalo OA, các liên kết mạng xã hội (Facebook, LinkedIn, YouTube).
- **SEO Mặc định:** SEO Title, Meta Description, OpenGraph Image mặc định khi trang chia sẻ lên các nền tảng social.

> **Lưu ý Ngôn ngữ (i18n):** Các trường như `site_name`, `phone`, `email`, `social_links` là chung cho mọi ngôn ngữ. Các trường `tagline` và `default_seo` cần nhập bản dịch riêng cho từng ngôn ngữ (Tiếng Việt & Tiếng Anh).

---

### 2.2 Quản Lý Dịch Vụ (Service - Collection Type)
- **Danh sách Dịch vụ:** Bao gồm các gói giải pháp AI Commercial, Virtual KOL creation, Automation workflow...
- **Các trường dữ liệu chính:**
  - `title` (Tên dịch vụ) & `slug` (Đường dẫn URL tự động tạo).
  - `short_description` (Mô tả ngắn hiển thị trên thẻ card trang chủ).
  - `full_content` (Nội dung chi tiết - hỗ trợ Rich Text / Markdown).
  - `icon` & `cover_image` (Hình ảnh đại diện).
  - `order` (Thứ tự ưu tiên sắp xếp trên trang chủ & trang danh mục).

---

### 2.3 Quản Lý Dự Án / Case Studies (Case Study - Collection Type)
- **Mục đích:** Hiển thị các dự án thành công (Portfolio) của GuAI Studio với đối tác.
- **Các trường dữ liệu chính:**
  - `client_name` (Tên khách hàng / Đối tác).
  - `project_title` (Tên dự án).
  - `category` (Hạng mục dự án: AI Video, Virtual Model, Brand Automation...).
  - `metrics` (Kết quả đo lường nổi bật, ví dụ: *+250% Engagement*, *10M Views*).
  - `hero_image` & `gallery` (Bộ bộ sưu tập hình ảnh/video kết quả).

---

### 2.4 Quản Lý Virtual KOLs (Virtual KOL - Collection Type)
- **Mục đích:** Quản lý thông tin và hình ảnh đại diện của các người mẫu ảo AI do GuAI Studio phát triển.
- **Các trường dữ liệu chính:**
  - `name` (Tên KOL ảo).
  - `role` (Phong cách / Lĩnh vực: Fashion, Tech, Lifestyle...).
  - `bio` (Tiểu sử & thông điệp).
  - `avatar` & `portfolio_images` (Hình ảnh chất lượng cao).
  - `social_channels` (Link TikTok, Instagram cá nhân của KOL ảo).

---

### 2.5 Hướng Dẫn Đa Ngôn Ngữ (i18n: Tiếng Việt & Tiếng Anh)
Mặc định hệ thống cài đặt **Tiếng Việt (`vi`)** là ngôn ngữ gốc.

**Quy trình bổ sung bản dịch Tiếng Anh (`en`):**
1. Chọn bài viết/mục nội dung cần dịch trong Content Manager.
2. Tại bảng điều khiển bên phải (Locales panel), chọn dropdown **Locales** ➔ Select **English (en)**.
3. Bấm nút **Fill in from another locale** nếu muốn sao chép nhanh dữ liệu gốc từ bản Tiếng Việt.
4. Nhập tiêu đề, mô tả và nội dung bằng Tiếng Anh.
5. Kiểm tra kỹ thông tin và bấm **Save** ➔ **Publish**.

> ⚠️ **Quan trọng:** Nội dung chưa bấm **Publish** ở bản tiếng Anh sẽ không hiển thị trên phiên bản website tiếng Anh (`/en/...`).

---

## 3. Quy Trình Xuất Bản & Cơ Chế Tự Động Build (Rebuild Web Hook)

### 3.1 Cơ Chế Tự Động Rebuild
Website GuAI Studio sử dụng công nghệ Static Site Generation (SSG) kết hợp Astro để đạt tốc độ tải cực nhanh và tối ưu SEO tối đa.
- Mỗi khi nhân viên Ops bấm **Publish**, **Update** hoặc **Unpublish** bất kỳ bài viết nào trong Strapi:
- Hệ thống CMS sẽ gửi một tín hiệu **Webhook (GitHub Dispatch)** với cơ chế dồn sự kiện (debounce 2 giây) sang hệ thống GitHub Actions.
- GitHub Actions sẽ tự động biên dịch lại trang web và cập nhật dữ liệu mới lên production trong khoảng 1–2 phút.

---

## 4. Quản Lý Lead Khách Hàng (Lead Pipeline)

### 4.1 Tiếp Nhận & Phân Loại Lead
Tất cả biểu mẫu đăng ký tư vấn/dự án từ trang web sẽ được lưu trực tiếp vào mục **Lead** trong Strapi CMS và gửi thông báo qua email/Zalo webhook.

### 4.2 Các Trạng Thái Lead (`status`)
Đội ngũ CSKH/Sales cập nhật trạng thái của Lead theo tiến độ xử lý:
- **`new` (Mới):** Yêu cầu vừa gửi từ khách hàng, chưa xử lý.
- **`contacted` (Đã liên hệ):** Đội Sales đã gọi điện hoặc phản hồi email cho khách hàng.
- **`qualified` (Tiềm năng/Chốt deal):** Khách hàng xác nhận nhu cầu và chuyển sang giai đoạn báo giá/ký hợp đồng.
- **`archived` (Lưu trữ):** Yêu cầu rác (spam) hoặc không phù hợp.

---

## 5. Quy Định Tối Ưu Hình Ảnh & Media (Image Optimization Standard)

Đảm bảo dung lượng hình ảnh nhẹ để giữ cho website luôn đạt điểm tốc độ tối đa (Lighthouse 95-100).

### 5.1 Chuẩn Định Dạng & Kích Thước Khuyến Nghị
| Tệp Media | Định Dạng Tối Ưu | Kích Thước Khuyên Dùng | Dung Lượng Tối Đa |
|---|---|---|---|
| **Cover Image / Hero** | WebP hoặc JPG | 1920 x 1080 px | < 400 KB |
| **Thẻ Card / Thumbnail**| WebP hoặc PNG | 800 x 600 px | < 150 KB |
| **Avatar KOL / Service Icon** | WebP hoặc SVG | 400 x 400 px | < 80 KB |
| **Showreel Video** | MP4 (H.264) / WebM | 1080p (Fast Start web optimized) | < 15 MB |

### 5.2 Công Cụ Nén Ảnh Miễn Phí Đề Xuất
- [TinyPNG / TinyJPG](https://tinypng.com/) - Nén ảnh hàng loạt không giảm chất lượng.
- [Squoosh.app](https://squoosh.app/) - Đổi định dạng sang WebP và căn chỉnh dung lượng chi tiết.

> ℹ️ **Lưu ý:** Strapi CMS đã tích hợp sẵn tính năng tự động tạo nhiều kích thước responsive (thumbnail, small, medium, large). Tuy nhiên việc nén ảnh trước khi tải lên là bắt buộc để tiết kiệm bộ nhớ dung lượng lưu trữ R2 Cloud.

---

## 6. Danh Mục Kiểm Tra Khi Go-Live (Go-Live Checklist)

- [x] **Tên miền & DNS:** Cấu hình Cloudflare DNS trỏ A Record & CNAME về VPS production thành công.
- [x] **Chứng chỉ SSL:** Kích hoạt HTTPS mã hóa TLS 1.3 cho toàn bộ `guai.studio` và `cms.guai.studio`.
- [x] **Kiểm Tra Form Liên Hệ:** Gửi thử nghiệm Lead từ sản phẩm thành công, lưu dữ liệu vào Strapi và kích hoạt Webhook thông báo.
- [x] **Lighthouse Score:** Đạt chỉ số Core Web Vitals tối ưu: Performance > 90, Accessibility > 95, Best Practices > 95, SEO 100.
- [x] **Bàn Giao Repository:** Cấp quyền truy cập GitHub cho đội ngũ Kỹ thuật và Vận hành của khách hàng.
