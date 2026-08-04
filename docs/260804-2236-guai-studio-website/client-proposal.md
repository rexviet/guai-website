# Báo giá & Đề xuất giải pháp Website GuAI Studio

## 1. Cam kết chất lượng sản phẩm

- **Tốc độ tải trang cực nhanh:** Đạt điểm Core Web Vitals tối ưu, website được render sẵn dưới dạng tĩnh (Static Site Generation) kết hợp CDN toàn cầu giúp trải nghiệm người dùng mượt mà nhất.
- **Chuẩn SEO tuyệt đối:** Cấu trúc HTML ngữ nghĩa, tự động tạo sitemap, meta tags chuẩn xác, và hỗ trợ thẻ `hreflang` cho website đa ngôn ngữ (Việt - Anh) giúp dễ dàng lên top Google.
- **Tự chủ nội dung hoàn toàn:** Đội ngũ vận hành (non-tech) có thể chủ động tự cập nhật Dịch vụ, thêm Case Study, tạo hồ sơ Virtual KOL... qua trang quản trị (CMS) trực quan mà không cần Dev can thiệp.
- **Thiết kế cao cấp, hiện đại:** Sử dụng CSS thuần với các hiệu ứng vi mô (micro-animations), hỗ trợ Dark mode mượt mà, mang lại giao diện tinh tế và đẳng cấp của một AI Studio.
- **Không phí nền tảng ẩn (Zero hidden SaaS fees):** Giải pháp được thiết kế khéo léo để tận dụng các dịch vụ miễn phí chất lượng cao (GitHub, Cloudflare R2), giúp quý khách chỉ phải trả duy nhất chi phí cố định (VPS, tên miền).

---

## 2. Công nghệ sử dụng & Lựa chọn kiến trúc (Tech Stack & Trade-offs)

### Frontend (Giao diện) - **Astro**
- **Ưu điểm:** Khung làm việc (Framework) hiện đại bậc nhất hiện nay cho việc xây dựng website nội dung. Astro loại bỏ Javascript thừa, giúp tốc độ tải trang cực nhanh và SEO hoàn hảo.
- **Nhược điểm:** Không phù hợp với các ứng dụng web phức tạp cần tính năng tương tác thời gian thực (real-time). Nhưng lại là lựa chọn "số 1" cho website dạng Company Profile / Portfolio.

### Backend (Hệ quản trị nội dung CMS) - **Strapi + PostgreSQL**
- **Ưu điểm:** Cung cấp giao diện quản trị hiện đại, dễ sử dụng cho đội ngũ nội dung. Tùy biến cấu trúc dữ liệu linh hoạt.
- **Nhược điểm:** Yêu cầu tự quản trị máy chủ (VPS) thay vì dùng các nền tảng xây sẵn (như Wix, Webflow). 

### Hạ tầng & Tự động hoá (CI/CD) - **GitHub Actions + Cloudflare**
- **Ưu điểm:** Chi phí $0. Tự động hoá hoàn toàn quy trình: từ lúc nhấn nút "Publish" bài viết mới trên CMS đến khi nội dung được tự động build và cập nhật lên máy chủ. Tích hợp Cloudflare R2 để lưu trữ video/ảnh nặng miễn phí (lên tới 10GB/tháng) mà không làm tốn dung lượng VPS.
- **Quyết định đánh đổi (Trade-off quan trọng):** 
  - Để tiết kiệm tối đa chi phí duy trì hàng tháng, hệ thống được thiết kế chạy trên máy chủ (VPS) cấu hình nhỏ gọn tiết kiệm. Để bảo vệ máy chủ không bị "quá tải" khi cập nhật website, quá trình đóng gói (build) giao diện được chuyển giao cho máy chủ của GitHub thực hiện miễn phí. 
  - **Sự đánh đổi:** Sẽ có một "độ trễ" nhỏ (khoảng 30 - 60 giây) từ lúc bạn nhấn nút "Đăng bài" cho tới lúc nội dung hiển thị thực tế trên trang chủ. Bù lại, sự đánh đổi này mang lại độ ổn định tuyệt đối 100% cho máy chủ và tốc độ tải trang siêu tốc cho người xem web.

---

## 3. Báo giá chi tiết

| Hạng mục | Chi phí (VNĐ) | Ghi chú |
| :--- | :--- | :--- |
| **Phí xây dựng và phát triển website** | **5,000,000** | Trọn gói thiết kế, lập trình frontend (Astro), hệ thống CMS (Strapi), cấu hình hạ tầng máy chủ, hệ thống form gửi email, và tài liệu hướng dẫn sử dụng. |
| **Chi phí máy chủ (VPS)** | ~ 150,000 / tháng | Cấu hình đề xuất tối thiểu: 1 CPU, 2GB RAM, 40GB Disk, Mạng 200Mb/s. (*Khách hàng thanh toán trực tiếp cho nhà cung cấp, ước tính 1.8tr/năm*). |

> Báo giá trên **chưa bao gồm** chi phí đăng ký Tên miền (Domain). Chi phí tên miền dao động từ 300.000đ - 800.000đ/năm tuỳ thuộc vào đuôi tên miền (ví dụ: .com, .vn, .studio).

### Chính sách Hậu mãi
- **Bảo hành trọn đời:** Cam kết xử lý sự cố, sửa các lỗi kỹ thuật (bug) hoàn toàn **miễn phí** trong suốt thời gian hai bên còn làm việc/duy trì hợp tác chung.
- Hỗ trợ giải đáp thắc mắc và hướng dẫn sử dụng hệ thống tận tình cho đội ngũ vận hành.
