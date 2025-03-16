
import React from 'react';
import { AlertCircle } from 'lucide-react';

export interface AccountNoticeProps {
  selectedAccount?: string | null;
}

export function AccountNotice({ selectedAccount }: AccountNoticeProps) {
  return (
    <div className="flex items-center justify-center p-6 text-center text-muted-foreground">
      <AlertCircle className="h-4 w-4 mr-2 text-yellow-500" />
      <span>Please select an account to view sync history</span>
    </div>
  );
}
