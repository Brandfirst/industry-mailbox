
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
import { DebugInfo } from "./DebugInfo";
import { ConnectionInProgressBanner } from "./ConnectionInProgressBanner";
import { useOAuthFlowDetection } from "./hooks/useOAuthFlowDetection";
import { useDebugMode } from "./hooks/useDebugMode";
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
  
  // Use our custom hooks
  const showDebug = useDebugMode(emailAccounts.length, redirectUri);
  
  useOAuthFlowDetection(
    setIsConnecting,
    setConnectAttempted,
    setOAuthError
  );
  
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
        <DebugInfo 
          showDebug={showDebug}
          redirectUri={redirectUri}
          isConnecting={isConnecting}
          oauthError={oauthError}
          emailAccountsLength={emailAccounts.length}
          status={status}
          connectionProcessed={connectionProcessed}
          connectAttempted={connectAttempted}
          debugInfo={debugInfo}
          errorDetails={errorDetails}
        />

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

        <ConnectionInProgressBanner show={showConnectionInProgressBanner} />

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
