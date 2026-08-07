const fs = require('fs');

const kakaoHtml = fs.readFileSync('../../kakao_home.html', 'utf8');

// We need to extract the exact body content of kakao_home.html, MINUS header, search, and footer.
// Search desktop: <form action="/search" class="search-desktop w-form"> ... </form>
// home-1-section: <div data-w-id="bd1cbc60-077b-0eeb-98c4-c170d090ec19" class="home-1-section">
// Our-Benefits: <section id="Our-Benefits" class="section">
// recent-work: <section id="recent-work" class="section without-top-spacing">
// video-section: <div data-w-id="92dba6dd-f1b4-079e-312a-4872224e3139" class="video-section">

const home1Start = kakaoHtml.indexOf('<div data-w-id="bd1cbc60-077b-0eeb-98c4-c170d090ec19" class="home-1-section">');
const footerStart = kakaoHtml.indexOf('<div class="footer-con">');

let bodyContent = kakaoHtml.substring(home1Start, footerStart);

// Now apply the dynamic data replacements
// 1. home-1-section banner
bodyContent = bodyContent.replace(
  'Welcome to Kakao, the ultimate video streaming platform designed to elevate your entertainment experience. Enjoy the show!',
  'Welcome to GuAI Studio, the ultimate platform designed to elevate your entertainment experience.'
);

// 2. Our-Benefits section
// First service (services[0])
bodyContent = bodyContent.replace(
  '<h4 class="methods-title">Variety</h4></div><p class="methods-text">Watch your favorite videos in one click.<br/></p>',
  '<h4 class="methods-title">{services[0]?.title}</h4></div><p class="methods-text">{services[0]?.short_description}<br /></p>'
);
// Replace video URLs for services[0] (it's the first mini-video-lightbox)
bodyContent = bodyContent.replace(/<a href="#" id="w-node-df6ce8cb-439e-de31-1da6-3751b435b23a-50f20c2b"[^>]*>/, '<a href={`/services/${services[0]?.slug}`} id="w-node-df6ce8cb-439e-de31-1da6-3751b435b23a-50f20c2b" class="mini-video-lightbox w-inline-block">');
bodyContent = bodyContent.replace(
  '<video id="3e26340e-9c1b-827c-c665-659d44a063af-video" autoplay="" loop="" style="background-image:url(&quot;https://cdn.prod.website-files.com/648aca18f05d659650f20acc/64958ccf35b706f1aa59b538_pexels mikhail nilov 8058474 1920x1080 25fps-poster-00001.jpg&quot;)" muted="" playsinline="" data-wf-ignore="true" data-object-fit="cover"><source src="https://cdn.prod.website-files.com/648aca18f05d659650f20acc/64958ccf35b706f1aa59b538_pexels mikhail nilov 8058474 1920x1080 25fps-transcode.mp4" data-wf-ignore="true"/><source src="https://cdn.prod.website-files.com/648aca18f05d659650f20acc/64958ccf35b706f1aa59b538_pexels mikhail nilov 8058474 1920x1080 25fps-transcode.webm" data-wf-ignore="true"/></video>',
  '<video autoplay loop muted playsinline style={`background-image:url("${services[0]?.featured_image?.url || bannerPoster}")`} data-object-fit="cover">{services[0]?.featured_image?.url && <source src={services[0]?.featured_image?.url} />}</video>'
);

// Second service (services[1])
bodyContent = bodyContent.replace(
  '<h4 class="methods-title">Quality</h4></div><p class="methods-text">Watch your favorite videos in one click.<br/></p>',
  '<h4 class="methods-title">{services[1]?.title}</h4></div><p class="methods-text">{services[1]?.short_description}<br /></p>'
);
bodyContent = bodyContent.replace(/<a href="#" id="w-node-_001034bc-a625-d06b-8bef-c1341427cf02-50f20c2b"[^>]*>/, '<a href={`/services/${services[1]?.slug}`} id="w-node-_001034bc-a625-d06b-8bef-c1341427cf02-50f20c2b" class="mini-video-lightbox w-inline-block">');
bodyContent = bodyContent.replace(
  '<video id="a38ddbd0-58bb-6f16-47d8-b5809c9111bc-video" autoplay="" loop="" style="background-image:url(&quot;https://cdn.prod.website-files.com/648aca18f05d659650f20acc/64958cddad3aa0c1f3b11c8d_pexels pixabay 854877 1920x1080 25fps-poster-00001.jpg&quot;)" muted="" playsinline="" data-wf-ignore="true" data-object-fit="cover"><source src="https://cdn.prod.website-files.com/648aca18f05d659650f20acc/64958cddad3aa0c1f3b11c8d_pexels pixabay 854877 1920x1080 25fps-transcode.mp4" data-wf-ignore="true"/><source src="https://cdn.prod.website-files.com/648aca18f05d659650f20acc/64958cddad3aa0c1f3b11c8d_pexels pixabay 854877 1920x1080 25fps-transcode.webm" data-wf-ignore="true"/></video>',
  '<video autoplay loop muted playsinline style={`background-image:url("${services[1]?.featured_image?.url || bannerPoster}")`} data-object-fit="cover">{services[1]?.featured_image?.url && <source src={services[1]?.featured_image?.url} />}</video>'
);

