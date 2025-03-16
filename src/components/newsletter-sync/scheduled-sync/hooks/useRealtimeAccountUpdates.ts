
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

/**
 * Sets up a real-time subscription for account settings changes
 */
export function useRealtimeAccountUpdates({
  selectedAccount,
  refreshLogs
}: {
  selectedAccount: string | null;
  refreshLogs: () => Promise<void>;
}) {
  // Subscribe to real-time updates for the selected account
  useEffect(() => {
    if (!selectedAccount) return;
    
    console.log("Setting up real-time subscription for account settings");
    
    const channel = supabase
      .channel('account-settings-changes')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'email_accounts',
          filter: `id=eq.${selectedAccount}`
        },
        (payload) => {
          console.log("Real-time account settings update:", payload);
          
          // If sync_settings was updated, refresh the sync logs
          if (payload.new && payload.new.sync_settings !== payload.old?.sync_settings) {
            refreshLogs();
          }
        }
      )
      .subscribe();
    
    // Clean up subscription on unmount
    return () => {
      console.log("Cleaning up real-time subscription for account settings");
      supabase.removeChannel(channel);
    };
  }, [selectedAccount, refreshLogs]);
}
