
import { EmailAccount } from "@/lib/supabase";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";

interface AccountSelectorProps {
  accounts: EmailAccount[];
  selectedAccount: string | null;
  onSelectAccount: (accountId: string) => void;
  isDisabled?: boolean;
}

export function AccountSelector({
  accounts,
  selectedAccount,
  onSelectAccount,
  isDisabled = false
}: AccountSelectorProps) {
  return (
    <Card className="p-4 bg-white border shadow-sm">
      <div className="space-y-2">
        <Label htmlFor="email-account" className="text-sm font-medium text-gray-800">
          Select Email Account
        </Label>
        <Select
          value={selectedAccount || ""}
          onValueChange={onSelectAccount}
          disabled={isDisabled || accounts.length === 0}
        >
          <SelectTrigger
            id="email-account"
            className="w-full bg-white border-input text-gray-800"
          >
            <SelectValue placeholder="Select an email account" />
          </SelectTrigger>
          <SelectContent className="bg-white border-input shadow-md text-gray-800">
            {accounts.length === 0 ? (
              <SelectItem value="no-accounts" disabled>
                No email accounts connected
              </SelectItem>
            ) : (
              accounts.map((account) => (
                <SelectItem key={account.id} value={account.id}>
                  {account.email} ({account.provider})
                </SelectItem>
              ))
            )}
          </SelectContent>
        </Select>
      </div>
    </Card>
  );
}
