
/**
 * Functions for determining sync status and handling results
 */

/**
 * Determine the sync status based on the results
 */
export function determineSyncStatus(
  result: any[],
  synced: any[],
  failed: any[]
): { status: string; errorMessage: string | null } {
  // Determine if we have emails and failures
  const hasEmails = result.length > 0;
  const hasFailed = failed.length > 0;
  const hasSuccess = synced.length > 0;
  
  // Determine the status based on the results
  let status: string;
  let errorMessage: string | null = null;
  
  if (hasFailed && hasSuccess) {
    status = 'partial';
    errorMessage = 'Some emails failed to sync';
  } else if (hasSuccess) {
    status = 'success';
  } else if (hasFailed) {
    status = 'failed';
    errorMessage = 'All emails failed to sync';
  } else {
    // No emails found - this is still a success
    status = 'success';
  }
  
  return { status, errorMessage };
}

/**
 * Process sync results and prepare response data
 */
export function prepareSyncResponse(
  result: any[], 
  synced: any[], 
  failed: any[], 
  uniqueSenders: Set<string>,
  accountData: any,
  scheduled: boolean
) {
  // Extract sender information for the logs
  const senderEmails = Array.from(uniqueSenders);
  
  return {
    partial: failed.length > 0 && synced.length > 0,
    count: synced.length,
    synced,
    failed: failed.length > 0 ? failed : [],
    details: {
      accountEmail: accountData.email,
      provider: accountData.provider,
      totalEmails: result.length,
      syncedCount: synced.length,
      failedCount: failed.length,
      new_senders_count: uniqueSenders.size,
      senders: senderEmails,
      sync_type: scheduled ? 'scheduled' : 'manual'
    }
  };
}
