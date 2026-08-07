const fs = require('fs');

let bodyContent = fs.readFileSync('src/pages/index.astro', 'utf8');

bodyContent = bodyContent.replace('YOUR VIDEO WORLD', 'GUAI STUDIO');
bodyContent = bodyContent.replace('Welcome to Kakao, the ultimate video streaming platform designed to elevate your entertainment experience. Enjoy the show!', 'Studio tiên phong sáng tạo Video TVC AI, Virtual KOL và Kỹ xảo kỹ thuật số tại Việt Nam.');

bodyContent = bodyContent.replace('All Your Video Content Needs! Let\'s Create!', 'Khám Phá Dịch Vụ Của Chúng Tôi');

bodyContent = bodyContent.replace('GET READY TO GO ON AN AMAZING VIDEO WATCHING ADVENTURE!', 'SẴN SÀNG ĐỂ TẠO RA NHỮNG VIDEO ĐỈNH CAO BẰNG AI!');

bodyContent = bodyContent.replace('Let\\\'s Create Smile-Worthy Digital Content Together.', 'Hãy cùng nhau tạo ra những sản phẩm sáng tạo đột phá.');
bodyContent = bodyContent.replace('Get ready to unlock the power of visual storytelling and take your video', 'Liên hệ với chúng tôi ngay hôm nay để bắt đầu.');

fs.writeFileSync('src/pages/index.astro', bodyContent);
console.log('Fixed hero text');
