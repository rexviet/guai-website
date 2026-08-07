const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 800 });
  
  await page.goto('http://localhost:4322', { waitUntil: 'networkidle0' });
  
  // Strip opacity: 0
  await page.evaluate(() => {
    document.querySelectorAll('[style*="opacity:0"], [style*="opacity: 0"]').forEach(el => {
      el.style.opacity = '1';
    });
  });
  
  // Wait a bit for images/videos
  await new Promise(r => setTimeout(r, 2000));
  
  await page.screenshot({ path: 'local_debug_visible.png', fullPage: true });
  await browser.close();
  console.log('Saved local_debug_visible.png');
})();
