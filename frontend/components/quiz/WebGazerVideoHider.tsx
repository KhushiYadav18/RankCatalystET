"use client";

import { useEffect } from "react";

/**
 * Component to style WebGazer video elements - make them small
 */
export default function WebGazerVideoHider() {
  useEffect(() => {
    const styleVideos = () => {
      // Style all video elements that WebGazer might create
      const videos = document.querySelectorAll('video');
      videos.forEach((video: HTMLVideoElement) => {
        const style = window.getComputedStyle(video);
        if (
          style.position === 'fixed' || 
          style.position === 'absolute' ||
          video.id?.includes('webgazer') ||
          video.className?.includes('webgazer')
        ) {
          // Make video small and positioned
          video.style.position = 'fixed';
          video.style.top = '80px';
          video.style.left = '20px';
          video.style.width = '120px';
          video.style.height = '90px';
          video.style.zIndex = '1000';
          video.style.border = '2px solid #0ea5e9';
          video.style.borderRadius = '8px';
          video.style.opacity = '0.8';
          video.style.pointerEvents = 'none';
          video.style.objectFit = 'cover';
        }
      });

      // Hide WebGazer canvas/debug overlays
      const canvases = document.querySelectorAll('canvas');
      canvases.forEach((canvas: HTMLCanvasElement) => {
        if (canvas.id?.includes('webgazer') || canvas.className?.includes('webgazer')) {
          // Only hide debug canvases, not the video
          if (canvas.style.position === 'fixed') {
            canvas.style.display = 'none';
          }
        }
      });
    };

    // Run immediately and then periodically
    styleVideos();
    const interval = setInterval(styleVideos, 500);

    return () => clearInterval(interval);
  }, []);

  return null; // This component doesn't render anything
}