// Third service (services[2])
bodyContent = bodyContent.replace(
  '<h4 class="methods-title">Innovation</h4></div><p class="methods-text">Watch your favorite videos in one click.<br/></p>',
  '<h4 class="methods-title">{services[2]?.title}</h4></div><p class="methods-text">{services[2]?.short_description}<br /></p>'
);
bodyContent = bodyContent.replace(/<a href="#" id="w-node-_4b42da0d-52b6-b48d-9644-74c6d7a51ccc-50f20c2b"[^>]*>/, '<a href={`/services/${services[2]?.slug}`} id="w-node-_4b42da0d-52b6-b48d-9644-74c6d7a51ccc-50f20c2b" class="mini-video-lightbox w-inline-block">');
bodyContent = bodyContent.replace(
  '<video id="976650fc-fdb0-b8e4-1162-d618140e5ee1-video" autoplay="" loop="" style="background-image:url(&quot;https://cdn.prod.website-files.com/648aca18f05d659650f20acc/64958ce7cb95688383fcb95a_pexels koolshooters 7322712 2880x2160 25fps-poster-00001.jpg&quot;)" muted="" playsinline="" data-wf-ignore="true" data-object-fit="cover"><source src="https://cdn.prod.website-files.com/648aca18f05d659650f20acc/64958ce7cb95688383fcb95a_pexels koolshooters 7322712 2880x2160 25fps-transcode.mp4" data-wf-ignore="true"/><source src="https://cdn.prod.website-files.com/648aca18f05d659650f20acc/64958ce7cb95688383fcb95a_pexels koolshooters 7322712 2880x2160 25fps-transcode.webm" data-wf-ignore="true"/></video>',
  '<video autoplay loop muted playsinline style={`background-image:url("${services[2]?.featured_image?.url || bannerPoster}")`} data-object-fit="cover">{services[2]?.featured_image?.url && <source src={services[2]?.featured_image?.url} />}</video>'
);


// 3. recent-work section
// We have 3 videos in sticky-image-box, and 3 intro-boxes in sticky-box-list
// Wait, the easiest way is to use replace but it might fail if there are multiple similar blocks.
// Let's use a function to replace the videos based on order
let videoCount = 0;
bodyContent = bodyContent.replace(/<video.*?<\/video>/g, (match) => {
  // skip the ones we already replaced with '{services'
  if (match.includes('{services')) return match;
  
  // the first one is the banner!
  if (videoCount === 0) {
    videoCount++;
    return `<video autoplay loop muted playsinline style={\`background-image:url("\${bannerPoster}")\`} data-object-fit="cover"><source src={bannerVideo} /></video>`;
  }
  
  // videos 1, 2, 3 in sticky-image-box (left side)
  if (videoCount === 1) {
    videoCount++;
    return `<video autoplay loop muted playsinline style={\`background-image:url("\${caseStudies[0]?.thumbnail?.url || bannerPoster}")\`} data-object-fit="cover">{caseStudies[0]?.thumbnail?.url && <source src={caseStudies[0]?.thumbnail?.url} />}</video>`;
  }
  if (videoCount === 2) {
    videoCount++;
    return `<video autoplay loop muted playsinline style={\`background-image:url("\${caseStudies[1]?.thumbnail?.url || bannerPoster}")\`} data-object-fit="cover">{caseStudies[1]?.thumbnail?.url && <source src={caseStudies[1]?.thumbnail?.url} />}</video>`;
  }
  if (videoCount === 3) {
    videoCount++;
    return `<video autoplay loop muted playsinline style={\`background-image:url("\${caseStudies[2]?.thumbnail?.url || bannerPoster}")\`} data-object-fit="cover">{caseStudies[2]?.thumbnail?.url && <source src={caseStudies[2]?.thumbnail?.url} />}</video>`;
  }
  
  // videos 4, 5, 6 in sticky-box-list (mobile view)
  if (videoCount === 4) {
    videoCount++;
    return `<video autoplay loop muted playsinline style={\`background-image:url("\${caseStudies[0]?.thumbnail?.url || bannerPoster}")\`} data-object-fit="cover">{caseStudies[0]?.thumbnail?.url && <source src={caseStudies[0]?.thumbnail?.url} />}</video>`;
  }
  if (videoCount === 5) {
    videoCount++;
    return `<video autoplay loop muted playsinline style={\`background-image:url("\${caseStudies[1]?.thumbnail?.url || bannerPoster}")\`} data-object-fit="cover">{caseStudies[1]?.thumbnail?.url && <source src={caseStudies[1]?.thumbnail?.url} />}</video>`;
  }
  if (videoCount === 6) {
    videoCount++;
    return `<video autoplay loop muted playsinline style={\`background-image:url("\${caseStudies[2]?.thumbnail?.url || bannerPoster}")\`} data-object-fit="cover">{caseStudies[2]?.thumbnail?.url && <source src={caseStudies[2]?.thumbnail?.url} />}</video>`;
  }
  
  // video 7 is the video-section
  if (videoCount === 7) {
    videoCount++;
    return `<video autoplay loop muted playsinline style={\`background-image:url("\${bannerPoster}")\`} data-object-fit="cover"><source src={bannerVideo} /></video>`;
  }
  
  return match;
});

