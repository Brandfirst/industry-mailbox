
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { RefreshCw, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";
import { EmailAccount, SyncResult } from "./types";

interface EmailAccountItemProps {
  account: EmailAccount;
  onDisconnect: (accountId: string) => Promise<void>;
  onSync: (accountId: string) => Promise<SyncResult | null>;
  isSyncing: boolean;
  isDisconnecting: boolean;
}

export const EmailAccountItem = ({
  account,
  onDisconnect,
  onSync,
  isSyncing,
  isDisconnecting
}: EmailAccountItemProps) => {
  const [syncCount, setSyncCount] = useState(0);
  const [lastSyncTime, setLastSyncTime] = useState<number | null>(
    account.last_sync ? new Date(account.last_sync).getTime() : null
  );

  const handleSync = async () => {
    try {
      const result = await onSync(account.id);
      if (result) {
        setSyncCount(result.count);
        setLastSyncTime(result.timestamp);
      }
    } catch (error) {
      console.error("Error syncing account:", error);
      toast.error("Failed to sync account");
    }
  };

  const handleDisconnect = async () => {
    if (window.confirm(`Are you sure you want to disconnect ${account.email}?`)) {
      try {
        console.log(`Initiating disconnection of account: ${account.id} (${account.email})`);
        await onDisconnect(account.id);
        console.log(`Disconnection completed for: ${account.email}`);
        toast.success(`Successfully disconnected ${account.email}`);
      } catch (error) {
        console.error("Error disconnecting account:", error);
        toast.error(`Failed to disconnect ${account.email}`);
      }
    }
  };

  const formattedLastSync = lastSyncTime
    ? `Last sync: ${formatDistanceToNow(lastSyncTime, { addSuffix: true })}`
    : "Never synced";

  const syncResult = syncCount > 0 
    ? `${syncCount} newsletters synced`
    : "";

  return (
    <div className="border rounded-lg p-4 flex items-center justify-between">
      <div>
        <div className="font-medium">{account.email}</div>
        <div className="text-sm text-muted-foreground">
          Connected {formatDistanceToNow(new Date(account.created_at), { addSuffix: true })}
        </div>
        <div className="text-xs text-muted-foreground">
          {formattedLastSync}
          {syncResult && <span className="ml-2">({syncResult})</span>}
        </div>
      </div>
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={handleSync}
          disabled={isSyncing}
        >
          <RefreshCw className={`h-4 w-4 mr-1 ${isSyncing ? "animate-spin" : ""}`} />
          Sync
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={handleDisconnect}
          disabled={isDisconnecting}
        >
          <Trash2 className="h-4 w-4 mr-1 text-red-500" />
          Disconnect
        </Button>
      </div>
    </div>
  );
};
