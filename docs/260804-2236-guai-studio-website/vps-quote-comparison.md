# So sánh VPS — GuAI Studio Website

Yêu cầu: tối thiểu 2GB RAM (chạy Strapi + Postgres + Nginx), ưu tiên region gần Việt Nam để giảm độ trễ khi ops truy cập Strapi admin và khi khách submit form liên hệ (phần nội dung tĩnh đã có Cloudflare cache nên ít bị ảnh hưởng, nhưng admin panel + API vẫn hit trực tiếp origin).

**Lưu ý:** giá dưới đây là ước lượng tại thời điểm soạn, providers có thể đổi giá — cần vào trang chính thức verify trước khi chốt mua.

| Provider | Gói đề xuất | RAM / vCPU / Disk | Region gần VN | Giá ước lượng/tháng | Ghi chú |
|---|---|---|---|---|---|
| **Vultr** | Cloud Compute 2GB | 2GB / 1 vCPU / 55GB SSD | Singapore | ~$10-12 | Region Singapore latency tốt tới VN, dễ dùng, thanh toán linh hoạt theo giờ |
| **DigitalOcean** | Basic Droplet 2GB | 2GB / 1 vCPU / 50GB SSD | Singapore | ~$12-14 | Docs/tutorial nhiều nhất, UI thân thiện, dễ tìm hỗ trợ khi cần |
| **Contabo** | Cloud VPS 10 | 6GB / 3 vCPU / 100GB | Singapore | ~$8-10 | RAM/disk nhiều hơn hẳn cùng tầm giá, nhưng ít provider Việt Nam feedback về hiệu năng ổn định ở khu vực Asia hơn 2 provider trên |
| **Nhà cung cấp VN nội địa** (vd Vietnix, AZDIGI, iNET...) | Gói tương đương 2GB RAM | 2GB / 1-2 vCPU / SSD | Việt Nam (nội địa) | Cần báo giá trực tiếp | Latency thấp nhất tới VN, hỗ trợ tiếng Việt, nhưng cần tự kiểm tra uy tín/uptime SLA vì đa dạng nhà cung cấp — nên hỏi khách có provider quen thuộc muốn dùng không |

## Khuyến nghị

**Vultr Singapore 2GB** là lựa chọn cân bằng nhất: giá trong ngân sách "tiết kiệm" đã thống nhất, region gần VN, đủ tài nguyên cho Strapi+Postgres+Nginx theo thiết kế đã chốt. Nếu khách có provider VN quen thuộc (dễ thanh toán nội địa, hỗ trợ tiếng Việt), có thể cân nhắc thay thế miễn đảm bảo tối thiểu 2GB RAM.

**Việc cần khách quyết định:**
1. Chọn provider (bảng trên) — hoặc đề xuất provider khác nếu đã có sẵn quan hệ/tài khoản.
2. Xác nhận ngân sách cuối cùng (dao động $8-14/tháng tùy provider) có nằm trong dự kiến "tiết kiệm ~$5-12" đã thống nhất hay cần điều chỉnh.
