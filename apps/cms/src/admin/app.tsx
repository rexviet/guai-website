import type { StrapiApp } from '@strapi/strapi/admin';

export default {
  config: {
    locales: [],
  },
  bootstrap(app: StrapiApp) {
    if (typeof window !== 'undefined') {
      // Auto embed interactive HTML5 Video Player inside Admin Media Picker cards
      const checkAndEmbedVideoPlayers = () => {
        // Find media card previews or links containing mp4 files
        const mediaCards = document.querySelectorAll('div[data-strapi-field], div');
        
        // Scan for elements containing .mp4 file text or links
        const mp4Links = Array.from(document.querySelectorAll('a[href*=".mp4"], button')) as HTMLElement[];
        
        // Find text nodes or labels ending with .mp4
        const allTextElements = Array.from(document.querySelectorAll('span, p, div')) as HTMLElement[];
        allTextElements.forEach((el) => {
          if (
            el.children.length === 0 &&
            el.textContent &&
            el.textContent.trim().endsWith('.mp4') &&
            !el.getAttribute('data-video-player-added')
          ) {
            const parentCard = el.closest('div[class*="Card"], div[class*="Box"], div');
            if (parentCard && !parentCard.querySelector('video.admin-preview-player')) {
              el.setAttribute('data-video-player-added', 'true');
              
              // Find video URL from sibling links, data attributes, or fetch from text
              let videoUrl = '';
              const link = parentCard.querySelector('a[href*=".mp4"]') as HTMLAnchorElement;
              if (link && link.href) {
                videoUrl = link.href;
              } else {
                // Search for any nearby link or relative path
                const filename = el.textContent.trim();
                videoUrl = `https://cdn.guai.studio/${filename}`;
              }

              if (videoUrl) {
                const videoElem = document.createElement('video');
                videoElem.className = 'admin-preview-player';
                videoElem.controls = true;
                videoElem.preload = 'metadata';
                videoElem.style.width = '100%';
                videoElem.style.maxHeight = '240px';
                videoElem.style.borderRadius = '8px';
                videoElem.style.marginTop = '12px';
                videoElem.style.backgroundColor = '#000';
                videoElem.style.objectFit = 'contain';
                videoElem.src = videoUrl;

                parentCard.appendChild(videoElem);
              }
            }
          }
        });
      };

      setInterval(checkAndEmbedVideoPlayers, 1000);
    }
  },
};
