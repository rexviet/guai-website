const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080 });
  await page.goto('file:///Users/vietphung/Data/guai-studio-website/kakao_home.html', { waitUntil: 'networkidle0' });
  await page.screenshot({ path: 'original_noscroll.png', fullPage: true });
  await browser.close();
})();
