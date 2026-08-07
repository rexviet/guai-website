const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080 });
  await page.goto('http://localhost:4321', { waitUntil: 'networkidle0' });

  const result = await page.evaluate(() => {
    const title = document.querySelector('.best-work-title');
    if (!title) return "No title found";
    
    const computed = window.getComputedStyle(title);
    return {
      text: title.innerText,
      display: computed.display,
      visibility: computed.visibility,
      opacity: computed.opacity,
      color: computed.color,
      zIndex: computed.zIndex,
      position: computed.position,
      fontSize: computed.fontSize,
      rect: {
        x: title.getBoundingClientRect().x,
        y: title.getBoundingClientRect().y,
        width: title.getBoundingClientRect().width,
        height: title.getBoundingClientRect().height
      },
      parentRect: {
        x: title.parentElement.getBoundingClientRect().x,
        y: title.parentElement.getBoundingClientRect().y,
        width: title.parentElement.getBoundingClientRect().width,
        height: title.parentElement.getBoundingClientRect().height
      }
    };
  });
  
  console.log(JSON.stringify(result, null, 2));
  await browser.close();
})();
