import type { StrapiApp } from '@strapi/strapi/admin';

export default {
  config: {
    locales: [],
  },
  bootstrap(app: StrapiApp) {
    if (typeof window !== 'undefined') {
      // Global listener for video file selection in Strapi Admin
      window.addEventListener(
        'change',
        async (event: Event) => {
          const target = event.target as HTMLInputElement;
          if (target && target.type === 'file' && target.files && target.files.length > 0) {
            const file = target.files[0];
            if (file && file.type.startsWith('video/')) {
              console.log('🎬 Local video file selected in Strapi Admin:', file.name);
              try {
                // 1. Create local Blob URL (0 CORS, 0 network latency)
                const localBlobUrl = URL.createObjectURL(file);
                const video = document.createElement('video');
                video.muted = true;
                video.playsInline = true;
                video.src = localBlobUrl;

                await new Promise<void>((resolve) => {
                  video.onloadedmetadata = () => {
                    video.currentTime = Math.min(0.5, (video.duration || 1) / 2);
                  };
                  video.onseeked = () => resolve();
                  video.onerror = () => resolve();
                  setTimeout(() => resolve(), 5000);
                });

                // 2. Render 0.5s frame to canvas
                const canvas = document.createElement('canvas');
                canvas.width = video.videoWidth || 1280;
                canvas.height = video.videoHeight || 720;
                const ctx = canvas.getContext('2d');
                if (ctx) {
                  ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
                  const posterBlob = await new Promise<Blob | null>((res) =>
                    canvas.toBlob((b) => res(b), 'image/jpeg', 0.85)
                  );

                  if (posterBlob) {
                    // 3. Upload generated poster image to R2
                    const formData = new FormData();
                    formData.append('files', posterBlob, `poster-${Date.now()}.jpg`);
                    const jwt =
                      sessionStorage.getItem('jwtToken') ||
                      localStorage.getItem('jwtToken') ||
                      '';

                    const uploadRes = await fetch('/api/upload', {
                      method: 'POST',
                      headers: jwt ? { Authorization: `Bearer ${jwt}` } : {},
                      body: formData,
                    });

                    if (uploadRes.ok) {
                      const resData = await uploadRes.json();
                      if (resData && resData[0] && resData[0].url) {
                        const posterUrl = resData[0].url.startsWith('http')
                          ? resData[0].url
                          : window.location.origin + resData[0].url;

                        // 4. Fill poster_url input in DOM
                        setTimeout(() => {
                          const posterInputs = Array.from(
                            document.querySelectorAll('input[name*="poster_url"]')
                          ) as HTMLInputElement[];
                          posterInputs.forEach((input) => {
                            const valueSetter = Object.getOwnPropertyDescriptor(
                              window.HTMLInputElement.prototype,
                              'value'
                            )?.set;
                            if (valueSetter) {
                              valueSetter.call(input, posterUrl);
                            } else {
                              input.value = posterUrl;
                            }
                            input.dispatchEvent(new Event('input', { bubbles: true }));
                            input.dispatchEvent(new Event('change', { bubbles: true }));
                          });
                        }, 500);
                      }
                    }
                  }
                }
                URL.revokeObjectURL(localBlobUrl);
              } catch (err) {
                console.error('Auto poster generation error:', err);
              }
            }
          }
        },
        true
      );
    }
  },
};
