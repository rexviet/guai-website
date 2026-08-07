const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080 });
  await page.goto('http://localhost:4321', { waitUntil: 'networkidle0' });

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
    const titles = document.querySelectorAll('.best-work-title');
    const topcons = document.querySelectorAll('.top-title-con');
    
    const rectToObject = (rect) => rect ? { x: rect.x, y: rect.y, width: rect.width, height: rect.height } : null;

    return {
      list: rectToObject(list?.getBoundingClientRect()),
      items: Array.from(items).map(i => rectToObject(i.getBoundingClientRect())),
      topcons: Array.from(topcons).map(i => rectToObject(i.getBoundingClientRect())),
      topconOpacities: Array.from(topcons).map(i => window.getComputedStyle(i).opacity),
      titles: Array.from(titles).map(t => ({
        text: t.innerText,
        rect: rectToObject(t.getBoundingClientRect()),
        color: window.getComputedStyle(t).color,
        opacity: window.getComputedStyle(t).opacity,
        display: window.getComputedStyle(t).display,
        visibility: window.getComputedStyle(t).visibility
      }))
    };
  });
  
  console.log("BOUNDS:", JSON.stringify(bounds, null, 2));

  await browser.close();
})();
