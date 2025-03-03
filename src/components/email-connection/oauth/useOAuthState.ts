
import { useState, useRef } from "react";
import { toast } from "sonner";
import { useNavigate, useLocation } from "react-router-dom";
import { debugLog } from "@/lib/utils/content-sanitization/debugUtils";

/**
 * Hook to manage OAuth callback state
 */
export const useOAuthState = (setIsConnecting: (isConnecting: boolean) => void) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const processedRef = useRef(false);
  const attemptedRef = useRef(false);
  const timeoutRef = useRef<number | null>(null);
  const location = useLocation();
  const navigate = useNavigate();

  // Clear the URL params after successful processing
  const clearUrlParams = () => {
    if (location.search && (location.search.includes('code=') || location.search.includes('error='))) {
      debugLog("Clearing URL parameters after processing");
      // Use replace to avoid adding to browser history
      navigate(location.pathname, { replace: true });
    }
  };

  // Cleanup function for OAuth state
  const cleanupOAuthState = () => {
    debugLog("Cleaning up OAuth state");
    sessionStorage.removeItem('gmailOAuthInProgress');
    sessionStorage.removeItem('oauth_nonce');
    sessionStorage.removeItem('oauth_start_time');
    setIsConnecting(false);
  };

  // Set a toast message and handle errors
  const handleOAuthError = (message: string, details?: any, debugInfo?: any) => {
    toast.error(message);
    console.error(`[OAUTH STATE] Error: ${message}`, { details, debugInfo });
  };

  return {
    isProcessing,
    setIsProcessing,
    processedRef,
    attemptedRef,
    timeoutRef,
    clearUrlParams,
    cleanupOAuthState,
    handleOAuthError
  };
};
