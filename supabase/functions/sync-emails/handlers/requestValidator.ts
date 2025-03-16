
import { SyncRequestData } from '../types.ts';

/**
 * Validates sync request data
 * @param requestData The request data to validate
 * @returns Object containing validation result and error message if any
 */
export function validateSyncRequest(requestData: SyncRequestData): { 
  isValid: boolean; 
  error?: string;
} {
  // Check if accountId exists
  if (!requestData.accountId) {
    console.error('No accountId provided');
    return { 
      isValid: false, 
      error: 'No account ID provided' 
    };
  }
  
  // If we get here, the request is valid
  return { isValid: true };
}

/**
 * Log request details for debugging
 * @param requestData The request data to log
 */
export function logRequestDetails(requestData: SyncRequestData): void {
  const { 
    accountId, 
    debug = false, 
    verbose = false, 
    import_all_emails = true,
    scheduled = false
  } = requestData;
  
  console.log(`Starting ${scheduled ? 'scheduled' : 'manual'} sync for account ${accountId} with debug=${debug}, verbose=${verbose}, import_all_emails=${import_all_emails}`);
}
