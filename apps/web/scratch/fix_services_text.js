const fs = require('fs');

let bodyContent = fs.readFileSync('src/pages/index.astro', 'utf8');

// Replace Service 1
bodyContent = bodyContent.replace('Variety', '{services[0]?.title}');
bodyContent = bodyContent.replace('Watch your favorite videos in one click.', '{services[0]?.short_description || services[0]?.description}');

// Replace Service 2
bodyContent = bodyContent.replace('Quality', '{services[1]?.title}');
bodyContent = bodyContent.replace('Watch your favorite videos in one click.', '{services[1]?.short_description || services[1]?.description}');

// Replace Service 3
bodyContent = bodyContent.replace('Innovation', '{services[2]?.title}');
bodyContent = bodyContent.replace('Watch your favorite videos in one click.', '{services[2]?.short_description || services[2]?.description}');

fs.writeFileSync('src/pages/index.astro', bodyContent);
console.log('Fixed services text');
