
/**
 * Functions for managing sync log entries
 */

/**
 * Create or update a sync log entry
 */
export async function createOrUpdateSyncLog(
  supabase: any, 
  params: {
    sync_log_id: string | null;
    accountId: string;
    status: string;
    synced: any[];
    failed: any[];
    uniqueSenders: Set<string>;
    senderEmails: string[];
    accountEmail: string;
    errorMessage: string | null;
  }
) {
  const { 
    sync_log_id, 
    accountId, 
    status, 
    synced, 
    failed,
    uniqueSenders,
    senderEmails,
    accountEmail,
    errorMessage
  } = params;
  
  const logDetails = {
    total_emails: synced.length + failed.length,
    synced_count: synced.length,
    failed_count: failed.length,
    new_senders_count: uniqueSenders.size,
    senders: senderEmails,
    accountEmail
  };
  
  if (sync_log_id) {
    // Update existing log entry
    await supabase
      .from('email_sync_logs')
      .update({
        status: status,
        message_count: synced.length,
        error_message: errorMessage,
        details: logDetails,
        sync_type: 'scheduled'
      })
      .eq('id', sync_log_id);
    console.log(`Updated completion log entry ${sync_log_id} for scheduled sync of account ${accountId} with status ${status}`);
  } else {
    // Create new log entry
    await supabase.rpc('add_sync_log', {
      account_id_param: accountId,
      status_param: status,
      message_count_param: synced.length,
      error_message_param: errorMessage,
      details_param: logDetails,
      sync_type_param: 'scheduled'
    });
    console.log(`Created completion log entry for scheduled sync of account ${accountId} with status ${status}`);
  }
}

/**
 * Create a failure log entry
 */
export async function createFailureLog(
  supabase: any,
  accountId: string,
  sync_log_id: string | null,
  errorMessage: string
) {
  if (sync_log_id) {
    // Update existing log entry
    await supabase
      .from('email_sync_logs')
      .update({
        status: 'failed',
        message_count: 0,
        error_message: errorMessage,
        sync_type: 'scheduled'
      })
      .eq('id', sync_log_id);
    console.log(`Updated failure log entry ${sync_log_id} for scheduled sync of account ${accountId}`);
  } else {
    // Create new log entry
    await supabase.rpc('add_sync_log', {
      account_id_param: accountId,
      status_param: 'failed',
      message_count_param: 0,
      error_message_param: errorMessage,
      details_param: null,
      sync_type_param: 'scheduled'
    });
    console.log(`Created failure log entry for scheduled sync of account ${accountId}`);
  }
}
