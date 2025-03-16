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
    
    // Implement improved retry logic with exponential backoff
    const maxRetries = 3;
    let retryCount = 0;
    let lastError = null;
    
    while (retryCount < maxRetries) {
      try {
        // Add retry information to the log
        if (retryCount > 0) {
          console.log(`Retry attempt ${retryCount} of ${maxRetries}`);
          // Add a small exponential backoff delay
          await new Promise(resolve => setTimeout(resolve, Math.pow(2, retryCount) * 500));
        }
        
        // Make the function call with timeout control
        const abortController = new AbortController();
        const timeoutId = setTimeout(() => abortController.abort(), 30000); // 30 second timeout
        
        try {
          const response = await supabase.functions.invoke("sync-emails", {
            body: { 
              accountId,
              import_all_emails: true,
              debug: true,
              verbose: true
            },
            signal: abortController.signal
          });
          
          // Clear the timeout since we got a response
          clearTimeout(timeoutId);
          
          console.log("Sync-emails response:", response);
          
          // Check for empty response first
          const emptyResponseResult = handleEmptyResponse(accountId, response);
          if (emptyResponseResult) {
            return emptyResponseResult;
          }
  
          // Check for error conditions in the response
          const errorResult = processSyncResponse(accountId, response);
          if (errorResult) {
            return errorResult;
          }
  
          // Calculate unique senders in the synced emails
          const uniqueSenders = new Set();
          if (response.data?.synced && response.data.synced.length > 0) {
            response.data.synced.forEach((email: any) => {
              if (email.sender_email) {
                uniqueSenders.add(email.sender_email);
              }
            });
          }
          
          // Create details object
          const syncDetails = {
            ...(response.data?.details || {}),
            new_senders_count: uniqueSenders.size
          };
  
          // Handle partial success case
          if (response.data?.partial) {
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
          // Make sure to clear the timeout
          clearTimeout(timeoutId);
          
          console.error(`Error on attempt ${retryCount + 1}:`, error);
          lastError = error;
          retryCount++;
          
          // Check if we've run out of retries
          if (retryCount >= maxRetries) {
            throw error; // This will be caught by the outer try/catch
          }
          
          // Otherwise, the while loop will continue to the next retry
        }
      } catch (retryError) {
        console.error(`Error during retry attempt ${retryCount}:`, retryError);
        lastError = retryError;
        retryCount++;
        
        // Check if we've run out of retries
        if (retryCount >= maxRetries) {
          break; // Exit the retry loop
        }
      }
    }
    
    // If we get here, we've exhausted all retries
    console.error("All retry attempts failed");
    
    // Format a user-friendly error message
    let errorMessage = lastError instanceof Error ? lastError.message : String(lastError);
    
    // Check if the error is a timeout
    if (errorMessage.includes('aborted') || errorMessage.includes('timeout')) {
      errorMessage = "The request timed out. The server might be busy or temporarily unavailable.";
    }
    // Check if it's a network error
    else if (errorMessage.includes('Failed to fetch') || errorMessage.includes('network') || 
        errorMessage.includes('CORS') || errorMessage.includes('cross-origin')) {
      errorMessage = "Network error: Unable to connect to the Edge Function. This may be due to network connectivity issues or server unavailability.";
    }
    
    return handleApiError(accountId, { message: errorMessage });
  } catch (error: any) {
    return handleSyncError(accountId, error);
  }
}
