
import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/auth";
import { OAuthCallbackResult } from "./types";
import { toast } from "sonner";

export const useOAuthCallback = (
  redirectUri: string,
  onSuccess: () => Promise<void>,
  onError: (error: string, details?: any, debugInfo?: any) => void,
  setIsConnecting: (isConnecting: boolean) => void
) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const processedRef = useRef(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const attemptedRef = useRef(false);
  
  // Clear the URL params after successful processing
  const clearUrlParams = () => {
    if (location.search && (location.search.includes('code=') || location.search.includes('error='))) {
      console.log("[OAUTH CALLBACK] Clearing URL parameters after processing");
      // Use replace to avoid adding to browser history
      navigate(location.pathname, { replace: true });
    }
  };
  
  useEffect(() => {
    const processOAuthCallback = async () => {
      // Don't process the same callback multiple times
      if (processedRef.current || isProcessing) {
        console.log("[OAUTH CALLBACK] Already processed this callback or currently processing");
        return;
      }

      const searchParams = new URLSearchParams(location.search);
      const code = searchParams.get('code');
      const state = searchParams.get('state');
      const error = searchParams.get('error');
      const errorDescription = searchParams.get('error_description');
      
      const oauthInProgress = sessionStorage.getItem('gmailOAuthInProgress') === 'true';
      const startTime = sessionStorage.getItem('oauth_start_time');
      const timeElapsed = startTime ? `${((Date.now() - parseInt(startTime)) / 1000).toFixed(1)}s` : 'unknown';
      const savedNonce = sessionStorage.getItem('oauth_nonce');
      
      // Debug logging for callback state
      console.log("[OAUTH CALLBACK] Component state:", {
        processed: processedRef.current,
        isProcessing,
        hasUser: !!user,
        userId: user?.id,
        location: location.pathname + location.search,
        hasCode: !!code,
        codeLength: code ? code.length : 0,
        state,
        savedNonce,
        error,
        oauthInProgress,
        timeElapsed,
        redirectUri,
        timestamp: new Date().toISOString()
      });
      
      // Check if we were redirected from Google auth without any parameters
      // This happens sometimes when Google auth fails silently
      if (oauthInProgress && !code && !error && !attemptedRef.current) {
        console.warn("[OAUTH CALLBACK] Possible failed silent redirect without parameters");
        const message = "OAuth flow was interrupted or failed silently. Please try again.";
        toast.error(message);
        
        // Clean up OAuth state
        sessionStorage.removeItem('gmailOAuthInProgress');
        sessionStorage.removeItem('oauth_nonce');
        sessionStorage.removeItem('oauth_start_time');
        
        setIsConnecting(false);
        onError(message, { silentFailure: true }, { timeElapsed });
        attemptedRef.current = true;
        return;
      }
      
      // Only process if we have a code and state is 'gmail_connect'
      if (code && state === 'gmail_connect') {
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
              timeElapsed,
              timestamp: new Date().toISOString()
            }
          );
          
          setIsConnecting(false);
          processedRef.current = true;
          setIsProcessing(false);
          
          // Clear OAuth session state
          sessionStorage.removeItem('gmailOAuthInProgress');
          sessionStorage.removeItem('oauth_nonce');
          sessionStorage.removeItem('oauth_start_time');
          
          clearUrlParams();
          return;
        }
        
        try {
          console.log(`[OAUTH CALLBACK] Sending code to connect-gmail function, redirectUri: ${redirectUri}`);
          
          // Show a toast to indicate processing
          toast.loading("Processing Gmail connection...");
          
          // Call the edge function to exchange the code for tokens
          const { data, error } = await supabase.functions.invoke('connect-gmail', {
            method: 'POST',
            body: { 
              code, 
              redirectUri,
              userId: user.id,
              nonce: savedNonce,
              timestamp: new Date().toISOString()
            }
          });
          
          console.log("[OAUTH CALLBACK] Edge function response:", data);
          
          if (error) {
            console.error("[OAUTH CALLBACK] Edge function error:", error);
            onError(
              `Failed to connect Gmail: ${error.message}`, 
              error, 
              { redirectUri, code: code.substring(0, 10) + "...", timeElapsed }
            );
            toast.dismiss();
            toast.error(`Failed to connect Gmail: ${error.message}`);
            processedRef.current = true;
          } else {
            const result = data as OAuthCallbackResult;
            
            if (result.success) {
              console.log("[OAUTH CALLBACK] Gmail connection successful");
              // Clear the OAuth in progress flag
              sessionStorage.removeItem('gmailOAuthInProgress');
              sessionStorage.removeItem('oauth_nonce');
              sessionStorage.removeItem('oauth_start_time');
              
              toast.dismiss();
              toast.success("Gmail account connected successfully!");
              
              await onSuccess();
              clearUrlParams();
            } else {
              console.error("[OAUTH CALLBACK] Gmail connection failed:", result.error);
              toast.dismiss();
              toast.error(result.error || "Failed to connect Gmail");
              
              onError(
                result.error || "Failed to connect Gmail", 
                result.details, 
                { ...result.debugInfo, timeElapsed }
              );
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
            { redirectUri, code: code.substring(0, 10) + "...", timeElapsed }
          );
          processedRef.current = true;
        } finally {
          // Always clear connecting state
          setIsConnecting(false);
          setIsProcessing(false);
          clearUrlParams();
        }
      } else if (error) {
        console.error(`[OAUTH CALLBACK] OAuth error: ${error}, description: ${errorDescription}`);
        toast.error(`OAuth error: ${error}${errorDescription ? `: ${errorDescription}` : ''}`);
        
        onError(
          `OAuth error: ${error}${errorDescription ? `: ${errorDescription}` : ''}`,
          { error, errorDescription },
          { location: location.pathname + location.search, timeElapsed }
        );
        
        sessionStorage.removeItem('gmailOAuthInProgress');
        sessionStorage.removeItem('oauth_nonce');
        sessionStorage.removeItem('oauth_start_time');
        
        setIsConnecting(false);
        processedRef.current = true;
        setIsProcessing(false);
        clearUrlParams();
      } else if (oauthInProgress && !code && !error && !attemptedRef.current) {
        // This is a case where the OAuth flow was started but interrupted
        console.log("[OAUTH CALLBACK] OAuth flow was interrupted");
        toast.error("OAuth flow was interrupted. Please try again.");
        
        sessionStorage.removeItem('gmailOAuthInProgress');
        sessionStorage.removeItem('oauth_nonce');
        sessionStorage.removeItem('oauth_start_time');
        
        setIsConnecting(false);
        attemptedRef.current = true;
      } else {
        console.log("[OAUTH CALLBACK] No OAuth parameters found for processing", {
          processed: processedRef.current,
          isProcessing,
          user: !!user,
          pathname: location.pathname,
          search: location.search,
          oauthInProgress
        });
      }
    };
    
    processOAuthCallback();
  }, [location, user, onSuccess, onError, redirectUri, setIsConnecting, navigate, isProcessing]);
  
  return { isProcessing };
};
