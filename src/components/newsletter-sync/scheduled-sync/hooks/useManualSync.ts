
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

/**
 * Handles manual triggering of sync operations
 */
export async function triggerManualMinuteSync({
  selectedAccount,
  isEnabled,
  scheduleOption,
  refreshLogs
}: {
  selectedAccount: string | null;
  isEnabled: boolean;
  scheduleOption: string;
  refreshLogs: () => Promise<void>;
}) {
  if (!selectedAccount || !isEnabled || scheduleOption !== "minute") {
    return;
  }
  
  try {
    // Find the most recent log for the account
    const { data: logs } = await supabase
      .from('email_sync_logs')
      .select('id')
      .eq('account_id', selectedAccount)
      .eq('status', 'processing')
      .order('timestamp', { ascending: false })
      .limit(1);
    
    const existingLogId = logs && logs.length > 0 ? logs[0].id : null;
    
    // Call the scheduled-sync function directly with forceRun set to true
    const { data, error } = await supabase.functions.invoke("scheduled-sync", {
      body: { 
        forceRun: true, 
        manual: true,
        accountId: selectedAccount,
        sync_log_id: existingLogId
      }
    });
    
    if (error) {
      console.error("Error manually triggering sync:", error);
      toast.error("Failed to trigger manual sync");
      return;
    }
    
    console.log("Manual sync trigger response:", data);
    toast.success("Manual sync triggered successfully");
    
    // Refresh logs after a delay to see the results
    setTimeout(() => {
      refreshLogs();
    }, 3000);
  } catch (error) {
    console.error("Exception in manual sync trigger:", error);
    toast.error("Error triggering manual sync");
  }
}
