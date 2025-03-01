
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Mail } from "lucide-react";
import { EmailAccountsList } from "./EmailAccountsList";
import { GoogleOAuthButton } from "./GoogleOAuthButton";
import { OAuthErrorAlert } from "./OAuthErrorAlert";
import { NoAccountsState } from "./NoAccountsState";
import { OAuthCallbackHandler } from "./OAuthCallbackHandler";
import { useEmailConnectionState } from "./EmailConnectionState";

export const EmailConnection = () => {
  const location = useLocation();
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
  
  // Fetch email accounts on mount
  useEffect(() => {
    fetchEmailAccounts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Handle OAuth error callback
  const handleOAuthError = (error: string, details?: any, info?: any) => {
    setOAuthError(error);
    if (details) setErrorDetails(details);
    if (info) setDebugInfo(info);
    setConnectionProcessed(true);
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
        {/* OAuth Callback Handler (invisible component) */}
        <OAuthCallbackHandler 
          redirectUri={redirectUri}
          onSuccess={fetchEmailAccounts}
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
