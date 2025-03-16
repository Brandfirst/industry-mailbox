
import { corsHeaders } from '../../_shared/cors.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4';
import { fetchGmailEmails } from '../gmail.ts';
import { saveEmailToDatabase } from '../database.ts';
import { SyncRequestData, SyncResponseData } from '../types.ts';
import { handleEmailAccount } from './accountHandler.ts';
import { processEmails } from './emailProcessor.ts';
import { createSuccessResponse, createErrorResponse } from './responseHandler.ts';

/**
 * Main handler for sync email requests
 */
export async function handleSyncRequest(req: Request): Promise<Response> {
  try {
    // Parse request body
    const requestData = await req.json() as SyncRequestData;
    const { 
      accountId, 
      debug = false, 
      verbose = false, 
      import_all_emails = true,
      scheduled = false // Track if this is a scheduled sync
    } = requestData;
    
    if (!accountId) {
      console.error('No accountId provided');
      return createErrorResponse('No account ID provided');
    }
    
    console.log(`Starting ${scheduled ? 'scheduled' : 'manual'} sync for account ${accountId} with debug=${debug}, verbose=${verbose}, import_all_emails=${import_all_emails}`);
    
    // Create Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // Get and validate email account
    const accountResult = await handleEmailAccount(supabase, accountId, verbose);
    if (!accountResult.success) {
      // Create a failure log entry for scheduled syncs
      if (scheduled) {
        try {
          await supabase.rpc('add_sync_log', {
            account_id_param: accountId,
            status_param: 'failed',
            message_count_param: 0,
            error_message_param: accountResult.error,
            details_param: null,
            sync_type_param: 'scheduled'
          });
          console.log(`Created failure log entry for scheduled sync of account ${accountId}`);
        } catch (logError) {
          console.error(`Error creating log entry for account ${accountId}:`, logError);
        }
      }
      
      return createErrorResponse(accountResult.error);
    }
    
    const accountData = accountResult.accountData;
    
    // Update last_sync timestamp
    await supabase
      .from('email_accounts')
      .update({ last_sync: new Date().toISOString() })
      .eq('id', accountId);
    
    // Fetch emails from provider
    try {
      const result = await fetchGmailEmails(
        accountData.access_token, 
        accountData.refresh_token, 
        accountId, 
        supabase, 
        verbose
      );
      
      console.log(`Fetched ${result.length} emails from Gmail API for ${accountData.email}`);
      
      // Process and save emails
      const { synced, failed, uniqueSenders } = await processEmails(
        result, 
        accountId, 
        supabase, 
        verbose
      );
      
      // Determine partial success
      const partial = failed.length > 0 && synced.length > 0;
      
      // Create appropriate log entry for scheduled syncs
      if (scheduled) {
        try {
          await supabase.rpc('add_sync_log', {
            account_id_param: accountId,
            status_param: partial ? 'partial' : (synced.length > 0 ? 'success' : 'failed'),
            message_count_param: synced.length,
            error_message_param: partial ? 'Some emails failed to sync' : null,
            details_param: {
              total_emails: result.length,
              synced_count: synced.length,
              failed_count: failed.length,
              new_senders_count: uniqueSenders.size
            },
            sync_type_param: 'scheduled'
          });
          console.log(`Created completion log entry for scheduled sync of account ${accountId}`);
        } catch (logError) {
          console.error(`Error creating log entry for account ${accountId}:`, logError);
        }
      }
      
      // Return success response
      return createSuccessResponse({
        partial,
        count: synced.length,
        synced,
        failed: failed.length > 0 ? failed : [],
        warning: partial ? 'Some emails failed to sync' : null,
        details: {
          accountEmail: accountData.email,
          provider: accountData.provider,
          totalEmails: result.length,
          syncedCount: synced.length,
          failedCount: failed.length,
          new_senders_count: uniqueSenders.size,
          sync_type: scheduled ? 'scheduled' : 'manual'
        },
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
      
      // Create failure log entry for scheduled syncs
      if (scheduled) {
        try {
          await supabase.rpc('add_sync_log', {
            account_id_param: accountId,
            status_param: 'failed',
            message_count_param: 0,
            error_message_param: `Error processing emails: ${error.message || String(error)}`,
            details_param: null,
            sync_type_param: 'scheduled'
          });
          console.log(`Created failure log entry for scheduled sync of account ${accountId}`);
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
    
  } catch (error) {
    console.error('Unexpected error in sync-emails function:', error);
    
    return createErrorResponse(`Unexpected error: ${error.message}`, { 
      stack: error.stack 
    });
  }
}
