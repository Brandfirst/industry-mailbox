
import { supabase } from "@/integrations/supabase/client";
import { SyncResult } from "./types";
import { 
  handleSyncError, 
  handleEmptyResponse, 
  handleApiError, 
  processSyncResponse 
} from "./responseHandling";
import { logPartialSync, logSuccessfulSync } from "./logHandling";

/**
 * Syncs emails for a specific account
 */
export async function syncEmailAccount(accountId: string): Promise<SyncResult> {
  try {
    console.log("Starting sync for email account:", accountId);
    
    // Add more detailed logging
    console.log(`Invoking sync-emails function with accountId: ${accountId}`);
    
    // Add diagnostics about the account before syncing
    const { data: accountInfo, error: accountError } = await supabase
      .from('email_accounts')
      .select('email, provider, last_sync, access_token, refresh_token')
      .eq('id', accountId)
      .single();
    
    if (accountInfo) {
      console.log(`Account details: Email=${accountInfo.email}, Provider=${accountInfo.provider}, Last sync=${accountInfo.last_sync || 'Never'}`);
      console.log(`Has access token: ${!!accountInfo.access_token}, Has refresh token: ${!!accountInfo.refresh_token}`);
    } else if (accountError) {
      console.log(`Error fetching account info: ${accountError.message}`);
    }
    
    // Invoke the function with improved error handling and retries
    try {
      // First attempt
      let response = await supabase.functions.invoke("sync-emails", {
        body: { 
          accountId,
          import_all_emails: true,
          debug: true,
          verbose: true
        },
      });

      console.log("Sync-emails raw response:", response);
      
      if (response.error) {
        console.log("First attempt failed, retrying...");
        
        // Add a small delay before retry (500ms)
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Second attempt
        response = await supabase.functions.invoke("sync-emails", {
          body: { 
            accountId,
            import_all_emails: true,
            debug: true,
            verbose: true
          },
        });
        
        console.log("Sync-emails retry response:", response);
        
        if (response.error) {
          return handleApiError(accountId, response.error);
        }
      }

      // Check for empty response
      const emptyResponseResult = handleEmptyResponse(accountId, response);
      if (emptyResponseResult) {
        return emptyResponseResult;
      }

      // Process the response for error conditions
      const errorResult = processSyncResponse(accountId, response);
      if (errorResult) {
        return errorResult;
      }

      // Calculate unique senders in the newly synced emails
      const uniqueSenders = new Set();
      if (response.data.synced && response.data.synced.length > 0) {
        response.data.synced.forEach((email: any) => {
          if (email.sender_email) {
            uniqueSenders.add(email.sender_email);
          }
        });
      }
      
      // Create details object with new sender count
      const syncDetails = {
        ...response.data.details,
        new_senders_count: uniqueSenders.size
      };

      // Handle partial success case
      if (response.data.partial) {
        logPartialSync(accountId, response, syncDetails);
        
        return {
          success: true,
          partial: true,
          count: response.data.count || 0,
          synced: response.data.synced || [],
          failed: response.data.failed || [],
          warning: "Some emails failed to sync",
          details: syncDetails,
          statusCode: 200,
          timestamp: Date.now()
        };
      }
      
      // Handle successful sync
      logSuccessfulSync(accountId, response, syncDetails);

      return { 
        success: true, 
        synced: response.data.synced || [],
        count: response.data.count || 0,
        statusCode: 200,
        timestamp: Date.now(),
        details: syncDetails
      };
    } catch (error) {
      console.error("Error invoking sync-emails function:", error);
      
      // Check if the error is related to CORS or network connectivity
      let errorMessage = error instanceof Error ? error.message : String(error);
      if (errorMessage.includes('Failed to fetch') || errorMessage.includes('network') || 
          errorMessage.includes('CORS') || errorMessage.includes('cross-origin')) {
        errorMessage = "Network error: Unable to connect to the Edge Function. Please check your network connection and try again.";
      }
      
      return handleApiError(accountId, { message: errorMessage });
    }
  } catch (error: any) {
    return handleSyncError(accountId, error);
  }
}
