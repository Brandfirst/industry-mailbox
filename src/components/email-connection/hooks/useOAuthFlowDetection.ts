
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { toast } from "sonner";

export const useOAuthFlowDetection = (
  setIsConnecting: (isConnecting: boolean) => void,
  setConnectAttempted: (attempted: boolean) => void,
  setOAuthError: (error: string | null) => void
) => {
  const location = useLocation();
  
  // Check for interrupted OAuth flow on mount or when URL changes
  useEffect(() => {
    const oauthInProgress = sessionStorage.getItem('gmailOAuthInProgress') === 'true';
    const startTime = sessionStorage.getItem('oauth_start_time');
    const hasCallbackParams = location.search.includes('code=') || location.search.includes('error=');
    
    if (oauthInProgress && !hasCallbackParams) {
      const timeElapsed = startTime ? (Date.now() - parseInt(startTime)) / 1000 : 0;
      console.log(`[EMAIL CONNECTION] Detected OAuth in progress (${timeElapsed.toFixed(1)}s elapsed) but no callback parameters`);
      
      // If it's been more than 30 seconds, assume the flow was interrupted
      if (timeElapsed > 30) {
        console.warn("[EMAIL CONNECTION] OAuth flow appears to be interrupted, clearing state");
        toast.error("OAuth flow was interrupted. Please try connecting again.");
        
        // Clean up OAuth state
        sessionStorage.removeItem('gmailOAuthInProgress');
        sessionStorage.removeItem('oauth_nonce');
        sessionStorage.removeItem('oauth_start_time');
        
        setIsConnecting(false);
      }
    }
  }, [location.search, setIsConnecting]);
  
  // Check URL for OAuth callback parameters
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const code = searchParams.get('code');
    const state = searchParams.get('state');
    const error = searchParams.get('error');
    
    if (code && state === 'gmail_connect') {
      console.log("[EMAIL CONNECTION] Found OAuth callback in URL, connection in progress");
      setIsConnecting(true);
      setConnectAttempted(true);
      toast.loading("Processing Google authentication...");
    } else if (error) {
      console.error("[EMAIL CONNECTION] OAuth error found in URL:", error);
      setOAuthError(error);
      setConnectAttempted(true);
      toast.error(`Google authentication error: ${error}`);
    }
  }, [location.search, setIsConnecting, setOAuthError, setConnectAttempted]);
};
