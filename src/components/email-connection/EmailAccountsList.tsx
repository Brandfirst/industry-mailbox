
import { useState } from "react";
import { EmailAccountItem } from "./EmailAccountItem";
import { EmailAccount } from "@/lib/supabase/types";
import { disconnectEmailAccount, syncEmailAccount } from "@/lib/supabase/emailAccounts";
import { toast } from "sonner";

interface EmailAccountsListProps {
  emailAccounts: EmailAccount[];
  onRefresh: () => Promise<void>;
}

export const EmailAccountsList = ({ emailAccounts, onRefresh }: EmailAccountsListProps) => {
  const [syncingAccount, setSyncingAccount] = useState<string | null>(null);
  const [disconnectingAccount, setDisconnectingAccount] = useState<string | null>(null);
  const [syncErrors, setSyncErrors] = useState<Record<string, string>>({});

  const handleSync = async (accountId: string) => {
    if (syncingAccount) return null; // Prevent multiple syncs
    
    setSyncingAccount(accountId);
    setSyncErrors(prev => ({ ...prev, [accountId]: null }));
    console.log("Syncing account:", accountId);
    
    try {
      const result = await syncEmailAccount(accountId);
      console.log("Sync result:", result);
      
      if (result.success) {
        if (result.count > 0) {
          toast.success(`Successfully synced ${result.count} emails`);
        } else {
          toast.success("Sync completed, but no new emails were found");
        }
        
        await onRefresh(); // Refresh the accounts list
        return result;
      } else {
        console.error("Sync error:", result.error);
        setSyncErrors(prev => ({ 
          ...prev, 
          [accountId]: result.error || "Unknown error" 
        }));
        
        // Give a more friendly message for connection errors
        const errorMessage = result.error?.includes("Failed to send a request") 
          ? "Connection issue with sync service. Please try again later."
          : `Failed to sync: ${result.error}`;
          
        toast.error(errorMessage);
        return null;
      }
    } catch (error) {
      console.error("Exception during sync:", error);
      const errorMsg = error instanceof Error ? error.message : String(error);
      
      setSyncErrors(prev => ({ 
        ...prev, 
        [accountId]: errorMsg
      }));
      
      toast.error("An error occurred during sync");
      return null;
    } finally {
      setSyncingAccount(null);
    }
  };

  const handleDisconnect = async (accountId: string) => {
    if (disconnectingAccount) return; // Prevent multiple disconnects
    
    setDisconnectingAccount(accountId);
    console.log("Disconnecting account:", accountId);
    
    try {
      const result = await disconnectEmailAccount(accountId);
      if (result.success) {
        toast.success("Successfully disconnected account");
        await onRefresh(); // Refresh the accounts list
      } else {
        console.error("Disconnect error:", result.error);
        toast.error(`Failed to disconnect: ${result.error}`);
      }
    } catch (error) {
      console.error("Exception during disconnect:", error);
      toast.error("An error occurred while disconnecting");
    } finally {
      setDisconnectingAccount(null);
    }
  };

  return (
    <div className="space-y-4">
      {emailAccounts.map((account) => (
        <EmailAccountItem 
          key={account.id}
          account={{
            id: account.id,
            email: account.email,
            last_sync: account.last_sync,
            provider: account.provider || 'unknown' // Provide a default value if provider is undefined
          }}
          onDelete={handleDisconnect}
          onSync={handleSync}
          isSyncing={syncingAccount === account.id}
          isDisconnecting={disconnectingAccount === account.id}
        />
      ))}
    </div>
  );
};
