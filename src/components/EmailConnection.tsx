
import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, RefreshCw, Trash2, PlusCircle, AlertCircle, ExternalLink } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { getUserEmailAccounts, connectGoogleEmail, disconnectEmailAccount, syncEmailAccount } from "@/lib/supabase";
import { useLocation, useNavigate } from "react-router-dom";

const EmailConnection = () => {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [emailAccounts, setEmailAccounts] = useState([]);
  const [status, setStatus] = useState({ 
    loading: false, 
    error: null 
  });
  const [isSyncing, setIsSyncing] = useState(null);
  const [isDisconnecting, setIsDisconnecting] = useState(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [oauthError, setOauthError] = useState(null);
  const [errorDetails, setErrorDetails] = useState(null);
  const [debugInfo, setDebugInfo] = useState(null);
  
  // IMPORTANT: Use the fixed redirect URI that must match exactly with Google Cloud Console
  const redirectUri = "https://feb48f71-47d1-4ebf-85de-76618e7c453a.lovableproject.com/admin";
  
  // Reset state on mount
  useEffect(() => {
    console.log("EmailConnection component mounted");
    
    // Reset states
    setIsConnecting(false);
    setStatus({ loading: false, error: null });
    setOauthError(null);
    setErrorDetails(null);
    setDebugInfo(null);
    
    // Clear any OAuth flags that might be leftover
    sessionStorage.removeItem('gmailOAuthInProgress');
    sessionStorage.removeItem('oauth_nonce');
    
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
    
    if (error) {
      console.error("OAuth error returned:", error);
      setOauthError(error);
      toast.error("Failed to connect Gmail account");
      sessionStorage.removeItem('gmailOAuthInProgress');
      sessionStorage.removeItem('oauth_nonce');
      setIsConnecting(false);
      // Remove the query parameters to prevent reprocessing
      navigate('/admin', { replace: true });
      return;
    }
    
    if (code && state === 'gmail_connect' && user) {
      console.log("Handling OAuth callback with code");
      handleOAuthCallback(code);
      // Remove the query parameters to prevent reprocessing
      navigate('/admin', { replace: true });
    } else if (location.pathname === '/admin' && !location.search) {
      // Reset connecting state when we return to clean admin URL
      setIsConnecting(false);
    }
    
    // Check if we returned from a failed OAuth flow
    const oauthInProgress = sessionStorage.getItem('gmailOAuthInProgress');
    if (oauthInProgress === 'true' && !location.search.includes('code=')) {
      console.log("Detected return from OAuth flow without code");
      toast.error("Gmail connection was cancelled or failed");
      sessionStorage.removeItem('gmailOAuthInProgress');
      sessionStorage.removeItem('oauth_nonce');
      setIsConnecting(false);
    }
    
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.search, location.pathname, user?.id]);

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
    if (!user) return;
    
    try {
      setIsConnecting(true);
      const toastId = toast.loading("Connecting Gmail account...");
      
      console.log("Exchanging code for access token");
      const result = await connectGoogleEmail(user.id, code);
      
      if (result.success) {
        toast.dismiss(toastId);
        toast.success("Gmail account connected successfully!");
        // Refresh the email accounts list
        fetchEmailAccounts();
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
          statusCode: result.statusCode || null
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

  const initiateGoogleOAuth = () => {
    if (isConnecting || !user) return; // Prevent multiple clicks
    
    console.log("Starting Google OAuth flow...");
    setIsConnecting(true);
    
    // Get the OAuth client ID from environment variables
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    if (!clientId) {
      toast.error("Google client ID not configured. Please add VITE_GOOGLE_CLIENT_ID to your environment.");
      setIsConnecting(false);
      return;
    }
    
    try {
      // Generate and store a nonce for state validation
      const nonce = Math.random().toString(36).substring(2, 15);
      sessionStorage.setItem('oauth_nonce', nonce);
      
      // Save a flag in sessionStorage to detect if we're in the middle of an OAuth flow
      sessionStorage.setItem('gmailOAuthInProgress', 'true');
      
      // Store the current path to return to after auth
      sessionStorage.setItem('auth_return_path', location.pathname);
      
      console.log("Using fixed redirect URI for OAuth flow:", redirectUri);
      
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
      setIsConnecting(false);
      sessionStorage.removeItem('gmailOAuthInProgress');
      sessionStorage.removeItem('oauth_nonce');
    }
  };

  const handleDisconnect = async (accountId) => {
    if (!user) return;
    
    setIsDisconnecting(accountId);
    try {
      const result = await disconnectEmailAccount(accountId);
      
      if (result.success) {
        toast.success("Email account disconnected");
        // Refresh the email accounts list
        fetchEmailAccounts();
      } else {
        toast.error(`Failed to disconnect: ${result.error}`);
      }
    } catch (error) {
      console.error("Error disconnecting email account:", error);
      toast.error("Failed to disconnect email account");
    } finally {
      setIsDisconnecting(null);
    }
  };

  const handleSync = async (accountId) => {
    if (!user) return;
    
    setIsSyncing(accountId);
    try {
      const result = await syncEmailAccount(accountId);
      
      if (result.success) {
        toast.success("Email account synced successfully");
        // Refresh the email accounts list to get the updated last_sync time
        fetchEmailAccounts();
      } else {
        toast.error(`Failed to sync: ${result.error}`);
      }
    } catch (error) {
      console.error("Error syncing email account:", error);
      toast.error("Failed to sync email account");
    } finally {
      setIsSyncing(null);
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
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md text-red-700 flex items-start">
            <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium mb-1">Google OAuth Error</p>
              <p className="text-sm">There was an error connecting to Google: {oauthError}</p>
              
              {hasRedirectUriMismatch && (
                <>
                  <p className="text-sm mt-2">
                    This is due to a redirect URI mismatch. You need to add the following URI to your 
                    Google Cloud Console under "Authorized redirect URIs":
                  </p>
                  <div className="mt-2 p-2 bg-red-100 rounded-md text-sm font-mono overflow-auto">
                    {redirectUri}
                  </div>
                  <p className="text-xs mt-2">
                    Note: It may take up to 5 minutes for changes in Google Cloud Console to take effect.
                  </p>
                </>
              )}
              
              {showDebugInfo && (
                <div className="mt-2">
                  <p className="text-sm font-medium">Error Details:</p>
                  <pre className="mt-1 p-2 bg-red-100 rounded-md text-xs overflow-auto max-h-40">
                    {typeof errorDetails === 'object' 
                      ? JSON.stringify(errorDetails, null, 2) 
                      : errorDetails}
                  </pre>
                  
                  {debugInfo && (
                    <>
                      <p className="text-sm font-medium mt-2">Google API Response:</p>
                      <pre className="mt-1 p-2 bg-red-100 rounded-md text-xs overflow-auto max-h-40">
                        {JSON.stringify(debugInfo, null, 2)}
                      </pre>
                    </>
                  )}
                </div>
              )}
              
              <div className="mt-3 space-y-2">
                <p className="text-sm font-medium">Common Auth Error Solutions:</p>
                <ol className="list-decimal list-inside text-sm space-y-1 pl-2">
                  <li>Ensure the Google Cloud project has Gmail API enabled</li>
                  <li>Check that GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET are correctly set in Supabase secrets</li>
                  <li>Verify GOOGLE_REDIRECT_URL in Supabase matches exactly: {redirectUri}</li>
                  <li>Confirm OAuth consent screen is properly configured with necessary scopes</li>
                  <li>Try clearing browser cookies and cache, then attempt again</li>
                </ol>
              </div>
            </div>
          </div>
        )}

        {status.loading && emailAccounts.length === 0 ? (
          <div className="space-y-4">
            <Skeleton className="h-16 w-full bg-muted" />
            <Skeleton className="h-16 w-full bg-muted" />
            <div className="flex flex-col items-center justify-center py-4 text-center">
              <Button 
                onClick={initiateGoogleOAuth} 
                disabled={isConnecting}
                className="relative"
              >
                {isConnecting ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    Connecting...
                  </>
                ) : (
                  <>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Connect Gmail
                  </>
                )}
              </Button>
            </div>
          </div>
        ) : emailAccounts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <Mail className="h-10 w-10 text-muted-foreground mb-4" />
            <h3 className="font-medium text-lg mb-1 text-card-foreground">No Email Accounts Connected</h3>
            <p className="text-muted-foreground text-sm max-w-md mb-6">
              Connect your Gmail account to automatically import newsletters.
            </p>
            <Button 
              onClick={initiateGoogleOAuth} 
              disabled={isConnecting}
              className="relative"
            >
              {isConnecting ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Connecting...
                </>
              ) : (
                <>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Connect Gmail
                </>
              )}
            </Button>
            
            <div className="mt-4 p-3 border rounded-md bg-secondary text-left w-full max-w-md">
              <h4 className="text-sm font-medium mb-2 text-card-foreground">Google OAuth Configuration</h4>
              <div className="space-y-2">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Redirect URI being used:</p>
                  <code className="px-2 py-1 bg-background rounded text-xs block overflow-auto text-foreground">
                    {redirectUri}
                  </code>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Client ID:</p>
                  <code className="px-2 py-1 bg-background rounded text-xs block overflow-hidden text-ellipsis whitespace-nowrap text-foreground">
                    {import.meta.env.VITE_GOOGLE_CLIENT_ID}
                  </code>
                </div>
                <p className="text-xs text-muted-foreground">
                  Make sure the redirect URI matches exactly what's configured in your 
                  <a 
                    href="https://console.cloud.google.com/apis/credentials" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-primary hover:underline inline-flex items-center mx-1"
                  >
                    Google Cloud Console
                    <ExternalLink className="h-3 w-3 ml-0.5" />
                  </a>
                  under "Authorized redirect URIs".
                </p>
              </div>
              
              <div className="mt-3 pt-3 border-t border-border">
                <h4 className="text-sm font-medium mb-2 text-card-foreground">Supabase Edge Function Status</h4>
                <p className="text-xs text-muted-foreground">
                  If you're encountering errors connecting to Gmail, check the 
                  <a 
                    href="https://supabase.com/dashboard/project/ldhnqpkaifyoxtuchxko/functions/connect-gmail/logs" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-primary hover:underline inline-flex items-center mx-1"
                  >
                    Edge Function Logs
                    <ExternalLink className="h-3 w-3 ml-0.5" />
                  </a>
                  for more detailed error information.
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Also verify the 
                  <a 
                    href="https://supabase.com/dashboard/project/ldhnqpkaifyoxtuchxko/settings/functions" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-primary hover:underline inline-flex items-center mx-1"
                  >
                    Edge Function Secrets
                    <ExternalLink className="h-3 w-3 ml-0.5" />
                  </a>
                  for GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, and GOOGLE_REDIRECT_URL.
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {emailAccounts.map((account) => (
              <div 
                key={account.id} 
                className="border rounded-lg p-4 flex items-center justify-between bg-card"
              >
                <div>
                  <div className="font-medium text-card-foreground">{account.email}</div>
                  <div className="text-sm text-muted-foreground">
                    Connected {new Date(account.created_at).toLocaleDateString()}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Last sync: {account.last_sync ? new Date(account.last_sync).toLocaleString() : 'Never'}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    disabled={isSyncing === account.id}
                    onClick={() => handleSync(account.id)}
                    className="text-foreground"
                  >
                    {isSyncing === account.id ? (
                      <RefreshCw className="h-4 w-4 mr-1 animate-spin" />
                    ) : (
                      <RefreshCw className="h-4 w-4 mr-1" />
                    )}
                    Sync
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    disabled={isDisconnecting === account.id}
                    onClick={() => handleDisconnect(account.id)}
                    className="border-red-300 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4 mr-1 text-red-500" />
                    Disconnect
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>

      <CardFooter className="flex justify-between">
        {emailAccounts.length > 0 && (
          <Button 
            variant="outline" 
            onClick={initiateGoogleOAuth}
            disabled={isConnecting}
            className="text-foreground"
          >
            {isConnecting ? (
              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <PlusCircle className="mr-2 h-4 w-4" />
            )}
            Connect Another Account
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default EmailConnection;
