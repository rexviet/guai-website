const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080 });
  await page.goto('http://localhost:4322', { waitUntil: 'networkidle0' });

  // Scroll down multiple times to trigger animations
  await page.evaluate(async () => {
    await new Promise((resolve) => {
      let totalHeight = 0;
      const distance = 300;
      const timer = setInterval(() => {
        const scrollHeight = document.body.scrollHeight;
        window.scrollBy(0, distance);
        totalHeight += distance;
        if (totalHeight >= scrollHeight) {
          clearInterval(timer);
          resolve();
        }
      }, 100);
    });
  });

  await new Promise(r => setTimeout(r, 2000));

  // Debug elements
  const bounds = await page.evaluate(() => {
    const list = document.querySelector('.sticky-box-list');
    const items = document.querySelectorAll('.intro-box');
    const title = document.querySelector('.best-work-title');
    
    // Force visible
    document.head.insertAdjacentHTML('beforeend', '<style>.sticky-box-list, .intro-box, .best-work-title { border: 2px solid red !important; opacity: 1 !important; display: block !important; color: red !important; visibility: visible !important; }</style>');

    return {
      list: list ? list.getBoundingClientRect() : null,
      items: Array.from(items).map(i => i.getBoundingClientRect()),
      title: title ? title.innerText : null,
      titleBounds: title ? title.getBoundingClientRect() : null,
    };
  });
  
  console.log("BOUNDS:", JSON.stringify(bounds, null, 2));

  await page.screenshot({ path: 'local_debug.png', fullPage: true });
  await browser.close();
})();
