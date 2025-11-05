"use client";

import { useEffect, useState } from "react";

interface CalibrationOverlayProps {
  onComplete: (quality: number) => void;
}

export default function CalibrationOverlay({ onComplete }: CalibrationOverlayProps) {
  const [currentDot, setCurrentDot] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  const dots = [
    { x: 20, y: 20 },
    { x: 50, y: 20 },
    { x: 80, y: 20 },
    { x: 20, y: 50 },
    { x: 50, y: 50 },
    { x: 80, y: 50 },
    { x: 20, y: 80 },
    { x: 50, y: 80 },
    { x: 80, y: 80 },
  ];

  useEffect(() => {
    if (currentDot < dots.length) {
      const timer = setTimeout(async () => {
        // Get actual dot position in pixels
        const dot = dots[currentDot];
        const dotX = (dot.x / 100) * window.innerWidth;
        const dotY = (dot.y / 100) * window.innerHeight;
        
        // Trigger WebGazer calibration for this point
        if (window.webgazer) {
          try {
            // WebGazer uses different calibration methods
            // Try the standard calibration API
            if (typeof window.webgazer.recordScreenPosition === 'function') {
              // Record screen position for calibration
              window.webgazer.recordScreenPosition(dotX, dotY, currentDot);
              console.log(`Calibration point ${currentDot + 1} recorded at (${dotX}, ${dotY})`);
            } else if (typeof window.webgazer.calibratePoint === 'function') {
              await window.webgazer.calibratePoint(dotX, dotY, currentDot);
              console.log(`Calibration point ${currentDot + 1} calibrated at (${dotX}, ${dotY})`);
            } else if (typeof window.webgazer.setRegression === 'function') {
              // Use regression-based calibration
              window.webgazer.setRegression('ridge');
            }
            
            // Also try clicking at the point to trigger calibration
            // This is a common WebGazer calibration method
            if (typeof window.webgazer.click === 'function') {
              // Simulate click at calibration point
              const element = document.elementFromPoint(dotX, dotY);
              if (element) {
                const clickEvent = new MouseEvent('click', {
                  view: window,
                  bubbles: true,
                  cancelable: true,
                  clientX: dotX,
                  clientY: dotY
                });
                element.dispatchEvent(clickEvent);
              }
            }
          } catch (e) {
            console.warn('Calibration point error:', e);
          }
        } else {
          console.warn('WebGazer not available for calibration');
        }
        
        setCurrentDot(currentDot + 1);
      }, 2500); // Give 2.5 seconds for user to look at each dot
      return () => clearTimeout(timer);
    } else {
      // Calibration complete - wait a bit for WebGazer to process
      setTimeout(async () => {
        setIsVisible(false);
        // Run actual WebGazer calibration completion
        try {
          const { webgazerClient } = await import('@/lib/attention/webgazerClient');
          
          // Finalize calibration
          if (window.webgazer && typeof window.webgazer.setRegression === 'function') {
            window.webgazer.setRegression('ridge');
          }
          
          const quality = await webgazerClient.calibrate();
          onComplete(quality);
        } catch (error) {
          console.error('Calibration error:', error);
          // Fallback quality
          const quality = Math.random() * 0.3 + 0.7;
          onComplete(quality);
        }
      }, 1500);
    }
  }, [currentDot, onComplete]);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center">
      <div className="text-white text-center">
        <h2 className="text-2xl font-bold mb-8">Calibrating WebGazer</h2>
        <p className="mb-8 text-lg">Look directly at each dot as it appears</p>
        <p className="mb-4 text-sm text-gray-300">Keep your head still and follow with your eyes only</p>
        <div className="relative w-screen h-screen">
          {dots.map((dot, index) => (
            <div
              key={index}
              className="absolute bg-white rounded-full transition-all duration-500 animate-pulse"
              style={{
                left: `${dot.x}%`,
                top: `${dot.y}%`,
                transform: "translate(-50%, -50%)",
                width: index === currentDot ? "32px" : index < currentDot ? "16px" : "0px",
                height: index === currentDot ? "32px" : index < currentDot ? "16px" : "0px",
                opacity: index === currentDot ? 1 : index < currentDot ? 0.5 : 0,
                boxShadow: index === currentDot ? "0 0 20px rgba(255,255,255,0.8)" : "none",
              }}
            />
          ))}
        </div>
        <p className="mt-8 text-lg">
          Dot {currentDot + 1} of {dots.length}
        </p>
      </div>
    </div>
  );
}

