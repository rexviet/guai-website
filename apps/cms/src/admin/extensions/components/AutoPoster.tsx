import React, { useState, useEffect } from 'react';
import { Button, Flex, Typography, Box } from '@strapi/design-system';

function setNativeInputValue(element: HTMLInputElement, value: string) {
  const valueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value')?.set;
  const prototype = Object.getPrototypeOf(element);
  const prototypeValueSetter = Object.getOwnPropertyDescriptor(prototype, 'value')?.set;

  if (prototypeValueSetter && valueSetter !== prototypeValueSetter) {
    prototypeValueSetter.call(element, value);
  } else if (valueSetter) {
    valueSetter.call(element, value);
  } else {
    element.value = value;
  }
  element.dispatchEvent(new Event('input', { bubbles: true }));
  element.dispatchEvent(new Event('change', { bubbles: true }));
}

export const AutoPosterInput = () => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  // Auto sync mp4_url when a video_file is selected/uploaded
  useEffect(() => {
    const timer = setInterval(() => {
      const videoElem = document.querySelector('video') as HTMLVideoElement;
      const mediaLinks = Array.from(document.querySelectorAll('a[href*=".mp4"]')) as HTMLAnchorElement[];
      let currentVideoUrl = '';

      if (videoElem && videoElem.src) {
        currentVideoUrl = videoElem.src;
      } else if (mediaLinks.length > 0) {
        currentVideoUrl = mediaLinks[0].href;
      }

      if (currentVideoUrl) {
        if (currentVideoUrl.startsWith('/')) {
          currentVideoUrl = window.location.origin + currentVideoUrl;
        }
        const mp4Input = document.querySelector('input[name*="mp4_url"]') as HTMLInputElement;
        if (mp4Input && mp4Input.value !== currentVideoUrl) {
          setNativeInputValue(mp4Input, currentVideoUrl);
        }
      }
    }, 1500);

    return () => clearInterval(timer);
  }, []);

  const handleGeneratePoster = async () => {
    setLoading(true);
    setMessage('Đang đọc video...');

    try {
      let videoUrl = '';

      // 1. Search for video element or link preview in DOM
      const videoElem = document.querySelector('video') as HTMLVideoElement;
      if (videoElem && videoElem.src) {
        videoUrl = videoElem.src;
      }

      if (!videoUrl) {
        const mp4Input = document.querySelector('input[name*="mp4_url"]') as HTMLInputElement;
        if (mp4Input && mp4Input.value) {
          videoUrl = mp4Input.value;
        }
      }

      if (!videoUrl) {
        const mediaLinks = Array.from(document.querySelectorAll('a[href*=".mp4"]')) as HTMLAnchorElement[];
        if (mediaLinks.length > 0) {
          videoUrl = mediaLinks[0].href;
        }
      }

      if (!videoUrl) {
        setMessage('⚠️ Chưa tìm thấy file video nào trong bài!');
        setLoading(false);
        return;
      }

      if (videoUrl.startsWith('/')) {
        videoUrl = window.location.origin + videoUrl;
      }

      // Sync mp4_url immediately
      const mp4Input = document.querySelector('input[name*="mp4_url"]') as HTMLInputElement;
      if (mp4Input) {
        setNativeInputValue(mp4Input, videoUrl);
      }

      // Fetch video as Blob to bypass CORS restriction on canvas
      setMessage('Đang nạp file video vào bộ nhớ...');
      let videoBlobUrl = videoUrl;
      try {
        const res = await fetch(videoUrl);
        if (res.ok) {
          const blob = await res.blob();
          videoBlobUrl = URL.createObjectURL(blob);
        }
      } catch (e) {
        console.warn('Direct fetch failed, using direct URL fallback:', e);
      }

      // Create video element and wait for seeked event at 0.5s
      setMessage('Đang trích xuất khung hình 0.5s...');
      const video = document.createElement('video');
      video.muted = true;
      video.playsInline = true;
      video.src = videoBlobUrl;

      await new Promise<void>((resolve, reject) => {
        video.onloadedmetadata = () => {
          video.currentTime = Math.min(0.5, (video.duration || 1) / 2);
        };
        video.onseeked = () => resolve();
        video.onerror = () => reject(new Error('Không thể load video'));
        setTimeout(() => resolve(), 7000); // 7s timeout fallback
      });

      // Render to canvas
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth || 1280;
      canvas.height = video.videoHeight || 720;
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('Không tạo được Canvas context');
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      // Convert canvas to JPEG Blob
      const blob = await new Promise<Blob>((resolve, reject) => {
        canvas.toBlob((b) => (b ? resolve(b) : reject(new Error('Không thể tạo file ảnh'))), 'image/jpeg', 0.85);
      });

      // Upload Poster JPEG to R2 via /api/upload
      setMessage('Đang upload Poster lên Cloudflare R2...');
      const formData = new FormData();
      const filename = `auto-poster-${Date.now()}.jpg`;
      formData.append('files', blob, filename);

      const uploadRes = await fetch('/api/upload', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem('jwtToken') || localStorage.getItem('jwtToken') || ''}`,
        },
        body: formData,
      });

      if (!uploadRes.ok) {
        throw new Error(`Upload thất bại (HTTP ${uploadRes.status})`);
      }

      const uploadedFiles = await uploadRes.json();
      if (uploadedFiles && uploadedFiles[0]) {
        const fileObj = uploadedFiles[0];
        const posterUrl = fileObj.url.startsWith('http') ? fileObj.url : window.location.origin + fileObj.url;

        // Auto update poster_url input in DOM
        const posterInput = document.querySelector('input[name*="poster_url"]') as HTMLInputElement;
        if (posterInput) {
          setNativeInputValue(posterInput, posterUrl);
        }

        setMessage('✅ Đã cập nhật mp4_url & upload Poster lên R2 thành công!');
      }
    } catch (err: any) {
      console.error('Error generating auto poster:', err);
      setMessage(`❌ Lỗi: ${err.message || 'Không thể trích xuất poster'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box padding={3} background="neutral100" hasRadius borderColor="neutral200">
      <Flex direction="column" alignItems="flex-start" gap={2}>
        <Typography variant="pi" fontWeight="bold">
          ⚡️ Tự động đồng bộ R2 Video URL & tạo Poster
        </Typography>
        <Button onClick={handleGeneratePoster} loading={loading} variant="secondary" size="S">
          📸 Đồng bộ MP4 URL & Upload Poster lên R2
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
