
import { useEffect } from "react";
import { useOAuthCallback } from "./oauth/useOAuthCallback";
import { OAuthCallbackHandlerProps } from "./oauth/types";
import { toast } from "sonner";

export const OAuthCallbackHandler = ({
  redirectUri,
  onSuccess,
  onError,
  setIsConnecting
}: OAuthCallbackHandlerProps) => {
  // Use the extracted hook to handle OAuth callback logic
  const { isProcessing } = useOAuthCallback(redirectUri, onSuccess, onError, setIsConnecting);

  // Add additional logging for debugging
  useEffect(() => {
    console.log("[OAUTH CALLBACK HANDLER] Mounted", {
      redirectUri,
      isProcessing,
      hasUrlParams: window.location.search.includes('code=') || window.location.search.includes('error='),
      oauthInProgress: sessionStorage.getItem('gmailOAuthInProgress'),
      path: window.location.pathname,
      search: window.location.search,
      timestamp: new Date().toISOString()
    });
    
    // This shows a toast only if we have URL parameters but aren't processing yet
    // It helps inform the user that we're about to process their authentication
    if (
      (window.location.search.includes('code=') || window.location.search.includes('error=')) &&
      !isProcessing && 
      sessionStorage.getItem('toastShown') !== 'true'
    ) {
      console.log("[OAUTH CALLBACK HANDLER] Showing initial processing toast");
      toast.loading("Processing authentication...");
      sessionStorage.setItem('toastShown', 'true');
      
      // Clear the toast flag after a short delay
      setTimeout(() => {
        sessionStorage.removeItem('toastShown');
      }, 5000);
    }
  }, [redirectUri, isProcessing]);

  return null; // This is a functional component with no UI
};
