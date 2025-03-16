
import { supabase } from "@/integrations/supabase/client";
import { SyncLogEntry } from "./types";

/**
 * Retrieves sync logs for a specific account
 */
export async function getSyncLogs(accountId: string, limit: number = 20): Promise<SyncLogEntry[]> {
  try {
    // Get sync logs for the account
    const { data, error } = await supabase
      .from("email_sync_logs")
      .select(`
        *,
        account:account_id (
          id,
          email
        )
      `)
      .eq("account_id", accountId)
      .order("timestamp", { ascending: false })
      .limit(limit);

    if (error) throw error;

    // Add account email to details for easier access in components
    const logsWithEmailInfo = data.map(log => {
      // Create a properly typed log entry
      const typedLog: SyncLogEntry = {
        id: log.id,
        account_id: log.account_id,
        timestamp: log.timestamp,
        message_count: log.message_count,
        status: log.status as "scheduled" | "processing" | "success" | "failed" | "partial",
        error_message: log.error_message,
        details: log.details ? { ...log.details } : null,
        sync_type: log.sync_type as "manual" | "scheduled",
        account: log.account
      };
      
      // Add account email to details if available
      if (typedLog.account?.email && typedLog.details) {
        typedLog.details = {
          ...(typedLog.details || {}),
          accountEmail: typedLog.account.email
        };
      }
      
      return typedLog;
    });

    return logsWithEmailInfo;
  } catch (error) {
    console.error("Error fetching sync logs:", error);
    throw error;
  }
}
