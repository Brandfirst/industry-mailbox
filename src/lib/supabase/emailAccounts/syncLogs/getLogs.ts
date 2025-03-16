
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
      if (log.account?.email && log.details) {
        return {
          ...log,
          details: {
            ...log.details,
            accountEmail: log.account.email
          }
        };
      }
      return log;
    });

    return logsWithEmailInfo;
  } catch (error) {
    console.error("Error fetching sync logs:", error);
    throw error;
  }
}
