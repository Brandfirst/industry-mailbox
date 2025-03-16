
import React, { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { SyncLogEntry } from "@/lib/supabase/emailAccounts/syncLogs";
import { LogsHeader, LogsContent, LogsTableHeader } from "./components";
import { Skeleton } from "@/components/ui/skeleton";
import { RefreshCcw } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

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
  const [isRefreshing, setIsRefreshing] = useState(false);
  const realtimeChannelRef = useRef<any>(null);
  
  // Force fetch logs when component mounts if logs should be shown
  useEffect(() => {
    if (selectedAccount && showLogs && !initialFetchCompleted.current) {
      console.log("SyncLogsList: Fetching logs on mount/account change");
      fetchSyncLogs();
      initialFetchCompleted.current = true;
    }
  }, [selectedAccount, showLogs, fetchSyncLogs]);
  
  // Reset the ref when selectedAccount changes
  useEffect(() => {
    initialFetchCompleted.current = false;
  }, [selectedAccount]);
  
  // Set up real-time subscription for sync logs
  useEffect(() => {
    if (!selectedAccount || !showLogs) return;
    
    console.log("Setting up real-time subscription for sync logs");
    
    // Clean up any existing subscription first
    if (realtimeChannelRef.current) {
      supabase.removeChannel(realtimeChannelRef.current);
    }
    
    // Subscribe to changes in the email_sync_logs table for this account
    realtimeChannelRef.current = supabase
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
          
          const eventType = payload.eventType;
          
          if (eventType === 'INSERT') {
            // Add the new log at the top of the list
            const newLog = payload.new as SyncLogEntry;
            setSyncLogs(prevLogs => {
              // Check if this log ID already exists to prevent duplicates
              const exists = prevLogs.some(log => log.id === newLog.id);
              if (exists) return prevLogs;
              return [newLog, ...prevLogs];
            });
            
            // Show a toast notification for the new log
            toast.info(`New sync started: ${newLog.status}`, {
              description: `Sync process initiated`
            });
          } else if (eventType === 'UPDATE') {
            // Update the existing log in the list
            const updatedLog = payload.new as SyncLogEntry;
            setSyncLogs(prevLogs => 
              prevLogs.map(log => 
                log.id === updatedLog.id ? updatedLog : log
              )
            );
            
            // Show different toast based on status change
            if (updatedLog.status === 'success') {
              toast.success(`Sync completed: ${updatedLog.message_count} messages`, {
                description: `Sync process finished successfully`
              });
            } else if (updatedLog.status === 'failed') {
              toast.error(`Sync failed`, {
                description: updatedLog.error_message || 'Unknown error'
              });
            }
          } else if (eventType === 'DELETE') {
            // Remove the deleted log from the list
            const deletedLog = payload.old as SyncLogEntry;
            setSyncLogs(prevLogs => 
              prevLogs.filter(log => log.id !== deletedLog.id)
            );
          }
        }
      )
      .subscribe((status) => {
        console.log("Realtime subscription status:", status);
        if (status === 'SUBSCRIBED') {
          console.log("Successfully subscribed to real-time updates for sync logs");
        } else if (status === 'CHANNEL_ERROR') {
          console.error("Error subscribing to real-time updates for sync logs");
        }
      });
    
    // Clean up subscription on unmount
    return () => {
      console.log("Cleaning up real-time subscription");
      if (realtimeChannelRef.current) {
        supabase.removeChannel(realtimeChannelRef.current);
      }
    };
  }, [selectedAccount, showLogs, setSyncLogs]);
  
  const handleRefresh = async () => {
    if (isRefreshing || isLoading) return;
    
    setIsRefreshing(true);
    try {
      await fetchSyncLogs();
    } catch (error) {
      console.error("Error refreshing logs:", error);
    } finally {
      setIsRefreshing(false);
    }
  };
  
  if (!selectedAccount) return null;
  
  return (
    <div className="mt-6">
      <LogsHeader 
        showLogs={showLogs} 
        setShowLogs={setShowLogs} 
        selectedAccount={selectedAccount}
        fetchSyncLogs={fetchSyncLogs}
        isLoading={isLoading}
        isRefreshing={isRefreshing}
        onRefresh={handleRefresh}
      />
      
      {showLogs && (
        <div className="mt-2 border rounded-md overflow-hidden">
          <div className="flex justify-between items-center p-2 bg-muted/40">
            <LogsTableHeader />
            <Button 
              variant="ghost" 
              size="sm"
              onClick={handleRefresh}
              disabled={isLoading || isRefreshing}
              className="ml-auto"
            >
              <RefreshCcw className={`h-4 w-4 mr-1 ${isRefreshing ? 'animate-spin' : ''}`} />
              {isRefreshing ? 'Refreshing...' : 'Refresh'}
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
