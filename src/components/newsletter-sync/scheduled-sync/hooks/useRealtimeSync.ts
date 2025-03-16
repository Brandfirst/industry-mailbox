
import { useEffect, useRef, useState } from "react";
import { SyncLogEntry } from "@/lib/supabase/emailAccounts/syncLogs";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export function useRealtimeSync(
  selectedAccount: string | null,
  showLogs: boolean,
  setSyncLogs: React.Dispatch<React.SetStateAction<SyncLogEntry[]>>
) {
  const realtimeChannelRef = useRef<any>(null);
  
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
  
  return realtimeChannelRef;
}
