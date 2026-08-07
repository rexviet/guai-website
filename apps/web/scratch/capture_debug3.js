const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080 });
  await page.goto('file:///Users/vietphung/Data/guai-studio-website/kakao_home.html', { waitUntil: 'networkidle0' });

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

  const textVisible = await page.evaluate(() => {
    const titles = document.querySelectorAll('.best-work-title');
    return Array.from(titles).map(t => {
      const rect = t.getBoundingClientRect();
      const style = window.getComputedStyle(t);
      return {
        text: t.innerText,
        width: rect.width,
        height: rect.height,
        color: style.color,
        opacity: style.opacity,
        visibility: style.visibility
      };
    });
  });

  console.log("TITLES IN ORIGINAL:", JSON.stringify(textVisible, null, 2));

  await browser.close();
})();
