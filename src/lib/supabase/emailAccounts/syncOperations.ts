
import { supabase } from "@/integrations/supabase/client";
import { SyncResult } from "./types";

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
      .select('email, provider, last_sync')
      .eq('id', accountId)
      .single();
    
    if (accountInfo) {
      console.log(`Account details: Email=${accountInfo.email}, Provider=${accountInfo.provider}, Last sync=${accountInfo.last_sync || 'Never'}`);
    } else if (accountError) {
      console.log(`Error fetching account info: ${accountError.message}`);
    }
    
    // Invoke the function with more debug options
    const response = await supabase.functions.invoke("sync-emails", {
      body: { 
        accountId,
        debug: true,  // Request debug info from the function
        verbose: true // Request verbose logging
      },
    });

    console.log("Sync-emails raw response:", response);
    
    if (response.error) {
      console.error("Error invoking sync-emails function:", response.error);
      return { 
        success: false, 
        error: response.error.message || "Error connecting to sync service",
        statusCode: response.error ? 500 : 400,
        timestamp: Date.now() // Add timestamp to match SyncResult type
      };
    }

    // Check if we have data and if it indicates an error
    if (!response.data) {
      console.error("Empty response from sync-emails function");
      return { 
        success: false, 
        error: "Empty response from server", 
        statusCode: 400,
        timestamp: Date.now() // Add timestamp to match SyncResult type
      };
    }

    // Check the success flag directly from the response data
    if (!response.data.success) {
      console.error("Error in sync-emails function:", response.data.error || "Unknown error");
      return { 
        success: false, 
        error: response.data.error || "Failed to sync emails",
        details: response.data.details || null,
        statusCode: response.data.statusCode || 400,
        timestamp: Date.now() // Add timestamp to match SyncResult type
      };
    }

    // Handle partial success case
    if (response.data.partial) {
      console.warn("Partial sync completed with some errors:", response.data);
      
      return {
        success: true,
        partial: true,
        count: response.data.count || 0,
        synced: response.data.synced || [],
        failed: response.data.failed || [],
        warning: "Some newsletters failed to sync",
        details: response.data.details,
        statusCode: 200,
        timestamp: Date.now() // Add timestamp to match SyncResult type
      };
    }
    
    // Log what was synced in detail
    if (response.data.synced && response.data.synced.length) {
      console.log(`Synced ${response.data.synced.length} newsletters: `, 
        response.data.synced.map(n => ({
          subject: n.subject || n.title,
          sender: n.sender || n.sender_email,
          date: n.date || n.published_at
        }))
      );
    } else {
      console.log("No newsletters were synced. Function returned success but empty array.");
      console.log("Debug info:", response.data.debugInfo || "No debug info available");
    }

    // If we reach here, the sync was successful
    console.log("Sync completed successfully:", response.data);

    return { 
      success: true, 
      synced: response.data.synced || [],
      count: response.data.count || 0,
      statusCode: 200,
      timestamp: Date.now() // Add timestamp to match SyncResult type
    };
  } catch (error) {
    console.error("Exception in syncEmailAccount:", error);
    return { 
      success: false, 
      error: error.message || String(error),
      timestamp: Date.now() // Add timestamp to match SyncResult type
    };
  }
}
