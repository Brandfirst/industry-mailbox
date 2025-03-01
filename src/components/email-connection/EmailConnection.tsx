
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Mail } from "lucide-react";
import { EmailAccountsList } from "./EmailAccountsList";
import { GoogleOAuthButton } from "./GoogleOAuthButton";
import { OAuthErrorAlert } from "./OAuthErrorAlert";
import { NoAccountsState } from "./NoAccountsState";
import { OAuthCallbackHandler } from "./OAuthCallbackHandler";
import { useEmailConnectionState } from "./EmailConnectionState";
import { toast } from "sonner";

export const EmailConnection = () => {
  const location = useLocation();
  const [connectAttempted, setConnectAttempted] = useState(false);
  const [showDebug, setShowDebug] = useState(false);
  
  const { 
    emailAccounts,
    status,
    isConnecting,
    oauthError,
    errorDetails,
    debugInfo,
    connectionProcessed,
    fetchEmailAccounts,
    setIsConnecting,
    setOAuthError,
    setErrorDetails,
    setDebugInfo,
    setConnectionProcessed
  } = useEmailConnectionState();
  
  // Use the redirect URI from environment variables or fall back to a default
  const redirectUri = import.meta.env.VITE_REDIRECT_URI || 
    window.location.origin + "/admin";
  
  // Enable debug mode if debug parameter is present
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const debug = searchParams.get('debug');
    setShowDebug(debug === 'true');
    
    if (debug === 'true') {
      console.log("[DEBUG MODE] Email connection debugging enabled");
      console.log("[DEBUG INFO] Current redirect URI:", redirectUri);
      console.log("[DEBUG INFO] VITE_GOOGLE_CLIENT_ID exists:", !!import.meta.env.VITE_GOOGLE_CLIENT_ID);
      console.log("[DEBUG INFO] Email accounts count:", emailAccounts.length);
    }
  }, [location.search, redirectUri, emailAccounts.length]);
  
  console.log("[EMAIL CONNECTION] Current state:", { 
    isConnecting, 
    oauthError, 
    connectionProcessed,
    accountsCount: emailAccounts.length,
    connectAttempted,
    showDebug,
    pathname: location.pathname,
    search: location.search,
    timestamp: new Date().toISOString()
  });
  
  // Check for interrupted OAuth flow on mount or when URL changes
  useEffect(() => {
    const oauthInProgress = sessionStorage.getItem('gmailOAuthInProgress') === 'true';
    const startTime = sessionStorage.getItem('oauth_start_time');
    const hasCallbackParams = location.search.includes('code=') || location.search.includes('error=');
    
    if (oauthInProgress && !hasCallbackParams) {
      const timeElapsed = startTime ? (Date.now() - parseInt(startTime)) / 1000 : 0;
      console.log(`[EMAIL CONNECTION] Detected OAuth in progress (${timeElapsed.toFixed(1)}s elapsed) but no callback parameters`);
      
      // If it's been more than 30 seconds, assume the flow was interrupted
      if (timeElapsed > 30) {
        console.warn("[EMAIL CONNECTION] OAuth flow appears to be interrupted, clearing state");
        toast.error("OAuth flow was interrupted. Please try connecting again.");
        
        // Clean up OAuth state
        sessionStorage.removeItem('gmailOAuthInProgress');
        sessionStorage.removeItem('oauth_nonce');
        sessionStorage.removeItem('oauth_start_time');
        
        setIsConnecting(false);
      }
    }
  }, [location.search, setIsConnecting]);
  
  // Fetch email accounts on mount and when connection is processed
  useEffect(() => {
    const fetchData = async () => {
      console.log("[EMAIL CONNECTION] Fetching email accounts...");
      await fetchEmailAccounts();
      console.log("[EMAIL CONNECTION] Email accounts fetched, count:", emailAccounts.length);
    };
    
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [connectionProcessed]);

  // Check URL for OAuth callback parameters
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const code = searchParams.get('code');
    const state = searchParams.get('state');
    const error = searchParams.get('error');
    
    if (code && state === 'gmail_connect') {
      console.log("[EMAIL CONNECTION] Found OAuth callback in URL, connection in progress");
      setIsConnecting(true);
      setConnectAttempted(true);
      toast.loading("Processing Google authentication...");
    } else if (error) {
      console.error("[EMAIL CONNECTION] OAuth error found in URL:", error);
      setOAuthError(error);
      setConnectAttempted(true);
      toast.error(`Google authentication error: ${error}`);
    }
  }, [location.search, setIsConnecting, setOAuthError]);

  // Handle OAuth success
  const handleOAuthSuccess = async () => {
    console.log("[EMAIL CONNECTION] OAuth successful, refreshing accounts");
    setConnectAttempted(true);
    toast.success("Gmail account connected successfully!");
    await fetchEmailAccounts();
  };

  // Handle OAuth error callback
  const handleOAuthError = (error: string, details?: any, info?: any) => {
    console.error("[EMAIL CONNECTION] OAuth error occurred:", error);
    setOAuthError(error);
    if (details) setErrorDetails(details);
    if (info) setDebugInfo(info);
    setConnectionProcessed(true);
    setConnectAttempted(true);
    toast.error(`Failed to connect Gmail: ${error}`);
  };

  // Show a banner if trying to connect but still waiting
  const showConnectionInProgressBanner = isConnecting && !oauthError && connectAttempted && !connectionProcessed;
  
  // Show debug information if enabled
  const renderDebugInfo = () => {
    if (!showDebug) return null;
    
    return (
      <div className="mb-4 p-2 bg-yellow-50 border border-yellow-200 rounded-md text-xs font-mono overflow-auto max-h-60">
        <h4 className="font-bold text-yellow-800 mb-1">Debug Information:</h4>
        <pre>
          {JSON.stringify({
            redirectUri,
            isConnecting,
            oauthError,
            hasGoogleClientId: !!import.meta.env.VITE_GOOGLE_CLIENT_ID,
            connectAttempted,
            connectionProcessed,
            accountsCount: emailAccounts.length,
            statusLoading: status.loading,
            statusError: status.error,
            currentPath: location.pathname + location.search,
            hasDebugInfo: !!debugInfo,
            hasErrorDetails: !!errorDetails,
            oauthInProgress: sessionStorage.getItem('gmailOAuthInProgress'),
            timestamp: new Date().toISOString()
          }, null, 2)}
        </pre>
      </div>
    );
  };

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
        {/* Debug Information (only shown with ?debug=true) */}
        {renderDebugInfo()}

        {/* OAuth Callback Handler (invisible component) */}
        <OAuthCallbackHandler 
          redirectUri={redirectUri}
          onSuccess={handleOAuthSuccess}
          onError={handleOAuthError}
          setIsConnecting={setIsConnecting}
        />

        {oauthError && (
          <OAuthErrorAlert 
            oauthError={oauthError}
            hasRedirectUriMismatch={oauthError.includes('redirect_uri_mismatch')}
            redirectUri={redirectUri}
            errorDetails={errorDetails}
            debugInfo={debugInfo}
            showDebugInfo={showDebug || !!debugInfo || !!errorDetails}
          />
        )}

        {showConnectionInProgressBanner && (
          <div className="bg-blue-50 border border-blue-200 text-blue-700 p-4 mb-4 rounded-md">
            <p className="font-medium">Connecting your Gmail account...</p>
            <p className="text-sm mt-1">This may take a moment. If nothing happens after 15 seconds, please try again.</p>
          </div>
        )}

        {status.loading && emailAccounts.length === 0 ? (
          <NoAccountsState 
            isLoading={true} 
            isConnecting={isConnecting}
            redirectUri={redirectUri}
            handleConnect={() => {}}
          />
        ) : emailAccounts.length === 0 ? (
          <NoAccountsState 
            isLoading={false}
            isConnecting={isConnecting}
            redirectUri={redirectUri}
            handleConnect={() => {}}
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
