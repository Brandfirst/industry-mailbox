
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

export const useGoogleAuth = (externalConnecting: boolean) => {
  const [isConnecting, setIsConnecting] = useState(false);
  
  // Clear any stale OAuth state on mount
  useEffect(() => {
    const oauthInProgress = sessionStorage.getItem('gmailOAuthInProgress');
    const startTime = sessionStorage.getItem('oauth_start_time');
    
    // If there's an oauth flow in progress but it's been over 2 minutes, clear it
    if (oauthInProgress === 'true' && startTime) {
      const timeElapsed = (Date.now() - parseInt(startTime)) / 1000;
      
      if (timeElapsed > 120) {  // 2 minutes
        console.log("[GOOGLE AUTH] Clearing stale OAuth state on mount", { timeElapsed });
        sessionStorage.removeItem('gmailOAuthInProgress');
        sessionStorage.removeItem('oauth_nonce');
        sessionStorage.removeItem('oauth_start_time');
      }
    }
    
    // Always sync the component state with the session storage
    setIsConnecting(externalConnecting || oauthInProgress === 'true');
  }, [externalConnecting]);
  
  // Update internal state when external state changes
  useEffect(() => {
    setIsConnecting(externalConnecting);
  }, [externalConnecting]);
  
  const generateNonce = () => {
    return Math.random().toString(36).substring(2, 15) + 
           Math.random().toString(36).substring(2, 15);
  };
  
  const initiateGoogleOAuth = useCallback(() => {
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    
    try {
      if (!clientId) {
        console.error("[GOOGLE AUTH] Missing VITE_GOOGLE_CLIENT_ID");
        toast.error("Configuration error: Missing Google Client ID");
        return;
      }
      
      // First check if there's already an OAuth flow in progress
      if (sessionStorage.getItem('gmailOAuthInProgress') === 'true') {
        const startTime = sessionStorage.getItem('oauth_start_time');
        if (startTime) {
          const timeElapsed = (Date.now() - parseInt(startTime)) / 1000;
          console.warn(`[GOOGLE AUTH] Attempting to start OAuth flow while one is already in progress (${timeElapsed.toFixed(1)}s)`);
          
          // If it's been less than 5 seconds, don't start a new flow
          if (timeElapsed < 5) {
            toast.error("OAuth flow already in progress. Please wait...");
            return;
          } else {
            // If it's been more than 5 seconds, clear it and start a new one
            console.log("[GOOGLE AUTH] Clearing stale OAuth state before starting new flow");
            sessionStorage.removeItem('gmailOAuthInProgress');
            sessionStorage.removeItem('oauth_nonce');
            sessionStorage.removeItem('oauth_start_time');
          }
        }
      }
      
      // Generate and save a nonce for verification later
      const nonce = generateNonce();
      sessionStorage.setItem('oauth_nonce', nonce);
      
      // Save start time for timeout detection
      sessionStorage.setItem('oauth_start_time', Date.now().toString());
      
      // Mark OAuth as in progress
      sessionStorage.setItem('gmailOAuthInProgress', 'true');
      
      // Update state
      setIsConnecting(true);
      
      // Get the redirect URI from environment variables, falling back to window.origin + /admin
      const envRedirectUri = import.meta.env.VITE_REDIRECT_URI;
      const currentHost = window.location.origin;
      
      // Use environment variable if available, otherwise build it from current origin
      const redirectUri = envRedirectUri || `${currentHost}/admin`;
      
      console.log(`[GOOGLE AUTH] Using redirect URI: ${redirectUri}`);
      
      // Build Google OAuth URL
      // Do NOT use encodeURIComponent here as URLSearchParams will handle encoding
      const scope = 'https://www.googleapis.com/auth/gmail.readonly';
      const responseType = 'code';
      const accessType = 'offline';
      const prompt = 'consent';
      const state = 'gmail_connect'; // Used to identify the callback
      
      // Create a reusable set of params first
      const params = new URLSearchParams({
        client_id: clientId,
        redirect_uri: redirectUri,
        response_type: responseType,
        scope,
        access_type: accessType,
        prompt,
        state,
        nonce
      });
      
      // Log debugging information
      console.log('[GOOGLE AUTH] OAuth configuration:', {
        clientId,
        redirectUri,
        envRedirectUri,
        currentHost,
        scope,
        timestamp: new Date().toISOString()
      });
      
      // Set a brief timeout before redirecting to ensure UI updates
      setTimeout(() => {
        // Before redirect, verify that we're in connecting state
        if (sessionStorage.getItem('gmailOAuthInProgress') !== 'true') {
          console.warn('[GOOGLE AUTH] OAuth state was cleared before redirect, aborting');
          return;
        }
        
        // Redirect to Google OAuth
        const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
        console.log('[GOOGLE AUTH] Redirecting to Google OAuth:', googleAuthUrl);
        
        // This is sometimes blocked by popup blockers, so wrap in try/catch
        try {
          window.location.href = googleAuthUrl;
        } catch (redirectError) {
          console.error('[GOOGLE AUTH] Error during redirect:', redirectError);
          toast.error('Browser blocked the redirect. Please try again and allow popups.');
          
          // Clean up OAuth state
          sessionStorage.removeItem('gmailOAuthInProgress');
          sessionStorage.removeItem('oauth_nonce');
          sessionStorage.removeItem('oauth_start_time');
          
          setIsConnecting(false);
        }
      }, 100);
      
    } catch (error) {
      console.error('[GOOGLE AUTH] Error initiating OAuth:', error);
      toast.error('Failed to start Google authentication');
      
      // Clean up OAuth state
      sessionStorage.removeItem('gmailOAuthInProgress');
      sessionStorage.removeItem('oauth_nonce');
      sessionStorage.removeItem('oauth_start_time');
      
      setIsConnecting(false);
    }
  }, []);
  
  return { isConnecting, initiateGoogleOAuth };
};
