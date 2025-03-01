
import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { useLocation } from "react-router-dom";

export function useGoogleAuth(isConnecting: boolean) {
  const { user, session } = useAuth();
  const location = useLocation();
  const [localIsConnecting, setLocalIsConnecting] = useState(false);
  const [debugInfo, setDebugInfo] = useState<any>(null);
  const timerRef = useRef<number | null>(null);
  
  // Use the redirect URI from environment variables or fall back to a default
  const redirectUri = import.meta.env.VITE_REDIRECT_URI || 
    window.location.origin + "/admin";

  // Reset error state when component mounts
  useEffect(() => {
    // Clean up any stale OAuth state on component mount
    if (!isConnecting && !localIsConnecting) {
      const oauthInProgress = sessionStorage.getItem('gmailOAuthInProgress');
      if (oauthInProgress === 'true' && !window.location.search.includes('code=')) {
        console.log("Found stale OAuth state, clearing");
        sessionStorage.removeItem('gmailOAuthInProgress');
        sessionStorage.removeItem('oauth_nonce');
      }
    }
    
    console.log("[OAUTH BUTTON MOUNT] GoogleOAuthButton mounted with state:", { 
      isConnecting, 
      localIsConnecting, 
      user: !!user,
      userId: user?.id,
      redirectUri,
      location: location.pathname + location.search,
      oauthInProgress: sessionStorage.getItem('gmailOAuthInProgress'),
      timestamp: new Date().toISOString()
    });

    // Set a timeout to clear any hanging OAuth state
    timerRef.current = window.setTimeout(() => {
      const oauthInProgress = sessionStorage.getItem('gmailOAuthInProgress');
      if (oauthInProgress === 'true') {
        const startTime = sessionStorage.getItem('oauth_start_time');
        const timeElapsed = startTime ? (Date.now() - parseInt(startTime)) / 1000 : 0;
        
        if (timeElapsed > 300) { // 5 minutes timeout
          console.log(`[OAUTH CLEANUP] Clearing stale OAuth state after ${timeElapsed.toFixed(0)} seconds`);
          sessionStorage.removeItem('gmailOAuthInProgress');
          sessionStorage.removeItem('oauth_nonce');
          sessionStorage.removeItem('oauth_start_time');
        }
      }
    }, 10000); // Check after 10 seconds

    return () => {
      if (timerRef.current) {
        window.clearTimeout(timerRef.current);
      }
    };
  }, [isConnecting, localIsConnecting, user, redirectUri, location]);

  const initiateGoogleOAuth = () => {
    // Use the prop value if passed, otherwise use local state
    const connecting = isConnecting || localIsConnecting;
    if (connecting || !user) {
      console.log("[OAUTH INITIATE BLOCKED] OAuth initiation blocked:", { 
        connecting,
        isConnecting,
        localIsConnecting,
        userExists: !!user,
        timestamp: new Date().toISOString()
      });
      return; // Prevent multiple clicks or if user not logged in
    }
    
    console.log("[OAUTH START] Starting Google OAuth flow for user:", user.id);
    setLocalIsConnecting(true);
    
    try {
      // Get the OAuth client ID from environment variables
      const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
      if (!clientId) {
        console.error("[OAUTH ERROR] Missing VITE_GOOGLE_CLIENT_ID environment variable");
        setDebugInfo({ error: "Missing VITE_GOOGLE_CLIENT_ID" });
        toast.error("Google client ID not configured properly. Check the console for more details.");
        setLocalIsConnecting(false);
        return;
      }
      
      // Generate and store a nonce for state validation
      const nonce = Math.random().toString(36).substring(2, 15);
      console.log(`[OAUTH] Generated nonce: ${nonce}`);
      sessionStorage.setItem('oauth_nonce', nonce);
      
      // Save a flag in sessionStorage to detect if we're in the middle of an OAuth flow
      sessionStorage.setItem('gmailOAuthInProgress', 'true');
      
      // Record the start time of the OAuth flow
      sessionStorage.setItem('oauth_start_time', Date.now().toString());
      
      // Store current auth state and user ID to help with recovery after OAuth flow
      if (session) {
        try {
          sessionStorage.setItem('auth_session_token', session.access_token);
          sessionStorage.setItem('auth_user_id', user.id);
          console.log("[OAUTH] Stored auth session in sessionStorage");
        } catch (e) {
          console.warn("[OAUTH] Could not save auth session to sessionStorage:", e);
        }
      }
      
      // Store the current path to return to after auth
      sessionStorage.setItem('auth_return_path', location.pathname);
      
      console.log("[OAUTH] Using redirect URI for OAuth flow:", redirectUri);
      
      // Properly construct the Google OAuth URL
      const authUrl = new URL("https://accounts.google.com/o/oauth2/v2/auth");
      authUrl.searchParams.append("client_id", clientId);
      authUrl.searchParams.append("redirect_uri", redirectUri);
      authUrl.searchParams.append("scope", "https://www.googleapis.com/auth/gmail.readonly");
      authUrl.searchParams.append("response_type", "code");
      authUrl.searchParams.append("access_type", "offline");
      authUrl.searchParams.append("prompt", "consent");
      authUrl.searchParams.append("state", "gmail_connect");
      
      // Log the full URL
      console.log("[OAUTH REDIRECT] Full Google OAuth URL:", authUrl.toString());
      
      // Redirect to Google OAuth consent screen
      console.log("[OAUTH REDIRECT] Redirecting to Google OAuth URL");
      toast.info("Redirecting to Google for authorization...");
      
      // Add slight delay to ensure logs are sent
      setTimeout(() => {
        window.location.href = authUrl.toString();
      }, 200);
    } catch (error) {
      console.error("[OAUTH ERROR] Error initiating OAuth flow:", error);
      setDebugInfo({ error: String(error) });
      toast.error("Failed to start Google authentication");
      setLocalIsConnecting(false);
      sessionStorage.removeItem('gmailOAuthInProgress');
      sessionStorage.removeItem('oauth_nonce');
      sessionStorage.removeItem('oauth_start_time');
    }
  };

  return {
    isConnecting: isConnecting || localIsConnecting,
    initiateGoogleOAuth,
    debugInfo
  };
}
