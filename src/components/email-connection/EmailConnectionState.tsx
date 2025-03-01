import { useState, useCallback } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { getUserEmailAccounts } from "@/lib/supabase";
import { toast } from "sonner";
import { EmailAccount } from "./types";

interface EmailConnectionState {
  emailAccounts: EmailAccount[];
  status: {
    loading: boolean;
    error: string | null;
  };
  isConnecting: boolean;
  oauthError: string | null;
  errorDetails: any;
  debugInfo: any;
  connectionProcessed: boolean;
  fetchEmailAccounts: () => Promise<void>;
  setIsConnecting: (isConnecting: boolean) => void;
  setOAuthError: (error: string | null) => void;
  setErrorDetails: (details: any) => void;
  setDebugInfo: (info: any) => void;
  setConnectionProcessed: (processed: boolean) => void;
}

export const useEmailConnectionState = (): EmailConnectionState => {
  const { user } = useAuth();
  const [emailAccounts, setEmailAccounts] = useState<EmailAccount[]>([]);
  const [status, setStatus] = useState({ 
    loading: false, 
    error: null 
  });
  const [isConnecting, setIsConnecting] = useState(false);
  const [oauthError, setOAuthError] = useState<string | null>(null);
  const [errorDetails, setErrorDetails] = useState<any>(null);
  const [debugInfo, setDebugInfo] = useState<any>(null);
  const [connectionProcessed, setConnectionProcessed] = useState(false);

  const fetchEmailAccounts = useCallback(async () => {
    if (!user) return;
    
    console.log("Fetching email accounts for user", user.id);
    setStatus({ loading: true, error: null });
    
    try {
      const accounts = await getUserEmailAccounts(user.id);
      console.log("Fetched email accounts:", accounts);
      
      setEmailAccounts(accounts || []);
      setStatus({ loading: false, error: null });
    } catch (error) {
      console.error("Error fetching email accounts:", error);
      
      toast.error("Failed to load email accounts");
      setEmailAccounts([]);
      setStatus({ loading: false, error: error instanceof Error ? error.message : String(error) });
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
