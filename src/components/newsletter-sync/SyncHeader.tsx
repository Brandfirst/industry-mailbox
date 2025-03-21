
import { Button } from "@/components/ui/button";
import { CardTitle } from "@/components/ui/card";
import { TooltipProvider, Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { RefreshCw, RotateCw } from "lucide-react";
import { EmailAccount } from "@/lib/supabase";

type SyncHeaderProps = {
  isSyncing: boolean;
  selectedAccount: string | null;
  emailAccounts: EmailAccount[];
  onSync: () => Promise<void>;
  onUpdateEmails?: () => Promise<void>;
};

export function SyncHeader({ isSyncing, selectedAccount, emailAccounts, onSync, onUpdateEmails }: SyncHeaderProps) {
  const getLastSyncTime = () => {
    if (!selectedAccount) return "Never";
    
    const account = emailAccounts.find(acc => acc.id === selectedAccount);
    if (!account || !account.last_sync) return "Never";
    
    return account.last_sync;
  };

  return (
    <CardTitle className="flex items-center justify-between text-gray-800">
      <span>Email Sync</span>
      <div className="flex space-x-2">
        {onUpdateEmails && (
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onUpdateEmails}
            disabled={isSyncing || !selectedAccount}
            className="bg-white border-[#FF5722]/30 text-gray-800"
          >
            <RotateCw className={`mr-2 h-4 w-4 ${isSyncing ? 'animate-spin' : ''}`} />
            Update Emails
          </Button>
        )}
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={onSync}
                disabled={isSyncing || !selectedAccount}
                className="bg-white border-[#FF5722]/30 text-gray-800"
              >
                <RefreshCw className={`mr-2 h-4 w-4 ${isSyncing ? 'animate-spin' : ''}`} />
                Sync Now
              </Button>
            </TooltipTrigger>
            <TooltipContent className="bg-white text-gray-800">
              <p>Last synced: {getLastSyncTime()}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </CardTitle>
  );
}
