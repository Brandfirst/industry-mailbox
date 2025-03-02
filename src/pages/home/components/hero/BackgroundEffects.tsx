
import { useState, useEffect, useRef } from 'react';
import Spline from '@splinetool/react-spline';

const BackgroundEffects = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const splineRef = useRef(null);

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      // Calculate mouse position as normalized values between -1 and 1
      const x = (event.clientX / window.innerWidth) * 2 - 1;
      const y = (event.clientY / window.innerHeight) * 2 - 1;
      setMousePosition({ x, y });
      
      // If we have access to Spline's API, we could send the mouse position
      if (splineRef.current) {
        const splineApp = splineRef.current;
        // This will work if the Spline scene has been set up to receive these events
        if (splineApp.emitEvent) {
          splineApp.emitEvent('mouseMove', { x, y });
        }
      }
    };

    // Use both mousemove and pointermove for better cross-device support
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('pointermove', handleMouseMove);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('pointermove', handleMouseMove);
    };
  }, []);

  // Function to handle when Spline is loaded
  const onLoad = (splineApp) => {
    splineRef.current = splineApp;
    console.log("Spline scene loaded");
  };

  return (
    <>
      <div className="absolute inset-0 z-0 w-full h-full">
        <Spline 
          scene="https://prod.spline.design/kiQGRbPlp9LUJc9j/scene.splinecode" 
          className="w-full h-full"
          onLoad={onLoad}
        />
      </div>
      
      <div className="absolute inset-0 z-0 opacity-10">
        <div className="absolute inset-0 grid grid-cols-12 grid-rows-6">
          {Array(72).fill(null).map((_, i) => (
            <div key={i} className="border-t border-l border-[#FF5722]/20"></div>
          ))}
        </div>
      </div>
      
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black to-transparent z-10"></div>
      
      <div 
        className="absolute -bottom-20 left-1/2 w-1/2 h-40 bg-[#FF5722]/10 rounded-full blur-3xl cursor-follow"
        style={{
          transform: `translate(calc(-50% + ${mousePosition.x * 40}px), ${mousePosition.y * 20}px)`,
          transition: 'transform 0.2s ease-out'
        }}
      />
      <div 
        className="absolute -top-20 right-0 w-40 h-40 bg-[#FF5722]/5 rounded-full blur-3xl cursor-follow"
        style={{
          transform: `translate(${mousePosition.x * -30}px, ${mousePosition.y * 30}px)`,
          transition: 'transform 0.2s ease-out'
        }}
      />

      <div 
        className="absolute top-1/3 left-1/4 w-32 h-32 bg-blue-500/5 rounded-full blur-3xl cursor-follow"
        style={{
          transform: `translate(${mousePosition.x * 25}px, ${mousePosition.y * -25}px)`,
          transition: 'transform 0.15s ease-out'
        }}
      />
      <div 
        className="absolute top-1/2 right-1/4 w-24 h-24 bg-purple-500/5 rounded-full blur-3xl cursor-follow"
        style={{
          transform: `translate(${mousePosition.x * -20}px, ${mousePosition.y * 15}px)`,
          transition: 'transform 0.25s ease-out'
        }}
      />
    </>
  );
};

export default BackgroundEffects;
