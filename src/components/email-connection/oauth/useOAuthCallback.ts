
import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/auth";
import { OAuthCallbackResult } from "./types";

export const useOAuthCallback = (
  redirectUri: string,
  onSuccess: () => Promise<void>,
  onError: (error: string, details?: any, debugInfo?: any) => void,
  setIsConnecting: (isConnecting: boolean) => void
) => {
  const location = useLocation();
  const { user } = useAuth();
  const processedRef = useRef(false);
  
  useEffect(() => {
    const processOAuthCallback = async () => {
      // Don't process the same callback multiple times
      if (processedRef.current) {
        console.log("[OAUTH CALLBACK] Already processed this callback");
        return;
      }

      const searchParams = new URLSearchParams(location.search);
      const code = searchParams.get('code');
      const state = searchParams.get('state');
      const error = searchParams.get('error');
      const errorDescription = searchParams.get('error_description');
      
      // Debug logging for callback state
      console.log("[OAUTH CALLBACK] Component state:", {
        processed: processedRef.current,
        hasUser: !!user,
        userId: user?.id,
        location: location.pathname + location.search,
        hasCode: !!code,
        state,
        error,
        oauthInProgress: sessionStorage.getItem('gmailOAuthInProgress')
      });
      
      // Only process if we have a code and state is 'gmail_connect'
      if (code && state === 'gmail_connect') {
        console.log("[OAUTH CALLBACK] Processing OAuth callback with code");
        
        if (!user) {
          console.error("[OAUTH CALLBACK] No user found during OAuth callback");
          onError("Authentication required to connect Gmail", 
            { missingUser: true }, 
            { userId: sessionStorage.getItem('auth_user_id') }
          );
          setIsConnecting(false);
          processedRef.current = true;
          return;
        }
        
        try {
          console.log(`[OAUTH CALLBACK] Sending code to connect-gmail function, redirectUri: ${redirectUri}`);
          
          // Call the edge function to exchange the code for tokens
          const { data, error } = await supabase.functions.invoke('connect-gmail', {
            method: 'POST',
            body: { 
              code, 
              redirectUri,
              userId: user.id,
              timestamp: new Date().toISOString()
            }
          });
          
          console.log("[OAUTH CALLBACK] Edge function response:", data);
          
          if (error) {
            console.error("[OAUTH CALLBACK] Edge function error:", error);
            onError(
              `Failed to connect Gmail: ${error.message}`, 
              error, 
              { redirectUri, code: code.substring(0, 10) + "..." }
            );
            processedRef.current = true;
          } else {
            const result = data as OAuthCallbackResult;
            
            if (result.success) {
              console.log("[OAUTH CALLBACK] Gmail connection successful");
              // Clear the OAuth in progress flag
              sessionStorage.removeItem('gmailOAuthInProgress');
              sessionStorage.removeItem('oauth_nonce');
              
              await onSuccess();
            } else {
              console.error("[OAUTH CALLBACK] Gmail connection failed:", result.error);
              onError(
                result.error || "Failed to connect Gmail", 
                result.details, 
                result.debugInfo
              );
            }
            processedRef.current = true;
          }
        } catch (error) {
          console.error("[OAUTH CALLBACK] Exception during Gmail connection:", error);
          onError(
            "Exception occurred during Gmail connection", 
            { error: error instanceof Error ? error.message : String(error) },
            { redirectUri, code: code.substring(0, 10) + "..." }
          );
          processedRef.current = true;
        } finally {
          // Always clear connecting state
          setIsConnecting(false);
        }
      } else if (error) {
        console.error(`[OAUTH CALLBACK] OAuth error: ${error}, description: ${errorDescription}`);
        onError(
          `OAuth error: ${error}${errorDescription ? `: ${errorDescription}` : ''}`,
          { error, errorDescription },
          { location: location.pathname + location.search }
        );
        
        sessionStorage.removeItem('gmailOAuthInProgress');
        sessionStorage.removeItem('oauth_nonce');
        
        setIsConnecting(false);
        processedRef.current = true;
      } else {
        console.log("[OAUTH CALLBACK] No OAuth parameters found", {
          processed: processedRef.current,
          user: !!user,
          pathname: location.pathname,
          search: location.search
        });
      }
    };
    
    processOAuthCallback();
  }, [location, user, onSuccess, onError, redirectUri, setIsConnecting]);
  
  return null;
};
