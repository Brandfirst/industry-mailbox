
import { addSyncLog } from '../syncLogs';

/**
 * Log successful sync with partial success
 */
export function logPartialSync(accountId: string, response: any, syncDetails: any, syncType: 'manual' | 'scheduled' = 'manual'): void {
  console.warn("Partial sync completed with some errors:", response.data);
  
  // Log the partial sync success
  addSyncLog({
    account_id: accountId,
    status: 'partial',
    message_count: response.data.count || 0,
    error_message: "Some emails failed to sync",
    details: syncDetails,
    timestamp: new Date().toISOString(),
    sync_type: syncType
  });
}

/**
 * Log successful sync
 */
export function logSuccessfulSync(accountId: string, response: any, syncDetails: any, syncType: 'manual' | 'scheduled' = 'manual'): void {
  // Log what was synced in detail
  if (response.data.synced && response.data.synced.length) {
    console.log(`Synced ${response.data.synced.length} emails: `, 
      response.data.synced.map((n: any) => ({
        subject: n.subject || n.title,
        sender: n.sender || n.sender_email,
        date: n.date || n.published_at
      }))
    );
  } else {
    console.log("No emails were synced. Function returned success but empty array.");
    console.log("Debug info:", response.data.debugInfo || "No debug info available");
  }

  // Log the successful sync
  addSyncLog({
    account_id: accountId,
    status: 'success',
    message_count: response.data.count || 0,
    details: syncDetails,
    timestamp: new Date().toISOString(),
    sync_type: syncType
  });

  // Log completion
  console.log(`${syncType.charAt(0).toUpperCase() + syncType.slice(1)} sync completed successfully:`, response.data);
}

/**
 * Log failed sync
 */
export function logFailedSync(accountId: string, error: any, syncType: 'manual' | 'scheduled' = 'manual'): void {
  console.error(`${syncType.charAt(0).toUpperCase() + syncType.slice(1)} sync failed:`, error);
  
  // Log the failed sync
  addSyncLog({
    account_id: accountId,
    status: 'failed',
    message_count: 0,
    error_message: error.message || String(error),
    timestamp: new Date().toISOString(),
    sync_type: syncType
  });
}

/**
 * Log scheduled sync creation
 */
export function logScheduledSync(accountId: string, scheduleType: string, hour?: number): void {
  console.log(`Scheduled sync created for account ${accountId}: ${scheduleType}${hour !== undefined ? ` at ${hour}:00` : ''}`);
  
  // Log the scheduled sync
  addSyncLog({
    account_id: accountId,
    status: 'scheduled',
    message_count: 0,
    details: { schedule_type: scheduleType, hour },
    timestamp: new Date().toISOString(),
    sync_type: 'scheduled'
  });
}

/**
 * Log scheduled sync attempt
 */
export function logScheduledSyncAttempt(accountId: string): void {
  console.log(`Scheduled sync attempt for account ${accountId}`);
  
  // Log the scheduled sync attempt
  addSyncLog({
    account_id: accountId,
    status: 'processing',
    message_count: 0,
    details: { attempt_time: new Date().toISOString() },
    timestamp: new Date().toISOString(),
    sync_type: 'scheduled'
  });
}
