
import { useState } from "react";
import { useAuth } from "@/contexts/auth";
import { toast } from "sonner";
import { useEmailAccountsFetching } from "./hooks/useEmailAccountsFetching";
import { useOAuthPageReload } from "./hooks/useOAuthPageReload";
import { useOAuthTimeoutMonitor } from "./hooks/useOAuthTimeoutMonitor";
import { useOAuthRecovery } from "./hooks/useOAuthRecovery";
import { useRateLimitedConnection } from "./hooks/useRateLimitedConnection";

// Custom hook to manage email connection state
export const useEmailConnectionState = () => {
  const { user } = useAuth();
  const [isConnecting, setIsConnecting] = useState(false);
  const [oauthError, setOAuthError] = useState<string | null>(null);
  const [errorDetails, setErrorDetails] = useState<any>(null);
  const [debugInfo, setDebugInfo] = useState<any>(null);
  const [connectionProcessed, setConnectionProcessed] = useState(false);

  // Use our custom hooks
  const { emailAccounts, status, fetchEmailAccounts } = useEmailAccountsFetching(user?.id);
  const { initiateConnection } = useRateLimitedConnection();
  
  // Handle page reload during OAuth flow
  useOAuthPageReload(setIsConnecting);
  
  // Monitor OAuth flow for timeout and cleanup
  useOAuthTimeoutMonitor(user, isConnecting, setIsConnecting);
  
  // Handle recovery from interrupted OAuth flow
  useOAuthRecovery(user?.id, fetchEmailAccounts);

  // Function to safely start the connection process
  const initiateConnectionWithRateLimit = () => {
    if (initiateConnection()) {
      setIsConnecting(true);
    }
  };

  return {
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
    setConnectionProcessed,
    initiateConnection: initiateConnectionWithRateLimit
  };
};
