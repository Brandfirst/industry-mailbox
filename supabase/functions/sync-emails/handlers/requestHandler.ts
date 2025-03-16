
import { corsHeaders } from '../../_shared/cors.ts';
import { handleEmailAccount } from './accountHandler.ts';
import { processAccountEmails } from './syncProcessor.ts';
import { createSuccessResponse, createErrorResponse } from './responseHandler.ts';
import { createFailureLog } from './logManager.ts';
import { SyncRequestData } from '../types.ts';
import { validateSyncRequest, logRequestDetails } from './requestValidator.ts';
import { createSupabaseClient } from './clientFactory.ts';

/**
 * Main handler for sync email requests
 */
export async function handleSyncRequest(req: Request): Promise<Response> {
  try {
    // Parse request body
    const requestData = await req.json() as SyncRequestData;
    
    // Validate request
    const { isValid, error } = validateSyncRequest(requestData);
    if (!isValid) {
      return createErrorResponse(error || 'Invalid request');
    }
    
    // Extract request parameters with defaults
    const { 
      accountId, 
      debug = false, 
      verbose = false, 
      import_all_emails = true,
      scheduled = false,
      sync_log_id = null
    } = requestData;
    
    // Log request details
    logRequestDetails(requestData);
    
    // Create Supabase client
    const supabase = createSupabaseClient();
    
    // Get and validate email account
    const accountResult = await handleEmailAccount(supabase, accountId, verbose);
    if (!accountResult.success) {
      // Handle failure for scheduled syncs
      if (scheduled) {
        try {
          await createFailureLog(supabase, accountId, sync_log_id, accountResult.error);
        } catch (logError) {
          console.error(`Error creating/updating log entry for account ${accountId}:`, logError);
        }
      }
      
      return createErrorResponse(accountResult.error);
    }
    
    const accountData = accountResult.accountData;
    
    // Process the account's emails
    return await processAccountEmails(
      accountId,
      accountData,
      supabase,
      {
        debug,
        verbose,
        import_all_emails,
        scheduled,
        sync_log_id
      }
    );
    
  } catch (error) {
    console.error('Unexpected error in sync-emails function:', error);
    
    return createErrorResponse(`Unexpected error: ${error.message}`, { 
      stack: error.stack 
    });
  }
}
