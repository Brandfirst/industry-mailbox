
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { RefreshCw, Trash2, Mail } from "lucide-react";
import { toast } from "sonner";
import { disconnectEmailAccount, syncEmailAccount } from "@/lib/supabase";
import { Badge } from "@/components/ui/badge";

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
  const [syncResults, setSyncResults] = useState<Record<string, { count: number, timestamp: number } | null>>({});

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
    setSyncResults(prev => ({ ...prev, [accountId]: null }));
    
    try {
      const result = await syncEmailAccount(accountId);
      
      if (result.success) {
        const syncCount = result.count || 0;
        setSyncResults(prev => ({ 
          ...prev, 
          [accountId]: { 
            count: syncCount, 
            timestamp: Date.now() 
          }
        }));
        
        if (syncCount > 0) {
          toast.success(`Successfully synced ${syncCount} newsletter${syncCount === 1 ? '' : 's'}`);
        } else {
          toast.success("Sync completed. No new newsletters found.");
        }
        
        // Refresh the email accounts list to get the updated last_sync time
        onRefresh();
      } else {
        toast.error(`Failed to sync: ${result.error}`);
        setSyncResults(prev => ({ ...prev, [accountId]: null }));
      }
    } catch (error) {
      console.error("Error syncing email account:", error);
      toast.error("Failed to sync email account");
      setSyncResults(prev => ({ ...prev, [accountId]: null }));
    } finally {
      setIsSyncing(null);
    }
  };

  return (
    <div className="space-y-4">
      {emailAccounts.map((account) => {
        const syncResult = syncResults[account.id];
        const showSyncBadge = syncResult && 
          (Date.now() - syncResult.timestamp < 30000); // Show for 30 seconds
        
        return (
          <div 
            key={account.id} 
            className="border rounded-lg p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-card"
          >
            <div>
              <div className="font-medium text-card-foreground flex items-center gap-2">
                <Mail className="h-4 w-4" />
                {account.email}
                {showSyncBadge && (
                  <Badge variant="outline" className="ml-2 bg-green-50 text-green-700 border-green-200">
                    {syncResult.count} newsletter{syncResult.count === 1 ? '' : 's'} synced
                  </Badge>
                )}
              </div>
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
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Syncing...
                  </>
                ) : (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Sync
                  </>
                )}
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
        );
      })}
    </div>
  );
};
