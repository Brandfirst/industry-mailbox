
import { useCallback, useState } from "react";
import { toast } from "sonner";

export const useRateLimitedConnection = () => {
  const [lastAttemptTime, setLastAttemptTime] = useState<number | null>(null);
  
  // Function to initiate connection with rate limiting
  const initiateConnection = useCallback(() => {
    const now = Date.now();
    
    // Add rate limiting to prevent multiple rapid connection attempts
    if (lastAttemptTime && now - lastAttemptTime < 5000) { // 5 second cooldown
      console.log("EmailConnectionState: Rate limiting connection attempt");
      toast.error("Please wait a few seconds before trying again");
      return false;
    }
    
    setLastAttemptTime(now);
    return true;
  }, [lastAttemptTime]);

  return { initiateConnection, lastAttemptTime };
};
