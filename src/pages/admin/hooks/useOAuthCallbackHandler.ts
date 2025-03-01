
import { useCallback, useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { toast } from 'sonner';

export function useOAuthCallbackHandler() {
  const [isOAuthCallback, setIsOAuthCallback] = useState(false);
  const location = useLocation();
  
  // Detect OAuth callback parameters in the URL and set appropriate state
  const checkForOAuthParams = useCallback(() => {
    const searchParams = new URLSearchParams(location.search);
    const code = searchParams.get('code');
    const state = searchParams.get('state');
    const error = searchParams.get('error');
    
    const hasOAuthParams = !!code || !!error;
    const isGmailCallback = state === 'gmail_connect';
    
    console.log("[ADMIN PAGE] Checking for OAuth params:", { 
      hasCode: !!code, 
      codeLength: code ? code.length : 0,
      state,
      hasError: !!error,
      error,
      isGmailCallback,
      pathname: location.pathname,
      search: location.search,
      timestamp: new Date().toISOString()
    });
    
    // Only set isOAuthCallback state to true if it's actually a Gmail OAuth callback
    setIsOAuthCallback(hasOAuthParams && isGmailCallback);
    
    if (hasOAuthParams) {
      // Log more details about the OAuth parameters
      console.log("[ADMIN PAGE] Detected OAuth parameters:", {
        hasCode: !!code,
        codeLength: code ? code.length : 0,
        state,
        hasError: !!error,
        error,
        search: location.search,
        oauthInProgress: sessionStorage.getItem('gmailOAuthInProgress'),
        savedUserId: sessionStorage.getItem('auth_user_id'),
        timestamp: new Date().toISOString()
      });
      
      // If there's an error in the URL, show it to the user
      if (error) {
        toast.error(`OAuth error: ${error}`);
      }
    }
    
    // Handle OAuth flow interruption (e.g., page refresh during flow)
    const oauthInProgress = sessionStorage.getItem('gmailOAuthInProgress');
    const startTime = sessionStorage.getItem('oauth_start_time');
    const timeElapsed = startTime ? `${((Date.now() - parseInt(startTime)) / 1000).toFixed(1)}s` : 'unknown';
    
    // Only clear OAuth state if we're not in the middle of a callback
    if (oauthInProgress === 'true' && !location.search.includes('code=') && !location.search.includes('error=')) {
      console.log('[ADMIN PAGE] Detected refresh during OAuth flow, resetting state', { timeElapsed });
      
      // Only show toast if it's been more than 5 seconds since OAuth start
      if (!startTime || Date.now() - parseInt(startTime) > 5000) {
        toast.error("OAuth flow interrupted. Please try connecting again.");
      }
      
      sessionStorage.removeItem('gmailOAuthInProgress');
      sessionStorage.removeItem('oauth_nonce');
      sessionStorage.removeItem('oauth_start_time');
    }
    
    return hasOAuthParams && isGmailCallback;
  }, [location.search]);
  
  useEffect(() => {
    checkForOAuthParams();
  }, [checkForOAuthParams]);

  return { isOAuthCallback, checkForOAuthParams };
}
