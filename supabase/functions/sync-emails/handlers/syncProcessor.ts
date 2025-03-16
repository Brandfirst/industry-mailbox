
import { corsHeaders } from '../../_shared/cors.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4';
import { fetchGmailEmails } from '../gmail.ts';
import { processEmails } from './emailProcessor.ts';
import { createSuccessResponse, createErrorResponse } from './responseHandler.ts';
import { createOrUpdateSyncLog, createFailureLog } from './logManager.ts';
import { determineSyncStatus, prepareSyncResponse } from './statusManager.ts';
import { updateLastSyncTimestamp } from './accountUpdater.ts';

/**
 * Process emails for an account
 * @param accountId The account ID
 * @param accountData The account data
 * @param supabase The Supabase client
 * @param options Configuration options
 * @returns Object containing processing result
 */
export async function processAccountEmails(
  accountId: string,
  accountData: any,
  supabase: any,
  options: {
    debug?: boolean;
    verbose?: boolean;
    import_all_emails?: boolean;
    scheduled?: boolean;
    sync_log_id?: string | null;
  }
) {
  const { verbose = false, scheduled = false, sync_log_id = null, debug = false } = options;
  
  // Update last_sync timestamp
  await updateLastSyncTimestamp(supabase, accountId);
  
  try {
    // Fetch emails from provider
    const result = await fetchGmailEmails(
      accountData.access_token, 
      accountData.refresh_token, 
      accountId, 
      supabase, 
      verbose
    );
    
    console.log(`Fetched ${result.length} emails from Gmail API for ${accountData.email}`);
    
    // Process and save emails - even if there are zero emails, this should be a success
    const { synced, failed, uniqueSenders } = await processEmails(
      result, 
      accountId, 
      supabase, 
      verbose
    );
    
    // Determine status based on results
    const { status, errorMessage } = determineSyncStatus(result, synced, failed);
    
    // Extract sender information for the logs
    const senderEmails = Array.from(uniqueSenders);
    
    // Create or update log entry for scheduled syncs
    if (scheduled) {
      try {
        await createOrUpdateSyncLog(supabase, {
          sync_log_id,
          accountId,
          status,
          synced,
          failed,
          uniqueSenders,
          senderEmails,
          accountEmail: accountData.email,
          errorMessage
        });
      } catch (logError) {
        console.error(`Error creating/updating log entry for account ${accountId}:`, logError);
      }
    }
    
    // Prepare response data
    const responseData = prepareSyncResponse(
      result, 
      synced, 
      failed, 
      uniqueSenders, 
      accountData, 
      scheduled
    );
    
    // Return success response
    return createSuccessResponse({
      ...responseData,
      warning: errorMessage,
      debugInfo: debug ? {
        timestamp: new Date().toISOString(),
        accountId,
        emailsProcessed: result.length,
        mock: false,
        scheduled
      } : null
    });
    
  } catch (error) {
    console.error('Error fetching or processing emails:', error);
    
    // Create or update failure log entry for scheduled syncs
    if (scheduled) {
      try {
        const errorMessage = `Error processing emails: ${error.message || String(error)}`;
        await createFailureLog(supabase, accountId, sync_log_id, errorMessage);
      } catch (logError) {
        console.error(`Error creating log entry for account ${accountId}:`, logError);
      }
    }
    
    // Check if this is an authentication error
    const isAuthError = error.message.includes('authentication') || 
                        error.message.includes('credential') || 
                        error.message.includes('token') ||
                        error.message.includes('auth');
                        
    if (isAuthError) {
      return createErrorResponse(`Authentication error: ${error.message}`, { 
        requiresReauthentication: true 
      });
    }
    
    return createErrorResponse(`Failed to retrieve emails: ${error.message}`);
  }
}
