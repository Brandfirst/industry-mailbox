
import { AlertCircle, ExternalLink } from "lucide-react";

interface OAuthErrorAlertProps {
  oauthError: string;
  hasRedirectUriMismatch: boolean;
  redirectUri: string;
  errorDetails: any;
  debugInfo: any;
  showDebugInfo: boolean;
}

export const OAuthErrorAlert = ({ 
  oauthError, 
  hasRedirectUriMismatch, 
  redirectUri,
  errorDetails,
  debugInfo,
  showDebugInfo
}: OAuthErrorAlertProps) => {
  return (
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
  );
};
