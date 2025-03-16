
import React from "react";
import { AccountNotice } from "./AccountNotice";

interface LogsStateDisplayProps {
  selectedAccount: string | null;
  isLoading: boolean;
  isRefreshing: boolean;
  hasLogs: boolean;
  hasFilteredLogs: boolean;
}

export function LogsStateDisplay({
  selectedAccount,
  isLoading,
  isRefreshing,
  hasLogs,
  hasFilteredLogs
}: LogsStateDisplayProps) {
  if (!selectedAccount) {
    return <AccountNotice />;
  }
  
  if (isLoading || isRefreshing) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }
  
  if (!hasFilteredLogs) {
    return (
      <div className="text-center p-8 text-muted-foreground">
        {hasLogs 
          ? "No sync logs match your current filters"
          : "No sync history available yet"}
      </div>
    );
  }
  
  return null;
}
