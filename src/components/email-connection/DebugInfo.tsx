
import { useLocation } from "react-router-dom";

interface DebugInfoProps {
  showDebug: boolean;
  redirectUri: string;
  isConnecting: boolean;
  oauthError: string | null;
  emailAccountsLength: number;
  status: { loading: boolean; error: string | null };
  connectionProcessed: boolean;
  connectAttempted: boolean;
  debugInfo: any;
  errorDetails: any;
}

export const DebugInfo = ({
  showDebug,
  redirectUri,
  isConnecting,
  oauthError,
  emailAccountsLength,
  status,
  connectionProcessed,
  connectAttempted,
  debugInfo,
  errorDetails
}: DebugInfoProps) => {
  const location = useLocation();
  
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
          accountsCount: emailAccountsLength,
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
