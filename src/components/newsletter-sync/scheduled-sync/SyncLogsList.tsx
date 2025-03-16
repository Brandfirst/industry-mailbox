
import React, { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { SyncLogEntry } from "@/lib/supabase/emailAccounts/syncLogs";
import { SyncLogItem } from "./SyncLogItem";
import { LogsHeader, LogsContent, LogsTableHeader } from "./components";
import { Skeleton } from "@/components/ui/skeleton";
import { RefreshCcw } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

type SyncLogsListProps = {
  showLogs: boolean;
  setShowLogs: React.Dispatch<React.SetStateAction<boolean>>;
  isLoading: boolean;
  syncLogs: SyncLogEntry[];
  selectedAccount: string | null;
  fetchSyncLogs: () => Promise<void>;
  formatTimestamp: (timestamp: string) => string;
  setSyncLogs: React.Dispatch<React.SetStateAction<SyncLogEntry[]>>;
};

export function SyncLogsList({
  showLogs,
  setShowLogs,
  isLoading,
  syncLogs,
  selectedAccount,
  fetchSyncLogs,
  formatTimestamp,
  setSyncLogs
}: SyncLogsListProps) {
  const initialFetchCompleted = useRef(false);
  
  // Force fetch logs when component mounts if logs should be shown
  useEffect(() => {
    if (selectedAccount && showLogs && !initialFetchCompleted.current) {
      console.log("SyncLogsList: Fetching logs on mount/account change");
      fetchSyncLogs();
      initialFetchCompleted.current = true;
    }
  }, [selectedAccount, showLogs]);
  
  // Reset the ref when selectedAccount changes
  useEffect(() => {
    initialFetchCompleted.current = false;
  }, [selectedAccount]);
  
  // Set up real-time subscription for sync logs
  useEffect(() => {
    if (!selectedAccount || !showLogs) return;
    
    console.log("Setting up real-time subscription for sync logs");
    
    // Subscribe to changes in the email_sync_logs table for this account
    const channel = supabase
      .channel('sync-logs-changes')
      .on(
        'postgres_changes',
        {
          event: '*', // Listen to all events (INSERT, UPDATE, DELETE)
          schema: 'public',
          table: 'email_sync_logs',
          filter: `account_id=eq.${selectedAccount}`
        },
        (payload) => {
          console.log("Real-time sync log update:", payload);
          
          // Refresh the logs when we get a new event
          fetchSyncLogs();
        }
      )
      .subscribe();
    
    // Clean up subscription on unmount
    return () => {
      console.log("Cleaning up real-time subscription");
      supabase.removeChannel(channel);
    };
  }, [selectedAccount, showLogs]);
  
  if (!selectedAccount) return null;
  
  return (
    <div className="mt-6">
      <LogsHeader 
        showLogs={showLogs} 
        setShowLogs={setShowLogs} 
        selectedAccount={selectedAccount}
        fetchSyncLogs={fetchSyncLogs}
        isLoading={isLoading}
      />
      
      {showLogs && (
        <div className="mt-2 border rounded-md">
          <div className="flex justify-between items-center p-2 bg-muted/40">
            <LogsTableHeader />
            <Button 
              variant="ghost" 
              size="sm"
              onClick={fetchSyncLogs}
              disabled={isLoading}
            >
              <RefreshCcw className="h-4 w-4 mr-1" />
              Refresh
            </Button>
          </div>
          
          {isLoading ? (
            <div className="p-4 space-y-3">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : syncLogs.length > 0 ? (
            <LogsContent
              syncLogs={syncLogs}
              formatTimestamp={formatTimestamp}
            />
          ) : (
            <div className="p-6 text-center text-muted-foreground">
              No sync logs found for this account.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
