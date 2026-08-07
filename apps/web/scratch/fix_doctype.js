const fs = require('fs');

let content = fs.readFileSync('src/pages/index.astro', 'utf8');

// The content starts with:
// ---
// import BaseLayout from '../layouts/BaseLayout.astro';
// ...
// ---
// 
// <BaseLayout ...>
// <!doctype html>
// <html ...>

// Let's just find `<BaseLayout` and the end of its opening tag.
const baseLayoutMatch = content.match(/<BaseLayout[^>]*>/);
if (baseLayoutMatch) {
  const afterBaseLayout = content.indexOf(baseLayoutMatch[0]) + baseLayoutMatch[0].length;
  const beforeBaseLayout = content.substring(0, afterBaseLayout);
  
  // Find where the actual home-1-section begins
  const home1Start = content.indexOf('class="home-1-section"');
  if (home1Start !== -1) {
    // We need to back up to the `<div` that starts this section
    const upToHome1 = content.substring(0, home1Start);
    const divStart = upToHome1.lastIndexOf('<div');
    
    const bodyContent = content.substring(divStart);
    
    fs.writeFileSync('src/pages/index.astro', beforeBaseLayout + "\n" + bodyContent);
    console.log('Fixed doctype');
  } else {
    console.log('home-1-section not found');
  }
} else {
  console.log('BaseLayout not found');
}
