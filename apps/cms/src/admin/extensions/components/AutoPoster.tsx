import React, { useState } from 'react';
import { Button, Flex, Typography, Box } from '@strapi/design-system';

export const AutoPosterInput = () => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleGeneratePoster = async () => {
    setLoading(true);
    setMessage('Đang trích xuất frame từ video...');

    try {
      let videoUrl = '';

      // 1. Search for any video element or link preview in DOM
      const videoElem = document.querySelector('video') as HTMLVideoElement;
      if (videoElem && videoElem.src) {
        videoUrl = videoElem.src;
      }

      // 2. Fallback: Search for mp4_url or video_file inputs
      if (!videoUrl) {
        const mp4Input = document.querySelector('input[name*="mp4_url"]') as HTMLInputElement;
        if (mp4Input && mp4Input.value) {
          videoUrl = mp4Input.value;
        }
      }

      // 3. Fallback: Search for any media preview image/link
      if (!videoUrl) {
        const mediaLinks = Array.from(document.querySelectorAll('a[href*=".mp4"]')) as HTMLAnchorElement[];
        if (mediaLinks.length > 0) {
          videoUrl = mediaLinks[0].href;
        }
      }

      if (!videoUrl) {
        setMessage('⚠️ Chưa tìm thấy video file/link nào trong form!');
        setLoading(false);
        return;
      }

      // Format full URL if relative
      if (videoUrl.startsWith('/')) {
        videoUrl = window.location.origin + videoUrl;
      }

      // Create hidden video element to extract 0.5s frame
      const video = document.createElement('video');
      video.crossOrigin = 'anonymous';
      video.src = videoUrl;
      video.muted = true;
      video.currentTime = 0.5;

      await new Promise((resolve, reject) => {
        video.onloadeddata = resolve;
        video.onerror = reject;
        setTimeout(reject, 10000); // 10s timeout
      });

      // Render to canvas
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth || 1280;
      canvas.height = video.videoHeight || 720;
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('Canvas context not available');
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      // Convert canvas to JPEG Blob
      const blob = await new Promise<Blob>((resolve, reject) => {
        canvas.toBlob((b) => (b ? resolve(b) : reject(new Error('Canvas blob failed'))), 'image/jpeg', 0.85);
      });

      // Prepare Form Data for Strapi /api/upload
      const formData = new FormData();
      const filename = `auto-poster-${Date.now()}.jpg`;
      formData.append('files', blob, filename);

      setMessage('Đang upload Poster lên Cloudflare R2...');
      const uploadRes = await fetch('/api/upload', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem('jwtToken') || localStorage.getItem('jwtToken') || ''}`,
        },
        body: formData,
      });

      if (!uploadRes.ok) {
        throw new Error(`Upload failed with status ${uploadRes.status}`);
      }

      const uploadedFiles = await uploadRes.json();
      if (uploadedFiles && uploadedFiles[0]) {
        const fileObj = uploadedFiles[0];
        const posterUrl = fileObj.url.startsWith('http') ? fileObj.url : window.location.origin + fileObj.url;

        // Auto update poster_url input in DOM if present
        const posterInput = document.querySelector('input[name*="poster_url"]') as HTMLInputElement;
        if (posterInput) {
          posterInput.value = posterUrl;
          posterInput.dispatchEvent(new Event('input', { bubbles: true }));
        }

        setMessage('✅ Đã tạo & upload Poster lên R2 thành công!');
      }
    } catch (err: any) {
      console.error('Error generating auto poster:', err);
      setMessage(`❌ Lỗi: ${err.message || 'Không thể trích xuất frame'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box padding={3} background="neutral100" hasRadius borderColor="neutral200">
      <Flex direction="column" alignItems="flex-start" gap={2}>
        <Typography variant="pi" fontWeight="bold">
          ⚡️ Tự động tạo Poster từ Video (Client-side)
        </Typography>
        <Button onClick={handleGeneratePoster} loading={loading} variant="secondary" size="S">
          📸 Chụp & Upload Poster lên R2
        </Button>
        {message && (
          <Typography variant="pi" textColor="neutral600">
            {message}
          </Typography>
        )}
      </Flex>
    </Box>
  );
};
