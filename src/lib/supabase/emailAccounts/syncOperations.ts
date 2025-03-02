
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
    
    const response = await supabase.functions.invoke("sync-emails", {
      body: { accountId },
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
