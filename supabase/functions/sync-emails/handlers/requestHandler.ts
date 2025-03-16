
import { corsHeaders } from '../../_shared/cors.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4';
import { handleEmailAccount } from './accountHandler.ts';
import { processAccountEmails } from './syncProcessor.ts';
import { createSuccessResponse, createErrorResponse } from './responseHandler.ts';
import { SyncRequestData } from '../types.ts';

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
      scheduled = false, // Track if this is a scheduled sync
      sync_log_id = null  // For updating existing log entries instead of creating new ones
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
      // Update or create a failure log entry for scheduled syncs
      if (scheduled) {
        try {
          if (sync_log_id) {
            // Update existing log entry
            await supabase
              .from('email_sync_logs')
              .update({
                status: 'failed',
                error_message: accountResult.error,
                sync_type: 'scheduled'
              })
              .eq('id', sync_log_id);
            console.log(`Updated log entry ${sync_log_id} for scheduled sync of account ${accountId}`);
          } else {
            // Create new log entry
            await supabase.rpc('add_sync_log', {
              account_id_param: accountId,
              status_param: 'failed',
              message_count_param: 0,
              error_message_param: accountResult.error,
              details_param: null,
              sync_type_param: 'scheduled'
            });
            console.log(`Created failure log entry for scheduled sync of account ${accountId}`);
          }
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
