
import { useLocation } from "react-router-dom";
import { debugLog } from "@/lib/utils/content-sanitization/debugUtils";

/**
 * Hook to extract and validate OAuth callback parameters
 */
export const useOAuthParams = () => {
  const location = useLocation();
  
  const getOAuthParams = () => {
    const searchParams = new URLSearchParams(location.search);
    const code = searchParams.get('code');
    const state = searchParams.get('state');
    const error = searchParams.get('error');
    const errorDescription = searchParams.get('error_description');
    
    const oauthInProgress = sessionStorage.getItem('gmailOAuthInProgress') === 'true';
    const startTime = sessionStorage.getItem('oauth_start_time');
    const timeElapsed = startTime ? `${((Date.now() - parseInt(startTime)) / 1000).toFixed(1)}s` : 'unknown';
    const savedNonce = sessionStorage.getItem('oauth_nonce');
    
    return {
      code,
      state,
      error,
      errorDescription,
      oauthInProgress,
      startTime,
      timeElapsed,
      savedNonce,
      hasCallbackParams: !!code || !!error
    };
  };

  const logOAuthState = (userId: string | undefined, isProcessing: boolean) => {
    const params = getOAuthParams();
    
    debugLog("OAuth Parameters:", {
      isProcessing,
      hasUser: !!userId,
      userId,
      location: location.pathname + location.search,
      hasCode: !!params.code,
      codeLength: params.code ? params.code.length : 0,
      state: params.state,
      savedNonce: params.savedNonce,
      error: params.error,
      oauthInProgress: params.oauthInProgress,
      timeElapsed: params.timeElapsed,
      timestamp: new Date().toISOString()
    });
    
    return params;
  };

  return {
    getOAuthParams,
    logOAuthState
  };
};
