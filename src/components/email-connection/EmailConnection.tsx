
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
  
  console.log("Current redirect URI being used:", redirectUri);
  console.log("OAuth Connection state:", { 
    isConnecting, 
    oauthError, 
    connectionProcessed,
    accountsCount: emailAccounts.length,
    connectAttempted
  });
  
  // Fetch email accounts on mount and when connection is processed
  useEffect(() => {
    const fetchData = async () => {
      console.log("Fetching email accounts...");
      await fetchEmailAccounts();
      console.log("Email accounts fetched, count:", emailAccounts.length);
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
      console.log("Found OAuth callback in URL, connection in progress");
      setIsConnecting(true);
      setConnectAttempted(true);
      toast.loading("Processing Google authentication...");
    } else if (error) {
      console.error("OAuth error found in URL:", error);
      setOAuthError(error);
      setConnectAttempted(true);
      toast.error(`Google authentication error: ${error}`);
    }
  }, [location.search, setIsConnecting, setOAuthError]);

  // Handle OAuth success
  const handleOAuthSuccess = async () => {
    console.log("OAuth successful, refreshing accounts");
    setConnectAttempted(true);
    toast.success("Gmail account connected successfully!");
    await fetchEmailAccounts();
  };

  // Handle OAuth error callback
  const handleOAuthError = (error: string, details?: any, info?: any) => {
    console.error("OAuth error occurred:", error);
    setOAuthError(error);
    if (details) setErrorDetails(details);
    if (info) setDebugInfo(info);
    setConnectionProcessed(true);
    setConnectAttempted(true);
    toast.error(`Failed to connect Gmail: ${error}`);
  };

  // Show a banner if trying to connect but still waiting
  const showConnectionInProgressBanner = isConnecting && !oauthError && connectAttempted && !connectionProcessed;

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
            hasRedirectUriMismatch={oauthError === 'redirect_uri_mismatch'}
            redirectUri={redirectUri}
            errorDetails={errorDetails}
            debugInfo={debugInfo}
            showDebugInfo={!!errorDetails || !!debugInfo}
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
