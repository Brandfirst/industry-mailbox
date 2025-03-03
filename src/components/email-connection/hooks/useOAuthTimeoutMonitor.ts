
import { useEffect } from "react";
import { toast } from "sonner";

export const useOAuthTimeoutMonitor = (
  user: any, 
  isConnecting: boolean, 
  setIsConnecting: (value: boolean) => void
) => {
  // Monitor OAuth flow for timeout
  useEffect(() => {
    console.log("EmailConnectionState: Auth state changed", {
      userId: user?.id,
      isConnecting,
      timestamp: new Date().toISOString()
    });
    
    // Check for interrupted OAuth flow on mount
    const oauthInProgress = sessionStorage.getItem('gmailOAuthInProgress');
    if (oauthInProgress === 'true' && !window.location.search.includes('code=')) {
      console.log("EmailConnectionState: Detected interrupted OAuth flow");
      
      // Check how long the OAuth flow has been in progress
      const startTime = sessionStorage.getItem('oauth_start_time');
      if (startTime) {
        const timeElapsed = (Date.now() - parseInt(startTime)) / 1000;
        console.log(`EmailConnectionState: OAuth flow has been in progress for ${timeElapsed.toFixed(1)} seconds`);
        
        // Only reset if it's been more than 15 seconds (allows for page transitions)
        if (timeElapsed > 15) {
          console.log("EmailConnectionState: Clearing stale OAuth state after timeout");
          sessionStorage.removeItem('gmailOAuthInProgress');
          sessionStorage.removeItem('oauth_nonce');
          sessionStorage.removeItem('oauth_start_time');
          setIsConnecting(false);
          
          // Show a toast to inform the user
          toast.error("OAuth flow timed out. Please try connecting again.");
        }
      } else {
        // If we have an OAuth in progress but no start time, something is wrong
        // Clear it to prevent getting stuck
        console.log("EmailConnectionState: Clearing invalid OAuth state (no start time)");
        sessionStorage.removeItem('gmailOAuthInProgress');
        sessionStorage.removeItem('oauth_nonce');
      }
    }
  }, [user, isConnecting, setIsConnecting]);
};
