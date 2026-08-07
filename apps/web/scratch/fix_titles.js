const fs = require('fs');

let bodyContent = fs.readFileSync('src/pages/index.astro', 'utf8');

bodyContent = bodyContent.replace('Creating an Effective Video Ad Campaign', '{caseStudies[0]?.title}');
bodyContent = bodyContent.replace('Discover Kakao\\\'s latest and greatest short form content production work. Experience our talent and innovation in every project.', '{caseStudies[0]?.summary || caseStudies[0]?.description}');

bodyContent = bodyContent.replace('Best Technologies in Video Production', '{caseStudies[1]?.title}');
bodyContent = bodyContent.replace('Discover Kakao\\\'s latest and greatest commercial film production work. Experience our talent and innovation in every project.', '{caseStudies[1]?.summary || caseStudies[1]?.description}');

bodyContent = bodyContent.replace('Creation of dynamic visual transitions', '{caseStudies[2]?.title}');
bodyContent = bodyContent.replace('Discover Kakao\\\'s latest and greatest music video production work. Experience our talent and innovation in every project.', '{caseStudies[2]?.summary || caseStudies[2]?.description}');

fs.writeFileSync('src/pages/index.astro', bodyContent);
console.log('Fixed titles');
