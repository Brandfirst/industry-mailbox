
import { useEffect } from "react";
import { useAuth } from "@/contexts/auth";
import { toast } from "sonner";
import { useOAuthState } from "./useOAuthState";
import { useOAuthParams } from "./useOAuthParams";
import { useOAuthAPI } from "./useOAuthAPI";

export const useOAuthCallback = (
  redirectUri: string,
  onSuccess: () => Promise<void>,
  onError: (error: string, details?: any, debugInfo?: any) => void,
  setIsConnecting: (isConnecting: boolean) => void
) => {
  const { user } = useAuth();
  const { 
    isProcessing, 
    setIsProcessing, 
    processedRef, 
    attemptedRef, 
    timeoutRef,
    clearUrlParams,
    cleanupOAuthState,
    handleOAuthError
  } = useOAuthState(setIsConnecting);
  
  const { getOAuthParams, logOAuthState } = useOAuthParams();
  const { exchangeCodeForTokens } = useOAuthAPI();
  
  // Set a safety timeout
  useEffect(() => {
    // Set a safety timeout to prevent getting stuck in connecting state
    timeoutRef.current = window.setTimeout(() => {
      const oauthInProgress = sessionStorage.getItem('gmailOAuthInProgress') === 'true';
      if (oauthInProgress && !processedRef.current) {
        console.warn("[OAUTH CALLBACK] Safety timeout triggered - OAuth flow appears stuck");
        toast.error("OAuth flow timed out. Please try again.");
        cleanupOAuthState();
      }
    }, 30000); // 30 second safety timeout
    
    return () => {
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current);
      }
    };
  }, []);
  
  // Process the OAuth callback
  useEffect(() => {
    const processOAuthCallback = async () => {
      // Don't process the same callback multiple times
      if (processedRef.current || isProcessing) {
        console.log("[OAUTH CALLBACK] Already processed this callback or currently processing");
        return;
      }
      
      // Get and log the OAuth parameters
      const params = logOAuthState(user?.id, isProcessing);
      
      // Check if we were redirected from Google auth without any parameters
      // This happens sometimes when Google auth fails silently
      if (params.oauthInProgress && !params.code && !params.error && !attemptedRef.current) {
        console.warn("[OAUTH CALLBACK] Possible failed silent redirect without parameters");
        const message = "OAuth flow was interrupted or failed silently. Please try again.";
        handleOAuthError(message, { silentFailure: true }, { timeElapsed: params.timeElapsed });
        
        cleanupOAuthState();
        attemptedRef.current = true;
        return;
      }
      
      // Only process if we have a code and state is 'gmail_connect'
      if (params.code && params.state === 'gmail_connect') {
        console.log("[OAUTH CALLBACK] Processing OAuth callback with code");
        setIsProcessing(true);
        
        if (!user) {
          console.error("[OAUTH CALLBACK] No user found during OAuth callback");
          
          // Try to recover the user ID from session storage
          const storedUserId = sessionStorage.getItem('auth_user_id');
          
          onError("Authentication required to connect Gmail", 
            { missingUser: true, storedUserId }, 
            { 
              userId: storedUserId,
              timeElapsed: params.timeElapsed,
              timestamp: new Date().toISOString()
            }
          );
          
          cleanupOAuthState();
          processedRef.current = true;
          setIsProcessing(false);
          
          clearUrlParams();
          return;
        }
        
        try {
          // Exchange the code for tokens
          const result = await exchangeCodeForTokens(
            params.code, 
            redirectUri, 
            user.id, 
            params.savedNonce
          );
          
          if (!result.success) {
            onError(
              result.error || "Failed to connect Gmail", 
              result.errorDetails, 
              { redirectUri, code: params.code.substring(0, 10) + "...", timeElapsed: params.timeElapsed }
            );
            processedRef.current = true;
          } else {
            const apiResult = result.data;
            
            if (apiResult.success) {
              console.log("[OAUTH CALLBACK] Gmail connection successful");
              // Clear the OAuth in progress flag
              cleanupOAuthState();
              
              toast.dismiss();
              toast.success("Gmail account connected successfully!");
              
              await onSuccess();
              clearUrlParams();
            } else {
              console.error("[OAUTH CALLBACK] Gmail connection failed:", apiResult.error);
              toast.dismiss();
              toast.error(apiResult.error || "Failed to connect Gmail");
              
              onError(
                apiResult.error || "Failed to connect Gmail", 
                apiResult.details, 
                { ...apiResult.debugInfo, timeElapsed: params.timeElapsed }
              );
              
              // Clean up OAuth state on error too
              cleanupOAuthState();
            }
            processedRef.current = true;
          }
        } catch (error) {
          console.error("[OAUTH CALLBACK] Exception during Gmail connection:", error);
          toast.dismiss();
          toast.error("Exception occurred during Gmail connection");
          
          onError(
            "Exception occurred during Gmail connection", 
            { error: error instanceof Error ? error.message : String(error) },
            { redirectUri, code: params.code.substring(0, 10) + "...", timeElapsed: params.timeElapsed }
          );
          processedRef.current = true;
          cleanupOAuthState();
        } finally {
          // Always clear connecting state
          setIsConnecting(false);
          setIsProcessing(false);
          clearUrlParams();
        }
      } else if (params.error) {
        console.error(`[OAUTH CALLBACK] OAuth error: ${params.error}, description: ${params.errorDescription}`);
        toast.error(`OAuth error: ${params.error}${params.errorDescription ? `: ${params.errorDescription}` : ''}`);
        
        onError(
          `OAuth error: ${params.error}${params.errorDescription ? `: ${params.errorDescription}` : ''}`,
          { error: params.error, errorDescription: params.errorDescription },
          { location: location.pathname + location.search, timeElapsed: params.timeElapsed }
        );
        
        cleanupOAuthState();
        processedRef.current = true;
        setIsProcessing(false);
        clearUrlParams();
      } else if (params.oauthInProgress && !params.code && !params.error && !attemptedRef.current) {
        // This is a case where the OAuth flow was started but interrupted
        console.log("[OAUTH CALLBACK] OAuth flow was interrupted");
        toast.error("OAuth flow was interrupted. Please try again.");
        
        cleanupOAuthState();
        attemptedRef.current = true;
      } else {
        console.log("[OAUTH CALLBACK] No OAuth parameters found for processing", {
          processed: processedRef.current,
          isProcessing,
          user: !!user,
          pathname: location.pathname,
          search: location.search,
          oauthInProgress: params.oauthInProgress
        });
      }
    };
    
    processOAuthCallback();
  }, [location, user, onSuccess, onError, redirectUri, setIsConnecting, isProcessing]);
  
  return { isProcessing };
};
