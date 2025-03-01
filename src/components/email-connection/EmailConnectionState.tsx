
import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/contexts/auth";
import { supabase } from "@/integrations/supabase/client";
import { EmailAccount } from "@/lib/supabase/types";

// Custom hook to manage email connection state
export const useEmailConnectionState = () => {
  const { user } = useAuth();
  const [emailAccounts, setEmailAccounts] = useState<EmailAccount[]>([]);
  const [status, setStatus] = useState({ loading: false, error: null });
  const [isConnecting, setIsConnecting] = useState(false);
  const [oauthError, setOAuthError] = useState<string | null>(null);
  const [errorDetails, setErrorDetails] = useState<any>(null);
  const [debugInfo, setDebugInfo] = useState<any>(null);
  const [connectionProcessed, setConnectionProcessed] = useState(false);

  // Log state changes for debugging
  useEffect(() => {
    console.log("EmailConnectionState: Auth state changed", {
      userId: user?.id,
      isConnecting,
      oauthError,
      connectionProcessed
    });
  }, [user, isConnecting, oauthError, connectionProcessed]);

  // Fetch email accounts from the database
  const fetchEmailAccounts = useCallback(async () => {
    if (!user) {
      console.log("No user, can't fetch email accounts");
      setEmailAccounts([]);
      return;
    }

    setStatus({ loading: true, error: null });
    console.log(`Fetching email accounts for user ${user.id}`);

    try {
      // Query the email_accounts table directly
      const { data, error } = await supabase
        .from('email_accounts')
        .select('*')
        .eq('user_id', user.id);

      if (error) {
        console.error("Error fetching email accounts:", error);
        setStatus({ loading: false, error: error.message });
        setEmailAccounts([]);
        return;
      }

      console.log("Fetched email accounts:", data);
      setEmailAccounts(data || []);
      setStatus({ loading: false, error: null });
    } catch (err) {
      console.error("Exception fetching email accounts:", err);
      setStatus({ 
        loading: false, 
        error: err instanceof Error ? err.message : "Unknown error" 
      });
      setEmailAccounts([]);
    }
  }, [user]);

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
    setConnectionProcessed
  };
};
