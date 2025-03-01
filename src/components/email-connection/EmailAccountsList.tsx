
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { RefreshCw, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { disconnectEmailAccount, syncEmailAccount } from "@/lib/supabase";

interface EmailAccount {
  id: string;
  email: string;
  created_at: string;
  last_sync: string | null;
}

interface EmailAccountsListProps {
  emailAccounts: EmailAccount[];
  onRefresh: () => Promise<void>;
}

export const EmailAccountsList = ({ emailAccounts, onRefresh }: EmailAccountsListProps) => {
  const [isSyncing, setIsSyncing] = useState<string | null>(null);
  const [isDisconnecting, setIsDisconnecting] = useState<string | null>(null);

  const handleDisconnect = async (accountId: string) => {
    setIsDisconnecting(accountId);
    try {
      const result = await disconnectEmailAccount(accountId);
      
      if (result.success) {
        toast.success("Email account disconnected");
        // Refresh the email accounts list
        onRefresh();
      } else {
        toast.error(`Failed to disconnect: ${result.error}`);
      }
    } catch (error) {
      console.error("Error disconnecting email account:", error);
      toast.error("Failed to disconnect email account");
    } finally {
      setIsDisconnecting(null);
    }
  };

  const handleSync = async (accountId: string) => {
    setIsSyncing(accountId);
    try {
      const result = await syncEmailAccount(accountId);
      
      if (result.success) {
        toast.success("Email account synced successfully");
        // Refresh the email accounts list to get the updated last_sync time
        onRefresh();
      } else {
        toast.error(`Failed to sync: ${result.error}`);
      }
    } catch (error) {
      console.error("Error syncing email account:", error);
      toast.error("Failed to sync email account");
    } finally {
      setIsSyncing(null);
    }
  };

  return (
    <div className="space-y-4">
      {emailAccounts.map((account) => (
        <div 
          key={account.id} 
          className="border rounded-lg p-4 flex items-center justify-between bg-card"
        >
          <div>
            <div className="font-medium text-card-foreground">{account.email}</div>
            <div className="text-sm text-muted-foreground">
              Connected {new Date(account.created_at).toLocaleDateString()}
            </div>
            <div className="text-xs text-muted-foreground">
              Last sync: {account.last_sync ? new Date(account.last_sync).toLocaleString() : 'Never'}
            </div>
          </div>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm"
              disabled={isSyncing === account.id}
              onClick={() => handleSync(account.id)}
              className="text-foreground"
            >
              {isSyncing === account.id ? (
                <RefreshCw className="h-4 w-4 mr-1 animate-spin" />
              ) : (
                <RefreshCw className="h-4 w-4 mr-1" />
              )}
              Sync
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              disabled={isDisconnecting === account.id}
              onClick={() => handleDisconnect(account.id)}
              className="border-red-300 hover:bg-red-50"
            >
              <Trash2 className="h-4 w-4 mr-1 text-red-500" />
              Disconnect
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
};
