
import { EmailAccount } from "@/lib/supabase";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Mail } from "lucide-react";

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
    <Card>
      <CardContent className="pt-6">
        <div className="space-y-2">
          <Label htmlFor="email-account" className="flex items-center gap-2">
            <Mail className="h-4 w-4" />
            Select Email Account
          </Label>
          <Select
            value={selectedAccount || ""}
            onValueChange={onSelectAccount}
            disabled={isDisabled || accounts.length === 0}
          >
            <SelectTrigger
              id="email-account"
              className="w-full"
            >
              <SelectValue placeholder="Select an email account" />
            </SelectTrigger>
            <SelectContent>
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
      </CardContent>
    </Card>
  );
}
