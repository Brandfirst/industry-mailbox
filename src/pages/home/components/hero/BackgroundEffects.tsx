import { useState, useEffect, useRef, memo } from 'react';
import SplineCanvas from '../SplineCanvas';
import { useIsMobile } from '@/hooks/use-mobile';
const BackgroundEffects = memo(() => {
  const [mousePosition, setMousePosition] = useState({
    x: 0,
    y: 0
  });
  const mouseMoveThrottleRef = useRef(null);
  const isMobile = useIsMobile();
  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      // Throttle mouse movement updates for better performance
      if (!mouseMoveThrottleRef.current) {
        mouseMoveThrottleRef.current = setTimeout(() => {
          // Calculate mouse position as normalized values between -1 and 1
          const x = event.clientX / window.innerWidth * 2 - 1;
          const y = event.clientY / window.innerHeight * 2 - 1;
          setMousePosition({
            x,
            y
          });
          mouseMoveThrottleRef.current = null;
        }, 50); // Throttle to 50ms
      }
    };

    // Use both mousemove and pointermove for better cross-device support
    window.addEventListener('mousemove', handleMouseMove, {
      passive: true
    });
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (mouseMoveThrottleRef.current) {
        clearTimeout(mouseMoveThrottleRef.current);
      }
    };
  }, []);
  return <>
      <div className="absolute inset-0 z-0 w-full h-[120%] bg-black" style={{
      transform: isMobile ? 'translateY(-20%)' : 'none'
    }}>
        {/* Spline implementation with full visibility */}
        <div className="absolute inset-0">
          <SplineCanvas />
        </div>
        
        {/* Very light gradient overlay to maintain some content visibility */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/5 to-black/20"></div>
      </div>
      
      <div className="absolute inset-0 z-0 opacity-10">
        <div className="absolute inset-0 grid grid-cols-12 grid-rows-6">
          {Array(72).fill(null).map((_, i) => <div key={i} className="border-t border-l border-[#FF5722]/20 py-0"></div>)}
        </div>
      </div>
      
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black to-transparent z-10"></div>
      
      {/* Use transform for better performance instead of positioning */}
      <div className="absolute -bottom-20 left-1/2 w-1/2 h-40 bg-[#FF5722]/10 rounded-full blur-3xl cursor-follow" style={{
      transform: `translate(calc(-50% + ${mousePosition.x * 40}px), ${mousePosition.y * 20}px)`,
      transition: 'transform 0.2s ease-out'
    }} />
      <div className="absolute -top-20 right-0 w-40 h-40 bg-[#FF5722]/5 rounded-full blur-3xl cursor-follow" style={{
      transform: `translate(${mousePosition.x * -30}px, ${mousePosition.y * 30}px)`,
      transition: 'transform 0.2s ease-out'
    }} />

      <div className="absolute top-1/3 left-1/4 w-32 h-32 bg-blue-500/5 rounded-full blur-3xl cursor-follow" style={{
      transform: `translate(${mousePosition.x * 25}px, ${mousePosition.y * -25}px)`,
      transition: 'transform 0.15s ease-out'
    }} />
      <div className="absolute top-1/2 right-1/4 w-24 h-24 bg-purple-500/5 rounded-full blur-3xl cursor-follow" style={{
      transform: `translate(${mousePosition.x * -20}px, ${mousePosition.y * 15}px)`,
      transition: 'transform 0.25s ease-out'
    }} />
    </>;
});
BackgroundEffects.displayName = 'BackgroundEffects';
export default BackgroundEffects;