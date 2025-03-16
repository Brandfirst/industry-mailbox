
import { supabase } from "@/integrations/supabase/client";

/**
 * Add a sync log entry
 */
export async function addSyncLog(logData: {
  account_id: string;
  status: 'success' | 'partial' | 'failed';
  message_count: number;
  error_message?: string | null;
  details?: any;
  timestamp?: string;
}) {
  try {
    // First try to use the RPC function
    const { data, error } = await supabase.rpc('add_sync_log', {
      account_id_param: logData.account_id,
      status_param: logData.status,
      message_count_param: logData.message_count,
      error_message_param: logData.error_message || null,
      details_param: logData.details ? JSON.stringify(logData.details) : null
    });
    
    if (error) {
      console.error("Error adding sync log via RPC:", error);
      
      // Fallback to direct insert if RPC fails
      try {
        const { error: insertError } = await supabase
          .from('email_sync_logs')
          .insert({
            account_id: logData.account_id,
            status: logData.status, 
            message_count: logData.message_count,
            error_message: logData.error_message,
            details: logData.details,
            timestamp: logData.timestamp || new Date().toISOString()
          });
          
        if (insertError) {
          console.error("Error inserting sync log:", insertError);
        }
      } catch (insertCatchError) {
        console.error("Exception during sync log insert:", insertCatchError);
      }
    }
    
    return { success: true };
  } catch (e) {
    console.error("Exception in addSyncLog:", e);
    return { success: false, error: e };
  }
}

/**
 * Get sync logs for an account
 */
export async function getSyncLogs(accountId: string, limit: number = 10) {
  try {
    // First try to use the RPC function
    const { data, error } = await supabase.rpc('get_account_sync_logs', {
      account_id_param: accountId,
      limit_param: limit
    });
    
    if (error) {
      console.error("Error getting sync logs via RPC:", error);
      
      // Fallback to direct query if RPC fails
      const { data: queryData, error: queryError } = await supabase
        .from('email_sync_logs')
        .select('*')
        .eq('account_id', accountId)
        .order('timestamp', { ascending: false })
        .limit(limit);
        
      if (queryError) {
        console.error("Error querying sync logs:", queryError);
        return { logs: [], error: queryError };
      }
      
      return { logs: queryData || [] };
    }
    
    return { logs: data || [] };
  } catch (e) {
    console.error("Exception in getSyncLogs:", e);
    return { logs: [], error: e };
  }
}
