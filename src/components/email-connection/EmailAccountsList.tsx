
import { useState } from "react";
import { EmailAccountItem } from "./EmailAccountItem";
import { EmailAccount } from "./types";
import { disconnectEmailAccount, syncEmailAccount } from "@/lib/supabase";
import { toast } from "sonner";

interface EmailAccountsListProps {
  emailAccounts: EmailAccount[];
  onRefresh: () => Promise<void>;
}

export const EmailAccountsList = ({ emailAccounts, onRefresh }: EmailAccountsListProps) => {
  const [syncingAccount, setSyncingAccount] = useState<string | null>(null);
  const [disconnectingAccount, setDisconnectingAccount] = useState<string | null>(null);

  const handleSync = async (accountId: string) => {
    if (syncingAccount) return null; // Prevent multiple syncs
    
    setSyncingAccount(accountId);
    console.log("Syncing account:", accountId);
    
    try {
      const result = await syncEmailAccount(accountId);
      console.log("Sync result:", result);
      
      if (result.success) {
        toast.success("Successfully synced emails");
        await onRefresh(); // Refresh the accounts list
        return result;
      } else {
        console.error("Sync error:", result.error);
        toast.error(`Failed to sync: ${result.error}`);
        return null;
      }
    } catch (error) {
      console.error("Exception during sync:", error);
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
          account={account}
          onDisconnect={handleDisconnect}
          onSync={handleSync}
          isSyncing={syncingAccount === account.id}
          isDisconnecting={disconnectingAccount === account.id}
        />
      ))}
    </div>
  );
};
