
import { useState, useEffect } from "react";

interface DynamicCounterProps { 
  startValue: number;
  incrementAmount: number;
  intervalMs?: number;
  prefix?: string; 
  suffix?: string; 
}

const DynamicCounter = ({ 
  startValue, 
  incrementAmount,
  intervalMs = 1000,
  prefix = "", 
  suffix = "" 
}: DynamicCounterProps) => {
  const [count, setCount] = useState(startValue);
  
  useEffect(() => {
    const timer = setInterval(() => {
      setCount(prevCount => prevCount + incrementAmount);
    }, intervalMs);
    
    return () => clearInterval(timer);
  }, [incrementAmount, intervalMs]);

  return (
    <span className="text-[#FF5722] font-bold">
      {prefix}{count.toLocaleString()}{suffix}
    </span>
  );
};

export default DynamicCounter;
