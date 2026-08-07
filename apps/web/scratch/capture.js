const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080 });
  
  try {
    await page.goto('http://localhost:4321', { waitUntil: 'load', timeout: 30000 });
    // Wait an extra second for animations
    await new Promise(r => setTimeout(r, 2000));
    await page.screenshot({ path: 'local.png', fullPage: true });
    console.log('Successfully captured local.png');
  } catch (e) {
    console.log('Failed to capture localhost:', e.message);
  }

  await browser.close();
})();
