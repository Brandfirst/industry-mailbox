
import { useCallback, useState } from "react";
import { getUserEmailAccounts } from "@/lib/supabase/emailAccounts";
import { EmailAccount } from "@/lib/supabase/types";

export const useEmailAccountsFetching = (userId: string | undefined) => {
  const [emailAccounts, setEmailAccounts] = useState<EmailAccount[]>([]);
  const [status, setStatus] = useState<{ loading: boolean; error: string | null }>({ 
    loading: false, 
    error: null 
  });

  // Fetch email accounts from the database
  const fetchEmailAccounts = useCallback(async () => {
    if (!userId) {
      console.log("No user, can't fetch email accounts");
      setEmailAccounts([]);
      return;
    }

    setStatus({ loading: true, error: null });
    console.log(`Fetching email accounts for user ${userId}`);

    try {
      // Use the imported function to get email accounts
      const data = await getUserEmailAccounts(userId);

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
  }, [userId]);

  return { emailAccounts, status, fetchEmailAccounts };
};
