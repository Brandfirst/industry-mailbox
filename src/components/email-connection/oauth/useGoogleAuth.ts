
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/auth";
import { v4 as uuidv4 } from "@supabase/supabase-js/dist/module/lib/helpers";

export const useGoogleAuth = (isParentConnecting: boolean) => {
  const [isConnecting, setIsConnecting] = useState(false);
  const { user } = useAuth();
  const location = useLocation();
  
  // Clear any stale OAuth state on mount
  useEffect(() => {
    // Check if there's an OAuth flow in progress but it's been too long
    const oauthInProgress = sessionStorage.getItem('gmailOAuthInProgress') === 'true';
    const startTime = sessionStorage.getItem('oauth_start_time');
    
    if (oauthInProgress && startTime) {
      const timeElapsed = (Date.now() - parseInt(startTime)) / 1000;
      
      // If it's been more than 5 minutes, clear the OAuth state
      if (timeElapsed > 300) {
        console.log(`[GOOGLE AUTH] Clearing stale OAuth state (${timeElapsed.toFixed(1)}s elapsed)`);
        sessionStorage.removeItem('gmailOAuthInProgress');
        sessionStorage.removeItem('oauth_nonce');
        sessionStorage.removeItem('oauth_start_time');
      }
    }
    
    // Log the initial state for debugging
    console.log("[OAUTH BUTTON MOUNT] GoogleOAuthButton mounted with state:", {
      isConnecting: isParentConnecting,
      localIsConnecting: isConnecting,
      user: !!user,
      userId: user?.id,
      redirectUri: import.meta.env.VITE_REDIRECT_URI || window.location.origin + "/admin",
      location: location.pathname + location.search,
      oauthInProgress: sessionStorage.getItem('gmailOAuthInProgress'),
      timestamp: new Date().toISOString()
    });
  }, [isParentConnecting, isConnecting, user, location]);
  
  // Update local state when parent state changes
  useEffect(() => {
    setIsConnecting(isParentConnecting);
  }, [isParentConnecting]);

  const initiateGoogleOAuth = () => {
    if (!user) {
      console.error("[GOOGLE AUTH] Cannot initiate Google OAuth without a logged in user");
      return;
    }
    
    try {
      const redirectUri = import.meta.env.VITE_REDIRECT_URI || window.location.origin + "/admin";
      const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
      
      if (!clientId) {
        console.error("[GOOGLE AUTH] Google Client ID not found in environment variables");
        return;
      }
      
      console.log("[GOOGLE AUTH] Initiating Google OAuth flow with:", { 
        redirectUri,
        userId: user.id,
        clientIdExists: !!clientId,
        timestamp: new Date().toISOString()
      });
      
      // Save the user ID in session storage in case the page refreshes
      sessionStorage.setItem('auth_user_id', user.id);
      
      // Generate a nonce for security
      const nonce = uuidv4();
      sessionStorage.setItem('oauth_nonce', nonce);
      
      // Flag that OAuth is in progress
      sessionStorage.setItem('gmailOAuthInProgress', 'true');
      
      // Record the start time of the OAuth flow
      sessionStorage.setItem('oauth_start_time', Date.now().toString());
      
      // Set connecting state
      setIsConnecting(true);

      // Set up OAuth parameters
      const googleAuthEndpoint = 'https://accounts.google.com/o/oauth2/v2/auth';
      const scope = encodeURIComponent('https://www.googleapis.com/auth/gmail.readonly https://www.googleapis.com/auth/gmail.modify');
      
      // Build the full authorization URL
      const authUrl = `${googleAuthEndpoint}?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&scope=${scope}&access_type=offline&prompt=consent&state=gmail_connect`;
      
      console.log("[GOOGLE AUTH] Redirecting to Google authorization URL");
      
      // Redirect to Google's authorization server
      window.location.href = authUrl;
    } catch (error) {
      console.error("[GOOGLE AUTH] Error initiating Google OAuth:", error);
      setIsConnecting(false);
      // Clear OAuth state
      sessionStorage.removeItem('gmailOAuthInProgress');
      sessionStorage.removeItem('oauth_nonce');
      sessionStorage.removeItem('oauth_start_time');
    }
  };

  return { isConnecting, initiateGoogleOAuth };
};
