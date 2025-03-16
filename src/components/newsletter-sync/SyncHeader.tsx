
import { Button } from "@/components/ui/button";
import { CardTitle } from "@/components/ui/card";
import { 
  TooltipProvider, 
  Tooltip, 
  TooltipContent, 
  TooltipTrigger 
} from "@/components/ui/tooltip";
import { RefreshCw, Mail } from "lucide-react";
import { EmailAccount } from "@/lib/supabase";
import { format } from "date-fns";

type SyncHeaderProps = {
  isSyncing: boolean;
  selectedAccount: string | null;
  emailAccounts: EmailAccount[];
  onSync: () => Promise<void>;
};

export function SyncHeader({ isSyncing, selectedAccount, emailAccounts, onSync }: SyncHeaderProps) {
  const getLastSyncTime = () => {
    if (!selectedAccount) return "Never";
    
    const account = emailAccounts.find(acc => acc.id === selectedAccount);
    if (!account || !account.last_sync) return "Never";
    
    try {
      return format(new Date(account.last_sync), "MMM d, yyyy 'at' h:mm a");
    } catch (e) {
      return account.last_sync;
    }
  };

  return (
    <div className="flex items-center justify-between">
      <CardTitle className="flex items-center gap-2">
        <Mail className="h-5 w-5" />
        <span>Email Sync</span>
      </CardTitle>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              variant="default" 
              size="sm" 
              onClick={onSync}
              disabled={isSyncing || !selectedAccount}
              className="gap-2"
            >
              <RefreshCw className={`h-4 w-4 ${isSyncing ? 'animate-spin' : ''}`} />
              {isSyncing ? 'Syncing...' : 'Sync Now'}
            </Button>
          </TooltipTrigger>
          <TooltipContent side="left">
            <p>Last synced: {getLastSyncTime()}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
}
