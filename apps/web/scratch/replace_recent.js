const fs = require('fs');

let html = fs.readFileSync('scratch/recent_work.html', 'utf8');

// Replace the video in image-three (left side)
html = html.replace(/<article[^>]*>.*?<\/article>/s, 
  `<article class="best-video-work w-background-video w-background-video-atom">
    <video autoplay loop muted playsinline style={\`background-image:url("\${caseStudies[0]?.thumbnail?.url || bannerPoster}")\`} data-object-fit="cover">
      {caseStudies[0]?.thumbnail?.url && <source src={caseStudies[0]?.thumbnail?.url} />}
    </video>
  </article>`);

// Replace the video in image-two (left side)
html = html.replace(/<div data-poster-url="[^>]*class="best-video-work[^>]*>.*?<\/div>/s,
  `<div class="best-video-work w-background-video w-background-video-atom">
    <video autoplay loop muted playsinline style={\`background-image:url("\${caseStudies[1]?.thumbnail?.url || bannerPoster}")\`} data-object-fit="cover">
      {caseStudies[1]?.thumbnail?.url && <source src={caseStudies[1]?.thumbnail?.url} />}
    </video>
  </div>`);

// Replace the video in image-one (left side)
html = html.replace(/<div data-poster-url="[^>]*class="best-video-work[^>]*>.*?<\/div>/s,
  `<div class="best-video-work w-background-video w-background-video-atom">
    <video autoplay loop muted playsinline style={\`background-image:url("\${caseStudies[2]?.thumbnail?.url || bannerPoster}")\`} data-object-fit="cover">
      {caseStudies[2]?.thumbnail?.url && <source src={caseStudies[2]?.thumbnail?.url} />}
    </video>
  </div>`);

// Now for the right side

// First intro-box
html = html.replace(/<h2 class="best-work-title">Creating an Effective Video Ad Campaign<\/h2>/g, 
  '<h2 class="best-work-title">{caseStudies[0]?.title}</h2>');
html = html.replace(/<div data-poster-url="[^>]*class="best-video-work[^>]*>(.*?)<div data-w-id="6ac90aad-272f-5970-2e14-992b9197710f"/s,
  `<div class="best-video-work w-background-video w-background-video-atom">
    <video autoplay loop muted playsinline style={\`background-image:url("\${caseStudies[0]?.thumbnail?.url || bannerPoster}")\`} data-object-fit="cover">
      {caseStudies[0]?.thumbnail?.url && <source src={caseStudies[0]?.thumbnail?.url} />}
    </video>
    <div data-w-id="6ac90aad-272f-5970-2e14-992b9197710f"`);

html = html.replace(/<p id="w-node-_41adf324-56a4-046a-b606-9aedb502abae-50f20c2b" class="services-description">.*?<\/p>/,
  '<p id="w-node-_41adf324-56a4-046a-b606-9aedb502abae-50f20c2b" class="services-description">{caseStudies[0]?.summary || caseStudies[0]?.description}</p>');

// Second intro-box
html = html.replace(/<h2 class="best-work-title">Best Technologies in Video Production<\/h2>/g, 
  '<h2 class="best-work-title">{caseStudies[1]?.title}</h2>');
html = html.replace(/<div data-poster-url="[^>]*class="best-video-work[^>]*>(.*?)<div data-w-id="51e864f6-7fc4-b27c-01f6-3f9d1c0c28b3"/s,
  `<div class="best-video-work w-background-video w-background-video-atom">
    <video autoplay loop muted playsinline style={\`background-image:url("\${caseStudies[1]?.thumbnail?.url || bannerPoster}")\`} data-object-fit="cover">
      {caseStudies[1]?.thumbnail?.url && <source src={caseStudies[1]?.thumbnail?.url} />}
    </video>
    <div data-w-id="51e864f6-7fc4-b27c-01f6-3f9d1c0c28b3"`);
    
html = html.replace(/<p id="w-node-_41adf324-56a4-046a-b606-9aedb502abbd-50f20c2b" class="services-description">.*?<\/p>/,
  '<p id="w-node-_41adf324-56a4-046a-b606-9aedb502abbd-50f20c2b" class="services-description">{caseStudies[1]?.summary || caseStudies[1]?.description}</p>');

// Third intro-box
html = html.replace(/<h2 class="best-work-title">Creation of dynamic visual transitions<\/h2>/g, 
  '<h2 class="best-work-title">{caseStudies[2]?.title}</h2>');
html = html.replace(/<div data-poster-url="[^>]*class="best-video-work[^>]*>(.*?)<div data-w-id="90e6484f-1c6f-3102-89da-51e7ed6bc913"/s,
  `<div class="best-video-work w-background-video w-background-video-atom">
    <video autoplay loop muted playsinline style={\`background-image:url("\${caseStudies[2]?.thumbnail?.url || bannerPoster}")\`} data-object-fit="cover">
      {caseStudies[2]?.thumbnail?.url && <source src={caseStudies[2]?.thumbnail?.url} />}
    </video>
    <div data-w-id="90e6484f-1c6f-3102-89da-51e7ed6bc913"`);

html = html.replace(/<p id="w-node-_41adf324-56a4-046a-b606-9aedb502abcc-50f20c2b" class="services-description">.*?<\/p>/,
  '<p id="w-node-_41adf324-56a4-046a-b606-9aedb502abcc-50f20c2b" class="services-description">{caseStudies[2]?.summary || caseStudies[2]?.description}</p>');


// Also replace the href links
html = html.replace(/href="\/works-1"/g, 'href={`/work/${caseStudies[0]?.slug}`}');

// Also remove everything before <section id="recent-work"
html = html.substring(html.indexOf('<section id="recent-work"'));

fs.writeFileSync('scratch/recent_work.astro', html);
