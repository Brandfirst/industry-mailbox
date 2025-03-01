
import { EmailAccount } from "@/lib/supabase";
import { Calendar } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { formatDistanceToNow } from "date-fns";

type AccountSelectorProps = {
  accounts: EmailAccount[];
  selectedAccount: string | null;
  onSelectAccount: (accountId: string) => void;
  isDisabled: boolean;
};

export function AccountSelector({ accounts, selectedAccount, onSelectAccount, isDisabled }: AccountSelectorProps) {
  const getLastSyncTime = () => {
    if (!selectedAccount) return "Never";
    
    const account = accounts.find(acc => acc.id === selectedAccount);
    if (!account || !account.last_sync) return "Never";
    
    return formatDistanceToNow(new Date(account.last_sync), { addSuffix: true });
  };

  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
      <Select
        value={selectedAccount || "no-account"}
        onValueChange={onSelectAccount}
        disabled={isDisabled}
      >
        <SelectTrigger className="w-full sm:w-72">
          <SelectValue placeholder="Select email account" />
        </SelectTrigger>
        <SelectContent>
          {accounts.map((account) => (
            <SelectItem key={account.id} value={account.id}>
              {account.email} ({account.provider})
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      
      <div className="text-sm text-muted-foreground">
        <Calendar className="inline-block mr-1 h-4 w-4" />
        Last synced: {getLastSyncTime()}
      </div>
    </div>
  );
}
