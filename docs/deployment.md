# Hướng Dẫn Vận Hành Local & Deployment Production - GuAI Studio

Tài liệu này hướng dẫn chi tiết quy trình vận hành hệ thống ở **Local (Máy phát triển)** và triển khai **Production (Server VPS)** cho dự án GuAI Studio.

---

## I. Vận Hành Tại Máy Local (Local Development)

Dự án bao gồm 2 thành phần chính:
- **`apps/cms`**: Strapi v5 (Node.js + TypeScript) & PostgreSQL Database.
- **`apps/web`**: Astro Web Frontend (SSG - Static Site Generation).

### 1. Cách 1: Chạy Full-Stack bằng Docker Compose (Khuyên dùng)
Sử dụng Docker Compose để khởi chạy đầy đủ hệ thống Strapi CMS và PostgreSQL Database.

#### Bước 1: Tạo tệp môi trường
```bash
cp infra/.env.example infra/.env
```
*(Nếu cần, mở tệp `infra/.env` để điều chỉnh mật khẩu DB hoặc secrets).*

#### Bước 2: Khởi chạy Containers
```bash
docker compose -f infra/docker-compose.yml up -d
```

#### Bước 3: Truy cập Dịch vụ
- **Strapi Admin UI:** `http://localhost:1337/admin` *(Lần đầu khởi chạy sẽ hiển thị màn hình tạo tài khoản Admin)*.
- **Strapi REST API:** `http://localhost:1337/api`

#### ⚠️ Bước Bắt Buộc Khi Khởi Chạy Lần Đầu (Tránh Lỗi HTTP 403 Forbidden):
Mặc định Strapi sẽ khóa tất cả các API công khai. Bạn phải bật quyền Public cho API thì Astro Web Frontend mới lấy được dữ liệu:
1. Đăng nhập vào Strapi Admin: `http://localhost:1337/admin`
2. Vào **Settings** ➔ **Users & Permissions plugin** ➔ **Roles** ➔ Chọn **Public**.
3. Tại danh sách Permissions bên dưới, tích chọn quyền đọc cho các mục:
   - **Service**: `find`, `findOne`
   - **Case-study**: `find`, `findOne`
   - **Virtual-kol**: `find`, `findOne`
   - **Site-setting**: `find`
4. Bấm **Save** ở góc trên bên phải.

#### Bước 4: Chạy Astro Web Frontend nối với Strapi local
```bash
npm run dev --prefix apps/web
```
- **Astro Local URL:** `http://localhost:4321`

#### Bước 5: Dừng Containers khi không sử dụng
```bash
docker compose -f infra/docker-compose.yml down
```

---

### 2. Cách 2: Chạy Dev Trực Tiếp Bằng Node.js (Cho công việc Code/Debug)

1. **Khởi chạy Strapi CMS:**
   ```bash
   cd apps/cms
   npm install
   npm run dev
   ```
2. **Khởi chạy Astro Web Frontend:**
   ```bash
   cd apps/web
   npm install
   npm run dev
   ```

---

## II. Quy Trình Deploy Lên Server Production (VPS)

Kiến trúc Production:
- **Backend Infrastructure:** Strapi v5 CMS & PostgreSQL được đóng gói trong Docker Compose chạy trên server VPS.
- **Frontend Site:** Astro Static Site được build biên dịch sẵn và phục vụ qua Nginx web server với SSL HTTPS (TLS 1.3).

---

### 1. Bước 1: Deploy Backend Strapi CMS & Postgres trên VPS (Khởi tạo 1 lần)

1. **SSH vào Server VPS:**
   ```bash
   ssh deploy@vps-ip
   cd /var/www/guai-studio  # Hoặc thư mục dự án trên server
   ```

2. **Cấu hình biến môi trường Production:**
   ```bash
   cp infra/.env.example infra/.env
   nano infra/.env  # Điền các secret thực tế, DB passwords sản phẩm
   ```

3. **Khởi chạy Docker Container:**
   ```bash
   docker compose -f infra/docker-compose.yml up -d --build
   ```

4. **Cấu hình Nginx Reverse Proxy & SSL (Certbot):**
   - Sử dụng file cấu hình `infra/nginx/guai-studio.conf` để trỏ domain `cms.guai.studio` vào `127.0.0.1:1337`.
   - Đăng ký SSL miễn phí Let's Encrypt:
     ```bash
     sudo certbot --nginx -d guai.studio -d cms.guai.studio
     ```

---

### 2. Bước 2: Deploy Frontend Astro (Tự Động hoặc Thủ Công)

#### 🟢 Phương Án A: Deploy Tự Động Qua GitHub Actions (Khuyên dùng)
Dự án được cấu hình sẵn pipeline CI/CD tự động trong `.github/workflows/build-and-deploy.yml`.

- **Cơ chế:** Khi bạn push code mới lên branch `main` hoặc khi biên tập viên bấm **Publish/Update** bài viết trong Strapi Admin (qua webhook `strapi_content_update`):
  1. GitHub Actions khởi chạy runners, tự động cài dependency và chạy `npm run build --prefix apps/web`.
  2. Sản phẩm tĩnh (`apps/web/dist`) được `rsync` an toàn sang VPS tại `/var/www/guai-studio/releases/<commit_sha>`.
  3. Tự động chuyển đổi Symlink nguyên tử sang `/var/www/guai-studio/current`, giúp cập nhật website không gián đoạn (0 downtime).
  4. Tự dọn dẹp giữ lại 5 bản release gần nhất trên server.

- **Cấu hình GitHub Secrets (Settings ➔ Secrets and variables ➔ Actions):**
  - `VPS_HOST`: IP hoặc hostname của server VPS.
  - `VPS_USER`: Username SSH (ví dụ: `deploy`).
  - `SSH_DEPLOY_KEY`: SSH Private Key đã được thêm vào `~/.ssh/authorized_keys` của server.
  - `STRAPI_API_URL`: Domain Strapi CMS Production (ví dụ: `https://cms.guai.studio`).
  - `SITE_URL`: Domain trang chủ (ví dụ: `https://guai.studio`).

---

#### 🟡 Phương Án B: Deploy Thủ Công (Manual Deployment)

Nếu cần deploy nhanh từ máy cá nhân lên VPS mà không qua GitHub Actions:

1. **Biên dịch Frontend ở Local:**
   ```bash
   STRAPI_API_URL="https://cms.guai.studio" npm run build --prefix apps/web
   ```

2. **Upload kết quả `dist/` lên VPS:**
   ```bash
   rsync -avz --delete apps/web/dist/ deploy@your-vps-ip:/var/www/guai-studio/current/
   ```

---

## III. Tóm Tắt Các Lệnh Thường Dùng (Cheatsheet)

| Mục Đích | Lệnh Thực Hiện |
|---|---|
| **Khởi chạy Local Fullstack** | `docker compose -f infra/docker-compose.yml up -d` |
| **Tắt Local Fullstack** | `docker compose -f infra/docker-compose.yml down` |
| **Build Web Frontend** | `npm run build --prefix apps/web` |
| **Build Strapi CMS Admin** | `npm run build --prefix apps/cms` |
| **Deploy Backend VPS** | SSH vào VPS ➔ `docker compose -f infra/docker-compose.yml up -d --build` |
| **Deploy Frontend VPS** | Push code lên `main` ➔ GitHub Actions tự động build & swap symlink |
