
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

export const useOAuthRecovery = (
  userId: string | undefined, 
  fetchEmailAccounts: () => Promise<void>
) => {
  const [recoveryAttempted, setRecoveryAttempted] = useState(false);
  
  // Attempt to recover from an interrupted OAuth flow
  useEffect(() => {
    const recoverFromInterruptedFlow = async () => {
      // Only attempt recovery once
      if (recoveryAttempted) {
        return;
      }
      
      // Check if there's an OAuth flow in progress but no code in URL
      const oauthInProgress = sessionStorage.getItem('gmailOAuthInProgress') === 'true';
      const code = new URLSearchParams(window.location.search).get('code');
      
      if (oauthInProgress && !code && userId) {
        const startTime = sessionStorage.getItem('oauth_start_time');
        const timeElapsed = startTime ? (Date.now() - parseInt(startTime)) / 1000 : 0;
        
        console.log(`EmailConnectionState: Detected interrupted OAuth flow (${timeElapsed.toFixed(1)}s elapsed)`);
        setRecoveryAttempted(true);
        
        // Only try to recover if it's been a short time
        if (timeElapsed < 15) {
          console.log("EmailConnectionState: Attempting to recover from interrupted flow");
          
          // Fetch accounts in case the connection was successful but the callback was interrupted
          await fetchEmailAccounts();
          
          // If we still have no accounts after trying to recover, clear the OAuth state
          setTimeout(() => {
            const stillInProgress = sessionStorage.getItem('gmailOAuthInProgress') === 'true';
            if (stillInProgress) {
              console.log("EmailConnectionState: Recovery attempt completed, clearing OAuth state");
              sessionStorage.removeItem('gmailOAuthInProgress');
              sessionStorage.removeItem('oauth_nonce');
              sessionStorage.removeItem('oauth_start_time');
              toast.error("Unable to recover from interrupted OAuth flow. Please try again.");
            }
          }, 2000);
        } else {
          // Clear OAuth state if it's been too long
          console.log("EmailConnectionState: Clearing stale OAuth state");
          sessionStorage.removeItem('gmailOAuthInProgress');
          sessionStorage.removeItem('oauth_nonce');
          sessionStorage.removeItem('oauth_start_time');
          toast.error("OAuth flow timed out. Please try connecting again.");
        }
      }
    };
    
    // Run recovery logic when user changes or on mount
    if (userId) {
      recoverFromInterruptedFlow();
    }
  }, [userId, fetchEmailAccounts, recoveryAttempted]);
  
  return { recoveryAttempted };
};
