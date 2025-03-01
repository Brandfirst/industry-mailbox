
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/auth";
import { toast } from "sonner";

// Simple helper to generate a UUID for nonce
const generateUUID = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};

export const useGoogleAuth = (externalIsConnecting: boolean) => {
  const [localIsConnecting, setLocalIsConnecting] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();
  const isConnecting = externalIsConnecting || localIsConnecting;
  
  // Get the redirect URI from environment variables or construct it
  const redirectUri = import.meta.env.VITE_REDIRECT_URI || 
    window.location.origin + "/admin";
    
  // Log when the component mounts to help track state
  useEffect(() => {
    console.log("[OAUTH BUTTON MOUNT] GoogleOAuthButton mounted with state:", {
      isConnecting,
      localIsConnecting,
      user: !!user,
      userId: user?.id,
      redirectUri,
      timestamp: new Date().toISOString()
    });
  }, [user, isConnecting, localIsConnecting, redirectUri]);
  
  // Generate Google OAuth URL and initiate the flow
  const initiateGoogleOAuth = () => {
    if (isConnecting) {
      console.log("[GOOGLE AUTH] Already connecting, ignoring click");
      return;
    }
    
    if (!user) {
      console.error("[GOOGLE AUTH] No user found, can't connect Gmail");
      toast.error("You must be logged in to connect Gmail");
      navigate("/auth");
      return;
    }
    
    console.log("[GOOGLE AUTH] Initiating Google OAuth flow");
    setLocalIsConnecting(true);
    
    // Generate a nonce to verify the OAuth response
    const nonce = generateUUID();
    // Store the nonce in session storage to verify later
    sessionStorage.setItem('oauth_nonce', nonce);
    // Store timestamp to detect stale OAuth attempts
    sessionStorage.setItem('oauth_start_time', Date.now().toString());
    // Flag that we're in the middle of an OAuth flow
    sessionStorage.setItem('gmailOAuthInProgress', 'true');
    // Store user ID in case we need it during callback
    sessionStorage.setItem('auth_user_id', user.id);
    
    // Get Google client ID from environment
    const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    
    if (!googleClientId) {
      console.error("[GOOGLE AUTH] Google client ID not found in environment");
      toast.error("Google client ID is not configured");
      setLocalIsConnecting(false);
      sessionStorage.removeItem('gmailOAuthInProgress');
      sessionStorage.removeItem('oauth_nonce');
      sessionStorage.removeItem('oauth_start_time');
      return;
    }
    
    // Construct the OAuth URL with all necessary parameters
    const scopes = encodeURIComponent("https://www.googleapis.com/auth/gmail.readonly");
    const state = "gmail_connect"; // Used to identify the auth flow on return
    
    const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${googleClientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&access_type=offline&prompt=consent&scope=${scopes}&state=${state}&nonce=${nonce}`;
    
    console.log("[GOOGLE AUTH] Redirecting to Google auth URL");
    console.log("[GOOGLE AUTH] Redirect URI:", redirectUri);
    
    // Redirect the user to the Google OAuth page
    window.location.href = googleAuthUrl;
  };

  return {
    isConnecting,
    initiateGoogleOAuth
  };
};
