
import { supabase } from "@/integrations/supabase/client";
import { OAuthCallbackResult } from "./types";
import { toast } from "sonner";

/**
 * Hook for handling OAuth API interactions
 */
export const useOAuthAPI = () => {
  const exchangeCodeForTokens = async (
    code: string, 
    redirectUri: string, 
    userId: string,
    savedNonce: string | null
  ) => {
    console.log(`[OAUTH API] Sending code to connect-gmail function, redirectUri: ${redirectUri}`);
    
    // Store user ID in session storage as a fallback
    sessionStorage.setItem('auth_user_id', userId);
    
    // Show a toast to indicate processing
    toast.loading("Processing Gmail connection...");
    
    try {
      // Call the edge function to exchange the code for tokens
      const { data, error } = await supabase.functions.invoke('connect-gmail', {
        method: 'POST',
        body: { 
          code, 
          redirectUri,
          userId,
          nonce: savedNonce,
          timestamp: new Date().toISOString()
        }
      });
      
      console.log("[OAUTH API] Edge function response:", data);
      
      if (error) {
        console.error("[OAUTH API] Edge function error:", error);
        toast.dismiss();
        return { 
          success: false, 
          error: error.message,
          errorDetails: error
        };
      }
      
      return { success: true, data: data as OAuthCallbackResult };
    } catch (error) {
      console.error("[OAUTH API] Exception during Gmail connection:", error);
      toast.dismiss();
      
      return { 
        success: false, 
        error: "Exception occurred during Gmail connection",
        errorDetails: error instanceof Error ? error.message : String(error)
      };
    }
  };

  return {
    exchangeCodeForTokens
  };
};
