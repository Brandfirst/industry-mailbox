
import { addSyncLog } from '../syncLogs';

/**
 * Log successful sync with partial success
 */
export function logPartialSync(accountId: string, response: any, syncDetails: any): void {
  console.warn("Partial sync completed with some errors:", response.data);
  
  // Log the partial sync success
  addSyncLog({
    account_id: accountId,
    status: 'success',
    message_count: response.data.count || 0,
    error_message: "Some emails failed to sync",
    details: syncDetails,
    timestamp: new Date().toISOString()
  });
}

/**
 * Log successful sync
 */
export function logSuccessfulSync(accountId: string, response: any, syncDetails: any): void {
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
    timestamp: new Date().toISOString()
  });

  // Log completion
  console.log("Sync completed successfully:", response.data);
}
