
import { useEffect } from "react";
import { useOAuthCallback } from "./oauth/useOAuthCallback";
import { OAuthCallbackHandlerProps } from "./oauth/types";
import { toast } from "sonner";

export const OAuthCallbackHandler = ({
  redirectUri,
  onSuccess,
  onError,
  setIsConnecting
}: OAuthCallbackHandlerProps) => {
  // Use the extracted hook to handle OAuth callback logic
  const { isProcessing } = useOAuthCallback(redirectUri, onSuccess, onError, setIsConnecting);

  // Add additional logging for debugging
  useEffect(() => {
    const hasCallbackParams = window.location.search.includes('code=') || window.location.search.includes('error=');
    const oauthInProgress = sessionStorage.getItem('gmailOAuthInProgress') === 'true';
    const startTime = sessionStorage.getItem('oauth_start_time');
    const timeElapsed = startTime ? (Date.now() - parseInt(startTime)) / 1000 : null;
    
    console.log("[OAUTH CALLBACK HANDLER] Mounted", {
      redirectUri,
      isProcessing,
      hasUrlParams: hasCallbackParams,
      oauthInProgress,
      timeElapsedSec: timeElapsed ? timeElapsed.toFixed(1) + 's' : 'unknown',
      path: window.location.pathname,
      search: window.location.search,
      timestamp: new Date().toISOString()
    });
    
    // This shows a toast only if we have URL parameters but aren't processing yet
    // It helps inform the user that we're about to process their authentication
    if (
      hasCallbackParams &&
      !isProcessing && 
      sessionStorage.getItem('toastShown') !== 'true'
    ) {
      console.log("[OAUTH CALLBACK HANDLER] Showing initial processing toast");
      toast.loading("Processing authentication...");
      sessionStorage.setItem('toastShown', 'true');
      
      // Clear the toast flag after a short delay
      setTimeout(() => {
        sessionStorage.removeItem('toastShown');
      }, 5000);
    }
    
    // Check for potentially interrupted OAuth flow (no callback params, but flow in progress)
    if (oauthInProgress && !hasCallbackParams && timeElapsed && timeElapsed > 10) {
      console.warn(`[OAUTH CALLBACK HANDLER] OAuth flow appears to be interrupted after ${timeElapsed.toFixed(1)}s`);
      
      // Only clear if it's been more than 10 seconds
      sessionStorage.removeItem('gmailOAuthInProgress');
      sessionStorage.removeItem('oauth_nonce');
      sessionStorage.removeItem('oauth_start_time');
    }
  }, [redirectUri, isProcessing]);

  return null; // This is a functional component with no UI
};
