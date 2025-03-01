
import { useState } from "react";
import { EmailAccountItem } from "./EmailAccountItem";
import { EmailAccount, SyncResult } from "./types";

interface EmailAccountsListProps {
  emailAccounts: EmailAccount[];
  onRefresh: () => Promise<void>;
}

export const EmailAccountsList = ({ emailAccounts, onRefresh }: EmailAccountsListProps) => {
  const [syncResults, setSyncResults] = useState<Record<string, SyncResult | null>>({});

  // Update sync results (called from EmailAccountItem after successful sync)
  const updateSyncResult = (accountId: string, count: number) => {
    setSyncResults(prev => ({ 
      ...prev, 
      [accountId]: { 
        count, 
        timestamp: Date.now() 
      }
    }));
  };

  return (
    <div className="space-y-4">
      {emailAccounts.map((account) => (
        <EmailAccountItem 
          key={account.id}
          account={account}
          onRefresh={async () => {
            // When an account is refreshed, update its sync result
            updateSyncResult(account.id, syncResults[account.id]?.count || 0);
            await onRefresh();
          }}
          syncResult={syncResults[account.id]}
        />
      ))}
    </div>
  );
};
