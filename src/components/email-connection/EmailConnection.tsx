
import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useLocation, useNavigate } from "react-router-dom";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Mail } from "lucide-react";
import { toast } from "sonner";
import { getUserEmailAccounts } from "@/lib/supabase";
import { EmailAccountsList } from "./EmailAccountsList";
import { GoogleOAuthButton } from "./GoogleOAuthButton";
import { OAuthErrorAlert } from "./OAuthErrorAlert";
import { NoAccountsState } from "./NoAccountsState";

export const EmailConnection = () => {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [emailAccounts, setEmailAccounts] = useState([]);
  const [status, setStatus] = useState({ 
    loading: false, 
    error: null 
  });
  const [isConnecting, setIsConnecting] = useState(false);
  const [oauthError, setOauthError] = useState(null);
  const [errorDetails, setErrorDetails] = useState(null);
  const [debugInfo, setDebugInfo] = useState(null);
  const [connectionProcessed, setConnectionProcessed] = useState(false);
  
  // Use the redirect URI from environment variables or fall back to a default
  const redirectUri = import.meta.env.VITE_REDIRECT_URI || 
    window.location.origin + "/admin";
  
  console.log("Current redirect URI being used:", redirectUri);
  console.log("Current session in EmailConnection:", !!user);
  
  // Reset state on mount
  useEffect(() => {
    console.log("EmailConnection component mounted", { userId: user?.id });
    
    // Reset states
    setIsConnecting(false);
    setStatus({ loading: false, error: null });
    setOauthError(null);
    setErrorDetails(null);
    setDebugInfo(null);
    setConnectionProcessed(false);
    
    // Initial fetch if user exists
    if (user) {
      fetchEmailAccounts();
    }
    
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]); // Only re-run when user ID changes
  
  // Handle OAuth callback in URL
  useEffect(() => {
    // Check for OAuth callback
    const searchParams = new URLSearchParams(location.search);
    const code = searchParams.get('code');
    const state = searchParams.get('state');
    const error = searchParams.get('error');
    
    // Only process if not already processed and we have valid user
    if (!connectionProcessed && user && (code || error)) {
      console.log("URL parameters detected:", { code: !!code, state, error, userId: user.id });
      
      if (error) {
        console.error("OAuth error returned:", error);
        setOauthError(error);
        toast.error("Failed to connect Gmail account");
        sessionStorage.removeItem('gmailOAuthInProgress');
        sessionStorage.removeItem('oauth_nonce');
        setIsConnecting(false);
        setConnectionProcessed(true);
        
        // Remove the query parameters but stay on admin page
        navigate('/admin', { replace: true });
        return;
      }
      
      if (code && state === 'gmail_connect') {
        console.log("Handling OAuth callback with code for user:", user.id);
        handleOAuthCallback(code);
        setConnectionProcessed(true);
        
        // We'll remove the query parameters after processing
        navigate('/admin', { replace: true });
      }
    } else if (location.pathname === '/admin' && !location.search && !connectionProcessed) {
      // Reset connecting state when we return to clean admin URL
      setIsConnecting(false);
      
      // Check if we returned from a failed OAuth flow
      const oauthInProgress = sessionStorage.getItem('gmailOAuthInProgress');
      if (oauthInProgress === 'true') {
        console.log("Detected return from OAuth flow without code");
        toast.error("Gmail connection was cancelled or failed");
        sessionStorage.removeItem('gmailOAuthInProgress');
        sessionStorage.removeItem('oauth_nonce');
        setIsConnecting(false);
      }
    }
    
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.search, location.pathname, user?.id, connectionProcessed]);

  const fetchEmailAccounts = useCallback(async () => {
    if (!user) return;
    
    console.log("Fetching email accounts for user", user.id);
    setStatus({ loading: true, error: null });
    
    try {
      const accounts = await getUserEmailAccounts(user.id);
      console.log("Fetched email accounts:", accounts);
      
      setEmailAccounts(accounts || []);
      setStatus({ loading: false, error: null });
    } catch (error) {
      console.error("Error fetching email accounts:", error);
      
      toast.error("Failed to load email accounts");
      setEmailAccounts([]);
      setStatus({ loading: false, error: error.message });
    }
  }, [user]);

  const handleOAuthCallback = async (code) => {
    if (!user) {
      console.error("No user found when handling OAuth callback");
      toast.error("Authentication error. Please try again after logging in.");
      return;
    }
    
    console.log("Processing OAuth callback for user:", user.id);
    
    try {
      setIsConnecting(true);
      const toastId = toast.loading("Connecting Gmail account...");
      
      console.log("Exchanging code for access token with redirectUri:", redirectUri);
      const result = await import("@/lib/supabase").then(module => 
        module.connectGoogleEmail(user.id, code, redirectUri)
      );
      
      if (result.success) {
        toast.dismiss(toastId);
        toast.success("Gmail account connected successfully!");
        // Refresh the email accounts list
        await fetchEmailAccounts();
      } else {
        console.error("Connection error details:", result);
        setOauthError(result.error);
        setErrorDetails(result.details);
        
        // Capture debug info
        setDebugInfo({
          googleError: result.googleError || null,
          googleErrorDescription: result.googleErrorDescription || null,
          tokenInfo: result.tokenInfo || null,
          edgeFunctionError: result.edgeFunctionError || null,
          statusCode: result.statusCode || null,
          redirectUriUsed: redirectUri,
          userId: user.id
        });
        
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
      }
    } catch (error) {
      console.error("Error handling OAuth callback:", error);
      setOauthError("Exception during callback");
      setErrorDetails(error.message || String(error));
      toast.error("Failed to complete Gmail connection");
    } finally {
      setIsConnecting(false);
      // Always clear the OAuth flags
      sessionStorage.removeItem('gmailOAuthInProgress');
      sessionStorage.removeItem('oauth_nonce');
    }
  };

  // Check if we should show URI setup guidance
  const hasRedirectUriMismatch = oauthError === 'redirect_uri_mismatch';
  const showDebugInfo = !!errorDetails || !!debugInfo;

  // Always render the connect button section even if loading
  // This ensures it's available after returning from OAuth flow
  return (
    <Card className="w-full bg-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-card-foreground">
          <Mail className="h-5 w-5" />
          Connect Email Accounts
        </CardTitle>
        <CardDescription className="text-muted-foreground">
          Connect your email accounts to automatically fetch and archive newsletters.
        </CardDescription>
      </CardHeader>

      <CardContent>
        {oauthError && (
          <OAuthErrorAlert 
            oauthError={oauthError}
            hasRedirectUriMismatch={hasRedirectUriMismatch}
            redirectUri={redirectUri}
            errorDetails={errorDetails}
            debugInfo={debugInfo}
            showDebugInfo={showDebugInfo}
          />
        )}

        {status.loading && emailAccounts.length === 0 ? (
          <NoAccountsState 
            isLoading={true} 
            isConnecting={isConnecting}
            redirectUri={redirectUri}
            handleConnect={(initiateGoogleOAuth) => initiateGoogleOAuth()}
          />
        ) : emailAccounts.length === 0 ? (
          <NoAccountsState 
            isLoading={false}
            isConnecting={isConnecting}
            redirectUri={redirectUri}
            handleConnect={(initiateGoogleOAuth) => initiateGoogleOAuth()}
          />
        ) : (
          <EmailAccountsList 
            emailAccounts={emailAccounts}
            onRefresh={fetchEmailAccounts}
          />
        )}
      </CardContent>

      <CardFooter className="flex justify-between">
        {emailAccounts.length > 0 && (
          <GoogleOAuthButton 
            isConnecting={isConnecting}
            buttonText="Connect Another Account"
            variant="outline"
          />
        )}
      </CardFooter>
    </Card>
  );
};
