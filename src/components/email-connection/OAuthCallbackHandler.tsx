
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "sonner";
import { connectGoogleEmail } from "@/lib/supabase";

interface OAuthCallbackHandlerProps {
  redirectUri: string;
  onSuccess: () => Promise<void>;
  onError: (error: string, details?: any, debugInfo?: any) => void;
  setIsConnecting: (isConnecting: boolean) => void;
}

export const OAuthCallbackHandler = ({
  redirectUri,
  onSuccess,
  onError,
  setIsConnecting
}: OAuthCallbackHandlerProps) => {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [processed, setProcessed] = useState(false);

  // Process OAuth callback when component mounts
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const code = searchParams.get('code');
    const state = searchParams.get('state');
    const error = searchParams.get('error');

    // Log the current state for debugging
    console.log("[OAUTH CALLBACK] Component state:", { 
      processed, 
      hasUser: !!user, 
      userId: user?.id,
      location: location.pathname + location.search,
      hasCode: !!code,
      state,
      error
    });

    // Only process if not already processed and we have valid user
    if (!processed && user && (code || error)) {
      console.log("[OAUTH CALLBACK] URL parameters detected:", { 
        code: !!code, 
        state, 
        error, 
        userId: user.id,
        location: location.pathname + location.search
      });
      
      if (error) {
        console.error("[OAUTH CALLBACK] OAuth error returned:", error);
        onError(error);
        sessionStorage.removeItem('gmailOAuthInProgress');
        sessionStorage.removeItem('oauth_nonce');
        setIsConnecting(false);
        setProcessed(true);
        
        // Remove the query parameters but stay on admin page
        navigate('/admin', { replace: true });
        return;
      }
      
      if (code && state === 'gmail_connect') {
        console.log("[OAUTH CALLBACK] Found valid code and state, processing OAuth callback");
        handleOAuthCallback(code);
      } else {
        console.warn("[OAUTH CALLBACK] Invalid or missing code/state parameters", { code: !!code, state });
        if (code) {
          console.log("[OAUTH CALLBACK] Code found but state mismatch", { 
            expected: 'gmail_connect', 
            received: state 
          });
          onError("Invalid state parameter", { expected: 'gmail_connect', received: state });
        }
        setProcessed(true);
        setIsConnecting(false);
      }
    } else if (location.pathname === '/admin' && !location.search && !processed) {
      // Reset connecting state when we return to clean admin URL
      setIsConnecting(false);
      
      // Check if we returned from a failed OAuth flow
      const oauthInProgress = sessionStorage.getItem('gmailOAuthInProgress');
      if (oauthInProgress === 'true') {
        console.log("[OAUTH CALLBACK] Detected return from OAuth flow without code");
        toast.error("Gmail connection was cancelled or failed");
        sessionStorage.removeItem('gmailOAuthInProgress');
        sessionStorage.removeItem('oauth_nonce');
        setIsConnecting(false);
      }
    } else if (!processed && !code && !error) {
      console.log("[OAUTH CALLBACK] No OAuth parameters found", { 
        processed, 
        user: !!user, 
        pathname: location.pathname, 
        search: location.search 
      });
    }
  }, [location.search, location.pathname, user?.id, processed, onError, setIsConnecting, navigate]);

  const handleOAuthCallback = async (code: string) => {
    if (!user) {
      console.error("[OAUTH CALLBACK] No user found when handling OAuth callback");
      toast.error("Authentication error. Please try again after logging in.");
      return;
    }
    
    console.log("[OAUTH CALLBACK] Processing OAuth callback for user:", user.id);
    console.log("[OAUTH CALLBACK] OAuth code received, length:", code.length);
    
    try {
      setIsConnecting(true);
      const toastId = toast.loading("Connecting Gmail account...");
      
      console.log("[OAUTH CALLBACK] Exchanging code for access token with redirectUri:", redirectUri);
      
      // Add more debug information before making the request
      console.log("[OAUTH CALLBACK] Making connectGoogleEmail request with params:", {
        userId: user.id,
        codeLength: code.length,
        redirectUri,
        timestamp: new Date().toISOString()
      });
      
      const result = await connectGoogleEmail(user.id, code, redirectUri);
      console.log("[OAUTH CALLBACK] Connection result received:", { 
        success: result.success, 
        error: result.error,
        statusCode: result.statusCode,
        tokenInfo: !!result.tokenInfo,
        account: result.account ? `${result.account.email} (ID: ${result.account.id})` : null
      });
      
      if (result.success) {
        toast.dismiss(toastId);
        toast.success("Gmail account connected successfully!");
        // Refresh the email accounts list
        await onSuccess();
      } else {
        console.error("[OAUTH CALLBACK] Connection error details:", result);
        
        // Capture debug info
        const debugInfo = {
          googleError: result.googleError || null,
          googleErrorDescription: result.googleErrorDescription || null,
          tokenInfo: result.tokenInfo || null,
          edgeFunctionError: result.edgeFunctionError || null,
          statusCode: result.statusCode || null,
          redirectUriUsed: redirectUri,
          userId: user.id
        };
        
        // Format a more descriptive error message
        let errorMessage = result.error || "Unknown error";
        if (result.googleError) {
          errorMessage += `: ${result.googleError}`;
          if (result.googleErrorDescription) {
            errorMessage += ` - ${result.googleErrorDescription}`;
          }
        }
        
        if (result.statusCode) {
          errorMessage += ` (Status: ${result.statusCode})`;
        }
        
        toast.dismiss(toastId);
        toast.error(`Failed to connect Gmail: ${errorMessage}`);
        onError(result.error || "Unknown error", result.details, debugInfo);
      }
    } catch (error) {
      console.error("[OAUTH CALLBACK] Error handling OAuth callback:", error);
      onError("Exception during callback", error instanceof Error ? error.message : String(error));
      toast.error("Failed to complete Gmail connection");
    } finally {
      setIsConnecting(false);
      setProcessed(true);
      // Always clear the OAuth flags
      sessionStorage.removeItem('gmailOAuthInProgress');
      sessionStorage.removeItem('oauth_nonce');
      
      // Remove the query parameters after processing
      navigate('/admin', { replace: true });
    }
  };

  return null; // This is a functional component with no UI
};
