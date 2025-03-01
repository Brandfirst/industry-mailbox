
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase, EmailAccount } from "@/lib/supabase";
import { getUserEmailAccounts } from "@/lib/supabase/emailAccounts";

interface StatusState {
  loading: boolean;
  error: string | null;
}

export interface EmailConnectionState {
  emailAccounts: EmailAccount[];
  status: StatusState;
  isConnecting: boolean;
  oauthError: string | null;
  errorDetails: any;
  debugInfo: any;
  connectionProcessed: boolean;
  fetchEmailAccounts: () => Promise<void>;
  setIsConnecting: (isConnecting: boolean) => void;
  setOAuthError: (oauthError: string | null) => void;
  setErrorDetails: (errorDetails: any) => void;
  setDebugInfo: (debugInfo: any) => void;
  setConnectionProcessed: (connectionProcessed: boolean) => void;
}

export const useEmailConnectionState = () => {
  const { user } = useAuth();
  const [emailAccounts, setEmailAccounts] = useState<EmailAccount[]>([]);
  const [status, setStatus] = useState({ loading: false, error: null as string | null });
  const [isConnecting, setIsConnecting] = useState(false);
  const [oauthError, setOAuthError] = useState<string | null>(null);
  const [errorDetails, setErrorDetails] = useState<any>(null);
  const [debugInfo, setDebugInfo] = useState<any>(null);
  const [connectionProcessed, setConnectionProcessed] = useState(false);
  
  // Log auth state changes
  useEffect(() => {
    console.log("EmailConnectionState: Auth state changed", {
      userId: user?.id,
      isConnecting,
      oauthError,
      connectionProcessed
    });
  }, [user?.id, isConnecting, oauthError, connectionProcessed]);
  
  // Function to fetch email accounts
  const fetchEmailAccounts = async () => {
    if (!user) {
      console.log("Cannot fetch email accounts: No authenticated user");
      return;
    }
    
    try {
      setStatus({ loading: true, error: null });
      console.log(`Fetching email accounts for user ${user.id}`);
      
      const accounts = await getUserEmailAccounts(user.id);
      console.log("Fetched email accounts:", accounts);
      
      setEmailAccounts(accounts);
      setStatus({ loading: false, error: null });
    } catch (error) {
      console.error("Error fetching email accounts:", error);
      setStatus({ 
        loading: false, 
        error: error instanceof Error ? error.message : "Failed to fetch email accounts" 
      });
    }
  };
  
  // Clean up any existing errors when user changes
  useEffect(() => {
    if (user) {
      setOAuthError(null);
      setErrorDetails(null);
      setDebugInfo(null);
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
