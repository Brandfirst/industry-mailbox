
import { supabase } from "@/integrations/supabase/client";
import { SyncResult } from "./types";
import { toast } from "sonner";
import { addSyncLog } from "./syncLogs";

/**
 * Syncs emails for a specific account
 */
export async function syncEmailAccount(accountId): Promise<SyncResult> {
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
    
    // Invoke the function with production settings
    const response = await supabase.functions.invoke("sync-emails", {
      body: { 
        accountId,
        import_all_emails: true,  // Import all emails
        debug: true,              // Request debug info from the function
        verbose: true             // Request verbose logging
      },
    });

    console.log("Sync-emails raw response:", response);
    
    if (response.error) {
      console.error("Error invoking sync-emails function:", response.error);
      
      // Log the failed sync attempt
      await addSyncLog({
        account_id: accountId,
        status: 'failed',
        message_count: 0,
        error_message: response.error.message || "Error connecting to sync service",
        timestamp: new Date().toISOString()
      });
      
      return { 
        success: false, 
        error: response.error.message || "Error connecting to sync service",
        statusCode: response.error ? 500 : 400,
        timestamp: Date.now()
      };
    }

    // Check if we have data and if it indicates an error
    if (!response.data) {
      console.error("Empty response from sync-emails function");
      
      // Log the failed sync attempt
      await addSyncLog({
        account_id: accountId,
        status: 'failed',
        message_count: 0,
        error_message: "Empty response from server",
        timestamp: new Date().toISOString()
      });
      
      return { 
        success: false, 
        error: "Empty response from server", 
        statusCode: 400,
        timestamp: Date.now()
      };
    }

    // Check if we need to re-authenticate
    if (response.data.details?.requiresReauthentication) {
      console.warn("Authentication error - account requires re-authentication");
      
      // Show a toast message for the user
      toast.error("Gmail authentication expired. Please disconnect and reconnect your account.", {
        duration: 6000,
      });
      
      // Log the failed sync attempt
      await addSyncLog({
        account_id: accountId,
        status: 'failed',
        message_count: 0,
        error_message: "Authentication expired",
        timestamp: new Date().toISOString()
      });
      
      return {
        success: false,
        error: response.data.error || "Authentication expired",
        requiresReauthentication: true,
        statusCode: 401,
        timestamp: Date.now()
      };
    }

    // Check the success flag directly from the response data
    if (!response.data.success) {
      console.error("Error in sync-emails function:", response.data.error || "Unknown error");
      
      // Log the failed sync attempt
      await addSyncLog({
        account_id: accountId,
        status: 'failed',
        message_count: 0,
        error_message: response.data.error || "Failed to sync emails",
        timestamp: new Date().toISOString()
      });
      
      return { 
        success: false, 
        error: response.data.error || "Failed to sync emails",
        details: response.data.details || null,
        statusCode: response.data.statusCode || 400,
        timestamp: Date.now()
      };
    }

    // Calculate unique senders in the newly synced emails
    const uniqueSenders = new Set();
    if (response.data.synced && response.data.synced.length > 0) {
      response.data.synced.forEach(email => {
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
      console.warn("Partial sync completed with some errors:", response.data);
      
      // Log the partial sync success
      await addSyncLog({
        account_id: accountId,
        status: 'success',
        message_count: response.data.count || 0,
        error_message: "Some emails failed to sync",
        details: syncDetails,
        timestamp: new Date().toISOString()
      });
      
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
    
    // Log what was synced in detail
    if (response.data.synced && response.data.synced.length) {
      console.log(`Synced ${response.data.synced.length} emails: `, 
        response.data.synced.map(n => ({
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
    await addSyncLog({
      account_id: accountId,
      status: 'success',
      message_count: response.data.count || 0,
      details: syncDetails,
      timestamp: new Date().toISOString()
    });

    // If we reach here, the sync was successful
    console.log("Sync completed successfully:", response.data);

    return { 
      success: true, 
      synced: response.data.synced || [],
      count: response.data.count || 0,
      statusCode: 200,
      timestamp: Date.now(),
      details: syncDetails
    };
  } catch (error) {
    console.error("Exception in syncEmailAccount:", error);
    
    // Log the error
    try {
      await addSyncLog({
        account_id: accountId,
        status: 'failed',
        message_count: 0,
        error_message: error.message || String(error),
        timestamp: new Date().toISOString()
      });
    } catch (logError) {
      console.error("Failed to log sync error:", logError);
    }
    
    return { 
      success: false, 
      error: error.message || String(error),
      timestamp: Date.now()
    };
  }
}
