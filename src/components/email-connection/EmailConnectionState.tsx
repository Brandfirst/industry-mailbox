
import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/contexts/auth";
import { getUserEmailAccounts } from "@/lib/supabase/emailAccounts";
import { EmailAccount } from "@/lib/supabase/types";
import { toast } from "sonner";

// Custom hook to manage email connection state
export const useEmailConnectionState = () => {
  const { user } = useAuth();
  const [emailAccounts, setEmailAccounts] = useState<EmailAccount[]>([]);
  const [status, setStatus] = useState<{ loading: boolean; error: string | null }>({ 
    loading: false, 
    error: null 
  });
  const [isConnecting, setIsConnecting] = useState(false);
  const [oauthError, setOAuthError] = useState<string | null>(null);
  const [errorDetails, setErrorDetails] = useState<any>(null);
  const [debugInfo, setDebugInfo] = useState<any>(null);
  const [connectionProcessed, setConnectionProcessed] = useState(false);
  const [recoveryAttempted, setRecoveryAttempted] = useState(false);
  const [lastAttemptTime, setLastAttemptTime] = useState<number | null>(null);

  // Check for page reload during OAuth flow
  useEffect(() => {
    const pageReloadHandler = () => {
      // If there's an OAuth flow in progress, save that info to survive page reload
      if (sessionStorage.getItem('gmailOAuthInProgress') === 'true') {
        sessionStorage.setItem('oauth_page_reloaded', 'true');
        console.log("EmailConnectionState: Page reload detected during OAuth flow");
      }
    };

    // Listen for beforeunload events to detect page reloads
    window.addEventListener('beforeunload', pageReloadHandler);
    
    // Check if we're recovering from a page reload
    const pageReloaded = sessionStorage.getItem('oauth_page_reloaded') === 'true';
    if (pageReloaded) {
      console.log("EmailConnectionState: Recovering from page reload during OAuth flow");
      sessionStorage.removeItem('oauth_page_reloaded');
      
      // Don't auto-clear the OAuth state since we're recovering
      setIsConnecting(true);
    }
    
    return () => {
      window.removeEventListener('beforeunload', pageReloadHandler);
    };
  }, []);

  // Log state changes for debugging
  useEffect(() => {
    console.log("EmailConnectionState: Auth state changed", {
      userId: user?.id,
      isConnecting,
      oauthError,
      connectionProcessed,
      recoveryAttempted,
      lastAttemptTime: lastAttemptTime ? new Date(lastAttemptTime).toISOString() : null,
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
  }, [user, isConnecting, oauthError, connectionProcessed, recoveryAttempted, lastAttemptTime]);

  // Fetch email accounts from the database
  const fetchEmailAccounts = useCallback(async () => {
    if (!user) {
      console.log("No user, can't fetch email accounts");
      setEmailAccounts([]);
      return;
    }

    setStatus({ loading: true, error: null });
    console.log(`Fetching email accounts for user ${user.id}`);

    try {
      // Use the imported function to get email accounts
      const data = await getUserEmailAccounts(user.id);

      console.log("Fetched email accounts:", data);
      setEmailAccounts(data || []);
      setStatus({ loading: false, error: null });
    } catch (err) {
      console.error("Exception fetching email accounts:", err);
      setStatus({ 
        loading: false, 
        error: err instanceof Error ? err.message : "Unknown error" 
      });
      setEmailAccounts([]);
    }
  }, [user]);

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
      
      if (oauthInProgress && !code && user) {
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
              setIsConnecting(false);
              toast.error("Unable to recover from interrupted OAuth flow. Please try again.");
            }
          }, 2000);
        } else {
          // Clear OAuth state if it's been too long
          console.log("EmailConnectionState: Clearing stale OAuth state");
          sessionStorage.removeItem('gmailOAuthInProgress');
          sessionStorage.removeItem('oauth_nonce');
          sessionStorage.removeItem('oauth_start_time');
          setIsConnecting(false);
          toast.error("OAuth flow timed out. Please try connecting again.");
        }
      }
    };
    
    // Run recovery logic when user changes or on mount
    if (user) {
      recoverFromInterruptedFlow();
    }
  }, [user, fetchEmailAccounts, recoveryAttempted]);

  // Function to initiate connection with rate limiting
  const initiateConnection = useCallback(() => {
    const now = Date.now();
    
    // Add rate limiting to prevent multiple rapid connection attempts
    if (lastAttemptTime && now - lastAttemptTime < 5000) { // 5 second cooldown
      console.log("EmailConnectionState: Rate limiting connection attempt");
      toast.error("Please wait a few seconds before trying again");
      return;
    }
    
    setLastAttemptTime(now);
    setIsConnecting(true);
  }, [lastAttemptTime]);

  return {
    emailAccounts,
    status,
    isConnecting,
    oauthError,
    errorDetails,
    debugInfo,
    connectionProcessed,
    fetchEmailAccounts,
    setIsConnecting,
    setOAuthError,
    setErrorDetails,
    setDebugInfo,
    setConnectionProcessed,
    initiateConnection
  };
};
