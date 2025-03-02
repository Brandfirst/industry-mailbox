
import { useState, useEffect, useRef, memo } from 'react';
import Spline from '@splinetool/react-spline';

const SplineCanvas = memo(() => {
  const [isVisible, setIsVisible] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const splineRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    // Simple visibility observer to only load Spline when in view
    if (!containerRef.current) return;
    
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    
    observer.observe(containerRef.current);
    
    return () => {
      if (observer) {
        observer.disconnect();
      }
    };
  }, []);

  // Function to handle when Spline is loaded
  const onLoad = (splineApp) => {
    splineRef.current = splineApp;
    setIsLoaded(true);
    
    // Optimize the scene once loaded
    if (splineApp) {
      // Reduce quality for better performance if method exists
      if (splineApp.setQuality) {
        splineApp.setQuality('low');
      }
      
      // Reduce shadow quality if method exists
      if (splineApp.setShadowQuality) {
        splineApp.setShadowQuality(0);
      }
      
      // Reduce render resolution if method exists
      if (splineApp.setRenderScale) {
        splineApp.setRenderScale(0.8);
      }
      
      // Disable post-processing if method exists
      if (splineApp.setPostProcessing) {
        splineApp.setPostProcessing(false);
      }
    }
  };

  return (
    <div 
      ref={containerRef}
      className="w-full h-full relative"
      style={{ 
        opacity: isLoaded ? 0.7 : 0, // Increased opacity from 0.3 to 0.7
        transition: 'opacity 0.5s ease-in-out'
      }}
    >
      {isVisible && (
        <Spline 
          scene="https://prod.spline.design/kiQGRbPlp9LUJc9j/scene.splinecode" 
          className="w-full h-full"
          onLoad={onLoad}
          style={{
            willChange: 'transform',
            pointerEvents: 'none', // Prevent interactions to improve performance
          }}
        />
      )}
    </div>
  );
});

SplineCanvas.displayName = 'SplineCanvas';

export default SplineCanvas;
