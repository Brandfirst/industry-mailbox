import { useState } from "react";
import { Button } from "@/components/ui/button";
import { RefreshCw, Trash2, Mail } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { disconnectEmailAccount, syncEmailAccount } from "@/lib/supabase";
import { EmailAccount, SyncResult } from "./types";

interface EmailAccountItemProps {
  account: EmailAccount;
  onRefresh: () => Promise<void>;
  syncResult: SyncResult | null;
}

export const EmailAccountItem = ({ account, onRefresh, syncResult }: EmailAccountItemProps) => {
  const [isSyncing, setIsSyncing] = useState(false);
  const [isDisconnecting, setIsDisconnecting] = useState(false);
  
  const showSyncBadge = syncResult && 
    (Date.now() - syncResult.timestamp < 30000); // Show for 30 seconds
  
  const handleDisconnect = async () => {
    setIsDisconnecting(true);
    try {
      const result = await disconnectEmailAccount(account.id);
      
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
      setIsDisconnecting(false);
    }
  };

  const handleSync = async () => {
    setIsSyncing(true);
    
    try {
      const result = await syncEmailAccount(account.id);
      
      if (result.success) {
        const syncCount = result.count || 0;
        
        if (syncCount > 0) {
          toast.success(`Successfully synced ${syncCount} newsletter${syncCount === 1 ? '' : 's'}`);
        } else {
          toast.success("Sync completed. No new newsletters found.");
        }
        
        // Refresh the email accounts list to get the updated last_sync time
        onRefresh();
      } else {
        toast.error(`Failed to sync: ${result.error}`);
      }
    } catch (error) {
      console.error("Error syncing email account:", error);
      toast.error("Failed to sync email account");
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <div className="border rounded-lg p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-card">
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
          disabled={isSyncing}
          onClick={handleSync}
          className="text-foreground"
        >
          {isSyncing ? (
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
          disabled={isDisconnecting}
          onClick={handleDisconnect}
          className="border-red-300 hover:bg-red-50"
        >
          <Trash2 className="h-4 w-4 mr-1 text-red-500" />
          Disconnect
        </Button>
      </div>
    </div>
  );
};
