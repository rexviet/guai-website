const fs = require('fs');
let indexHtml = fs.readFileSync('src/pages/index.astro', 'utf8');
let recentHtml = fs.readFileSync('scratch/recent_work.astro', 'utf8');

// Find the start and end of recent-work in indexHtml
const startTag = '<section id="recent-work" class="section without-top-spacing">';
const endTag = '  <div data-w-id="92dba6dd-f1b4-079e-312a-4872224e3139" class="video-section">';

const startIndex = indexHtml.indexOf(startTag);
const endIndex = indexHtml.indexOf(endTag);

if (startIndex !== -1 && endIndex !== -1) {
  const newIndexHtml = indexHtml.substring(0, startIndex) + recentHtml + "\n" + indexHtml.substring(endIndex);
  fs.writeFileSync('src/pages/index.astro', newIndexHtml);
  console.log('Success');
} else {
  console.log('Failed to find tags', startIndex, endIndex);
}
