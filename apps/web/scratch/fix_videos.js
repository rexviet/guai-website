const fs = require('fs');

let bodyContent = fs.readFileSync('src/pages/index.astro', 'utf8');

// Replace services videos with correct fallback
bodyContent = bodyContent.replace(
  /<video autoplay loop muted playsinline style={`background-image:url\("\\$\\{services\[0\]\?\.featured_image\?\.url \|\| bannerPoster\}"\)`} data-object-fit="cover">\{services\[0\]\?\.featured_image\?\.url && <source src=\{services\[0\]\?\.featured_image\?\.url\} \/>\}<\/video>/g,
  '<video autoplay loop muted playsinline style={`background-image:url("${services[0]?.image?.url || services[0]?.image || bannerPoster}")`} data-object-fit="cover"><source src={services[0]?.video?.url || services[0]?.video || bannerVideo} /></video>'
);

bodyContent = bodyContent.replace(
  /<video autoplay loop muted playsinline style={`background-image:url\("\\$\\{services\[1\]\?\.featured_image\?\.url \|\| bannerPoster\}"\)`} data-object-fit="cover">\{services\[1\]\?\.featured_image\?\.url && <source src=\{services\[1\]\?\.featured_image\?\.url\} \/>\}<\/video>/g,
  '<video autoplay loop muted playsinline style={`background-image:url("${services[1]?.image?.url || services[1]?.image || bannerPoster}")`} data-object-fit="cover"><source src={services[1]?.video?.url || services[1]?.video || bannerVideo} /></video>'
);

bodyContent = bodyContent.replace(
  /<video autoplay loop muted playsinline style={`background-image:url\("\\$\\{services\[2\]\?\.featured_image\?\.url \|\| bannerPoster\}"\)`} data-object-fit="cover">\{services\[2\]\?\.featured_image\?\.url && <source src=\{services\[2\]\?\.featured_image\?\.url\} \/>\}<\/video>/g,
  '<video autoplay loop muted playsinline style={`background-image:url("${services[2]?.image?.url || services[2]?.image || bannerPoster}")`} data-object-fit="cover"><source src={services[2]?.video?.url || services[2]?.video || bannerVideo} /></video>'
);

// Replace caseStudies videos
for (let i = 0; i < 3; i++) {
  bodyContent = bodyContent.replace(
    new RegExp(`<video autoplay loop muted playsinline style={\`background-image:url\\("\\\\$\\\\{caseStudies\\[${i}\\]\\?\\.thumbnail\\?\\.url \\|\\| bannerPoster\\}"\\)\`} data-object-fit="cover">\\{caseStudies\\[${i}\\]\\?\\.thumbnail\\?\\.url && <source src=\\{caseStudies\\[${i}\\]\\?\\.thumbnail\\?\\.url\\} \\/>\\}<\\/video>`, 'g'),
    `<video autoplay loop muted playsinline style={\`background-image:url("\${caseStudies[${i}]?.image?.url || caseStudies[${i}]?.image || bannerPoster}")\`} data-object-fit="cover"><source src={caseStudies[${i}]?.video?.url || caseStudies[${i}]?.video || bannerVideo} /></video>`
  );
}

fs.writeFileSync('src/pages/index.astro', bodyContent);
console.log('Fixed videos');