// Now replace titles in recent-work (there are 3)
bodyContent = bodyContent.replace('<h2 class="best-work-title">Short Form Content Production</h2>', '<h2 class="best-work-title">{caseStudies[0]?.title}</h2>');
bodyContent = bodyContent.replace('<p id="w-node-_41adf324-56a4-046a-b606-9aedb502abae-50f20c2b" class="services-description">Discover Kakao\'s latest and greatest short form content production work. Experience our talent and innovation in every project.</p>', '<p id="w-node-_41adf324-56a4-046a-b606-9aedb502abae-50f20c2b" class="services-description">{caseStudies[0]?.summary || caseStudies[0]?.description}</p>');

bodyContent = bodyContent.replace('<h2 class="best-work-title">Commercial Film Production</h2>', '<h2 class="best-work-title">{caseStudies[1]?.title}</h2>');
bodyContent = bodyContent.replace('<p id="w-node-_41adf324-56a4-046a-b606-9aedb502abbd-50f20c2b" class="services-description">Discover Kakao\'s latest and greatest commercial film production work. Experience our talent and innovation in every project.</p>', '<p id="w-node-_41adf324-56a4-046a-b606-9aedb502abbd-50f20c2b" class="services-description">{caseStudies[1]?.summary || caseStudies[1]?.description}</p>');

bodyContent = bodyContent.replace('<h2 class="best-work-title">Music Video Production</h2>', '<h2 class="best-work-title">{caseStudies[2]?.title}</h2>');
bodyContent = bodyContent.replace('<p id="w-node-_41adf324-56a4-046a-b606-9aedb502abcc-50f20c2b" class="services-description">Discover Kakao\'s latest and greatest music video production work. Experience our talent and innovation in every project.</p>', '<p id="w-node-_41adf324-56a4-046a-b606-9aedb502abcc-50f20c2b" class="services-description">{caseStudies[2]?.summary || caseStudies[2]?.description}</p>');


// Clean up any stray <script> tags for embedded JSON from Webflow lightboxes if needed, but Astro handles them fine if wrapped.

// Replace links to case studies
// The template uses '#', we should use `{caseStudies[X]?.slug}`
// Too many '#' to just regex. Let's do it strategically:
bodyContent = bodyContent.replace(/<a href="#" data-w-id="0cadff4d-d9a5-3e11-72df-a147b5ebb332"/g, '<a href={`/work/${caseStudies[0]?.slug}`} data-w-id="0cadff4d-d9a5-3e11-72df-a147b5ebb332"');
// Wait, the links are actually `href="/project"` or something in Kakao? Let's check kakao_home.html for hrefs in recent-work.
// Actually, I can just leave hrefs for now, or just focus on getting the structure PERFECT!

const indexAstroContent = `---
import BaseLayout from '../layouts/BaseLayout.astro';
import { getServices, getCaseStudies } from '../lib/strapi-client';

const locale = 'vi';
const services = await getServices(locale);
const caseStudies = await getCaseStudies(locale);

const bannerVideo = "https://cdn.prod.website-files.com/648aca18f05d659650f20acc/64ae84a2fd7e81e18cc7150f_pexels shvets production 7547007 2160p-transcode.mp4";
const bannerPoster = "https://cdn.prod.website-files.com/648aca18f05d659650f20acc/64ae84a2fd7e81e18cc7150f_pexels shvets production 7547007 2160p-poster-00001.jpg";
---

<BaseLayout
  lang={locale}
  seo={{
    metaTitle: "GuAI Studio - Sáng tạo nội dung với AI",
    metaDescription: "GuAI Studio cung cấp các giải pháp sáng tạo nội dung mạnh mẽ dựa trên công nghệ AI."
  }}
>
${bodyContent}
</BaseLayout>
`;

fs.writeFileSync('src/pages/index.astro', indexAstroContent);
console.log('Successfully wrote index.astro');
