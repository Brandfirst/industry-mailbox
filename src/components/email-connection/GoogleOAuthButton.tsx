
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { RefreshCw, PlusCircle } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { useLocation } from "react-router-dom";

interface GoogleOAuthButtonProps {
  isConnecting: boolean;
  buttonText?: string;
  variant?: "default" | "outline" | "secondary" | "ghost" | "link" | "destructive";
  className?: string;
}

export const GoogleOAuthButton = ({ 
  isConnecting, 
  buttonText = "Connect Gmail", 
  variant = "default",
  className = ""
}: GoogleOAuthButtonProps) => {
  const { user, session } = useAuth();
  const location = useLocation();
  const [localIsConnecting, setLocalIsConnecting] = useState(false);
  
  // Use the redirect URI from environment variables or fall back to a default
  const redirectUri = import.meta.env.VITE_REDIRECT_URI || 
    window.location.origin + "/admin";

  const initiateGoogleOAuth = () => {
    // Use the prop value if passed, otherwise use local state
    const connecting = isConnecting || localIsConnecting;
    if (connecting || !user) return; // Prevent multiple clicks
    
    console.log("Starting Google OAuth flow for user:", user.id);
    setLocalIsConnecting(true);
    
    // Get the OAuth client ID from environment variables
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    if (!clientId) {
      toast.error("Google client ID not configured. Please add VITE_GOOGLE_CLIENT_ID to your environment.");
      setLocalIsConnecting(false);
      return;
    }
    
    try {
      // Generate and store a nonce for state validation
      const nonce = Math.random().toString(36).substring(2, 15);
      sessionStorage.setItem('oauth_nonce', nonce);
      
      // Save a flag in sessionStorage to detect if we're in the middle of an OAuth flow
      sessionStorage.setItem('gmailOAuthInProgress', 'true');
      
      // Store current auth state and user ID to help with recovery after OAuth flow
      if (session) {
        try {
          sessionStorage.setItem('auth_session_token', session.access_token);
          sessionStorage.setItem('auth_user_id', user.id);
        } catch (e) {
          console.warn("Could not save auth session to sessionStorage:", e);
        }
      }
      
      // Store the current path to return to after auth
      sessionStorage.setItem('auth_return_path', location.pathname);
      
      console.log("Using redirect URI for OAuth flow:", redirectUri);
      
      // Properly construct the Google OAuth URL
      const authUrl = new URL("https://accounts.google.com/o/oauth2/v2/auth");
      authUrl.searchParams.append("client_id", clientId);
      authUrl.searchParams.append("redirect_uri", redirectUri);
      authUrl.searchParams.append("scope", "https://www.googleapis.com/auth/gmail.readonly");
      authUrl.searchParams.append("response_type", "code");
      authUrl.searchParams.append("access_type", "offline");
      authUrl.searchParams.append("prompt", "consent");
      authUrl.searchParams.append("state", "gmail_connect");
      
      // Redirect to Google OAuth consent screen
      console.log("Redirecting to Google OAuth URL:", authUrl.toString());
      window.location.href = authUrl.toString();
    } catch (error) {
      console.error("Error initiating OAuth flow:", error);
      toast.error("Failed to start Google authentication");
      setLocalIsConnecting(false);
      sessionStorage.removeItem('gmailOAuthInProgress');
      sessionStorage.removeItem('oauth_nonce');
    }
  };

  return (
    <Button 
      onClick={initiateGoogleOAuth} 
      disabled={isConnecting || localIsConnecting}
      variant={variant}
      className={className}
    >
      {isConnecting || localIsConnecting ? (
        <>
          <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
          Connecting...
        </>
      ) : (
        <>
          <PlusCircle className="mr-2 h-4 w-4" />
          {buttonText}
        </>
      )}
    </Button>
  );
};
