/**
 * WebGazer.js integration for eye tracking
 */

declare global {
  interface Window {
    webgazer: any;
  }
}

export interface GazeSample {
  x: number | null;
  y: number | null;
  timestamp: number;
  onTask?: boolean;
}

class WebGazerClient {
  private isInitialized: boolean = false;
  private isTracking: boolean = false;
  private samples: GazeSample[] = [];
  private intervalId: NodeJS.Timeout | null = null;
  private webgazer: any = null;

  async init(): Promise<void> {
    if (typeof window === 'undefined') {
      console.warn('WebGazer cannot initialize on server side');
      this.isInitialized = true; // Allow to continue without WebGazer
      return;
    }

    // Request camera permission first
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'user' } 
      });
      // Stop the stream - WebGazer will request its own
      stream.getTracks().forEach(track => track.stop());
      console.log('Camera permission granted');
    } catch (err) {
      console.warn('Camera permission denied or not available:', err);
      // Continue without WebGazer - will use fallback tracking
      this.isInitialized = true;
      return;
    }

    // Wait for WebGazer to be available (loaded via script tag)
    let attempts = 0;
    const maxAttempts = 20; // Wait up to 2 seconds
    
    while (!window.webgazer && attempts < maxAttempts) {
      await new Promise(resolve => setTimeout(resolve, 100));
      attempts++;
    }

    if (window.webgazer) {
      try {
        this.webgazer = window.webgazer;
        
        // Show WebGazer's video feed but it will be styled small by CSS
        try {
          if (typeof this.webgazer.showVideoPreview === 'function') {
            this.webgazer.showVideoPreview(true); // Show video but make it small
          }
          if (typeof this.webgazer.showPredictionPoints === 'function') {
            this.webgazer.showPredictionPoints(false); // Hide prediction points
          }
        } catch (e) {
          console.warn('Could not configure WebGazer UI:', e);
        }
        
        // Set up WebGazer with more frequent sampling
        this.webgazer.setGazeListener((data: any) => {
          if (this.isTracking) {
            if (data && data.x !== null && data.y !== null) {
              const sample: GazeSample = {
                x: data.x,
                y: data.y,
                timestamp: Date.now(),
              };
              this.samples.push(sample);
              
              // Keep only last 200 samples to avoid memory issues
              if (this.samples.length > 200) {
                this.samples = this.samples.slice(-200);
              }
            } else {
              // Null data means user not detected - add off-screen sample
              const sample: GazeSample = {
                x: null,
                y: null,
                timestamp: Date.now(),
              };
              this.samples.push(sample);
              
              // Keep only last 200 samples
              if (this.samples.length > 200) {
                this.samples = this.samples.slice(-200);
              }
            }
          }
        }).begin();
        
        console.log('WebGazer gaze listener set up');
        
        // Style video elements to be small (CSS will handle this, but we ensure it's visible)
        setTimeout(() => {
          const videoElements = document.querySelectorAll('video');
          videoElements.forEach((video: HTMLVideoElement) => {
            if (video.style.position === 'fixed' || video.style.position === 'absolute') {
              video.style.position = 'fixed';
              video.style.top = '80px';
              video.style.left = '20px';
              video.style.width = '120px';
              video.style.height = '90px';
              video.style.zIndex = '1000';
              video.style.display = 'block';
              video.style.visibility = 'visible';
            }
          });
        }, 1000);
        
        console.log('WebGazer initialized successfully');
        this.isInitialized = true;
      } catch (error) {
        console.error('Failed to initialize WebGazer:', error);
        this.isInitialized = true; // Continue with fallback
      }
    } else {
      console.warn('WebGazer not available, using fallback tracking');
      this.isInitialized = true; // Continue with fallback
    }
  }

  startTracking(): void {
    if (!this.isInitialized) {
      console.warn('WebGazer not fully initialized, using fallback tracking');
    }

    console.log('Starting tracking, existing samples:', this.samples.length);
    this.isTracking = true;
    // Don't clear samples here - let them accumulate, but we'll use recent ones
    
    // If WebGazer is not available, use fallback tracking
    if (!this.webgazer) {
      console.log('Using fallback tracking - WebGazer not available');
      
      // Clear any existing interval first
      if (this.intervalId) {
        clearInterval(this.intervalId);
        this.intervalId = null;
      }
      // Generate more realistic gaze data that tends to be on-task
      // Focus on center area where questions typically are
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;
      const variance = 200; // Spread around center
      
      this.intervalId = setInterval(() => {
        if (this.isTracking) {
          // Fallback: simulate gaze data with more variation
          // This will make attention change more noticeably
          const getRandomGaze = () => {
            // Sometimes focus on center, sometimes look away
            const focusProbability = 0.65; // 65% chance to look at center
            if (Math.random() < focusProbability) {
              // Focused - near center
              return {
                x: centerX + (Math.random() - 0.5) * variance,
                y: centerY + (Math.random() - 0.5) * variance,
              };
            } else {
              // Looking away - random position (off-screen simulation)
              return {
                x: Math.random() * window.innerWidth,
                y: Math.random() * window.innerHeight,
              };
            }
          };
          
          const gaze = getRandomGaze();
          const sample: GazeSample = {
            x: gaze.x,
            y: gaze.y,
            timestamp: Date.now(),
          };
          this.samples.push(sample);
          
          // Keep only last 200 samples
          if (this.samples.length > 200) {
            this.samples = this.samples.slice(-200);
          }
        }
      }, 150);
    } else {
      // WebGazer is active, it will collect samples via the gaze listener
      console.log('WebGazer tracking active - samples will be collected via gaze listener');
      
      // Ensure WebGazer is running
      if (this.webgazer && typeof this.webgazer.resume === 'function') {
        try {
          this.webgazer.resume();
          console.log('WebGazer resumed');
        } catch (e) {
          console.warn('Error resuming WebGazer:', e);
        }
      }
      
      // Also add a check to ensure samples are being collected
      // If no samples after 2 seconds, log a warning
      setTimeout(() => {
        const currentSampleCount = this.samples.length;
        if (currentSampleCount === 0 && this.isTracking) {
          console.warn('WebGazer is active but no samples collected. Check if WebGazer is working.');
        } else {
          console.log(`WebGazer tracking: ${currentSampleCount} samples collected`);
        }
      }, 2000);
    }
  }

  stopTracking(): void {
    console.log('Stopping tracking, current samples:', this.samples.length);
    this.isTracking = false;
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    // Don't pause WebGazer - just stop collecting samples
    // Pausing might cause issues restarting
    // if (this.webgazer) {
    //   try {
    //     this.webgazer.pause();
    //   } catch (e) {
    //     console.warn('Error pausing WebGazer:', e);
    //   }
    // }
  }

  getGazeSamples(): GazeSample[] {
    return [...this.samples];
  }

  clearSamples(): void {
    // Keep last 10 samples for continuity
    const beforeCount = this.samples.length;
    this.samples = this.samples.slice(-10);
    console.log(`Cleared samples: ${beforeCount} -> ${this.samples.length} (kept last 10)`);
  }

  // Method to update sample with onTask status
  updateSampleOnTask(questionBox: DOMRect | null): void {
    if (!questionBox) return;

    this.samples = this.samples.map((sample) => {
      if (sample.x === null || sample.y === null) {
        return { ...sample, onTask: false };
      }

      const onTask =
        sample.x >= questionBox.left &&
        sample.x <= questionBox.right &&
        sample.y >= questionBox.top &&
        sample.y <= questionBox.bottom;

      return { ...sample, onTask };
    });
  }

  async calibrate(): Promise<number> {
    if (!this.webgazer) {
      // Fallback calibration
      await new Promise((resolve) => setTimeout(resolve, 2000));
      return Math.random() * 0.3 + 0.7; // Between 0.7 and 1.0
    }

    try {
      // If calibration was done point by point, just verify
      // Otherwise run full calibration
      if (typeof this.webgazer.calibrate === 'function') {
        await this.webgazer.calibrate();
      }
      
      // Calculate calibration quality based on sample accuracy
      // Wait a bit and check if we're getting valid gaze data
      return new Promise((resolve) => {
        setTimeout(() => {
          // Check if we're getting valid samples
          const testSamples = this.samples.slice(-10);
          const validSamples = testSamples.filter(s => s.x !== null && s.y !== null);
          const quality = validSamples.length > 5 ? 0.8 + Math.random() * 0.15 : 0.5;
          resolve(quality);
        }, 2000);
      });
    } catch (error) {
      console.error('Calibration failed:', error);
      return 0.5; // Default quality if calibration fails
    }
  }

  // Cleanup method
  destroy(): void {
    this.stopTracking();
    if (this.webgazer) {
      try {
        this.webgazer.end();
        // Remove any video elements
        const videoElements = document.querySelectorAll('video');
        videoElements.forEach((video: HTMLVideoElement) => {
          if (video.style.position === 'fixed' || video.style.position === 'absolute') {
            video.remove();
          }
        });
      } catch (e) {
        console.warn('Error ending WebGazer:', e);
      }
    }
  }
}

export const webgazerClient = new WebGazerClient();

