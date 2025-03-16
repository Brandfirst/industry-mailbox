
import { corsHeaders } from '../../_shared/cors.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4';
import { fetchGmailEmails } from '../gmail.ts';
import { processEmails } from './emailProcessor.ts';
import { createSuccessResponse, createErrorResponse } from './responseHandler.ts';

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
  const { verbose = false, scheduled = false, sync_log_id = null } = options;
  
  // Update last_sync timestamp
  await supabase
    .from('email_accounts')
    .update({ last_sync: new Date().toISOString() })
    .eq('id', accountId);
  
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
    
    // Determine status - an empty result should be a success, not a failure
    const hasEmails = result.length > 0;
    const hasFailed = failed.length > 0;
    const hasSuccess = synced.length > 0;
    
    // Determine the status based on the results
    let status;
    let errorMessage = null;
    
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
    
    // Return success response
    return createSuccessResponse({
      partial: status === 'partial',
      count: synced.length,
      synced,
      failed: failed.length > 0 ? failed : [],
      warning: errorMessage,
      details: {
        accountEmail: accountData.email,
        provider: accountData.provider,
        totalEmails: result.length,
        syncedCount: synced.length,
        failedCount: failed.length,
        new_senders_count: uniqueSenders.size,
        senders: senderEmails, // Add the actual sender emails to the response
        sync_type: scheduled ? 'scheduled' : 'manual'
      },
      debugInfo: options.debug ? {
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

/**
 * Create or update a sync log entry
 */
async function createOrUpdateSyncLog(
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
    senders: senderEmails, // Add the actual sender emails to the log details
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
async function createFailureLog(
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
