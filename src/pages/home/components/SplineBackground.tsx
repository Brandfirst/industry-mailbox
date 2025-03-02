
import { useRef, memo } from 'react';
import Spline from '@splinetool/react-spline';

type SplineBackgroundProps = {
  position?: 'top' | 'center' | 'bottom';
  rotation?: number;
  scale?: number;
  opacity?: number;
  zIndex?: number;
  className?: string;
};

// Using memo to prevent unnecessary re-renders
const SplineBackground = memo(({
  position = 'center',
  rotation = 0,
  scale = 1,
  opacity = 0.5,
  zIndex = -1,
  className = '',
}: SplineBackgroundProps) => {
  const splineRef = useRef(null);

  // Function to handle when Spline is loaded
  const onLoad = (splineApp) => {
    splineRef.current = splineApp;
    console.log("Spline scene loaded");
    
    // Attempt to reduce quality for better performance
    if (splineApp && splineApp.setQuality) {
      splineApp.setQuality('low');
    }
  };

  // Calculate position style based on the position prop
  const getPositionStyle = () => {
    switch (position) {
      case 'top':
        return 'top-0 -mt-20';
      case 'bottom':
        return 'bottom-0 -mb-20';
      default:
        return '';
    }
  };

  return (
    <div 
      className={`absolute inset-0 w-full h-[150%] overflow-hidden ${getPositionStyle()} ${className}`}
      style={{ 
        opacity, 
        zIndex,
        transform: `rotate(${rotation}deg) scale(${scale})`,
        willChange: 'transform', // Improve GPU performance
      }}
    >
      <Spline 
        scene="https://prod.spline.design/kiQGRbPlp9LUJc9j/scene.splinecode" 
        className="w-full h-full"
        onLoad={onLoad}
      />
      
      {/* Add gradient overlay at the bottom for better content visibility */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black to-transparent z-10"></div>
    </div>
  );
});

SplineBackground.displayName = 'SplineBackground';

export default SplineBackground;
