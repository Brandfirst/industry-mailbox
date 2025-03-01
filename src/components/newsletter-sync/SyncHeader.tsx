
import { Button } from "@/components/ui/button";
import { CardTitle } from "@/components/ui/card";
import { TooltipProvider, Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { RefreshCw } from "lucide-react";
import { EmailAccount } from "@/lib/supabase";

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
    
    return account.last_sync;
  };

  return (
    <CardTitle className="flex items-center justify-between">
      <span>Newsletter Sync</span>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={onSync}
              disabled={isSyncing || !selectedAccount}
            >
              <RefreshCw className={`mr-2 h-4 w-4 ${isSyncing ? 'animate-spin' : ''}`} />
              Sync Now
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Last synced: {getLastSyncTime()}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </CardTitle>
  );
}
