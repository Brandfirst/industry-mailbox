
import { memo, useEffect, useState } from 'react';
import SplineCanvas from './SplineCanvas';
import { useIsMobile } from '@/hooks/use-mobile';

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
  opacity = 0.5,
  zIndex = -1,
  className = '',
}: SplineBackgroundProps) => {
  const isMobile = useIsMobile();
  
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
      className={`absolute inset-0 w-full h-[150%] overflow-hidden spline-background ${getPositionStyle()} ${className}`}
      style={{ 
        opacity, 
        zIndex,
        // Applying a transform to move the Spline up on mobile
        transform: isMobile ? 'translateY(-15%)' : 'none'
      }}
    >
      {/* Lightweight gradient background as fallback */}
      <div className="absolute inset-0 bg-gradient-to-b from-blue-950/20 via-black to-black"></div>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-900/10 via-transparent to-transparent opacity-70"></div>
      
      {/* SplineCanvas with full opacity */}
      <div className="absolute inset-0">
        <SplineCanvas />
      </div>
      
      {/* Add gradient overlay at the bottom for better content visibility */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black to-transparent z-10"></div>
    </div>
  );
});

SplineBackground.displayName = 'SplineBackground';

export default SplineBackground;
