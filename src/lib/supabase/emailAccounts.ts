
import { supabase } from "@/integrations/supabase/client";
import { GoogleOAuthResult } from "./types";

// Email account functions
export async function getUserEmailAccounts(userId) {
  const { data, error } = await supabase
    .from("email_accounts")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching email accounts:", error);
    throw error;
  }

  return data;
}

export async function connectGoogleEmail(userId, code, redirectUri): Promise<GoogleOAuthResult> {
  try {
    // Get the redirect URI from env or use the provided one
    const actualRedirectUri = redirectUri || import.meta.env.VITE_REDIRECT_URI || 
      window.location.origin + "/admin";
    
    console.log("Using redirect URI for connectGoogleEmail:", actualRedirectUri);
    console.log("Connecting Google Email for user:", userId);
    
    const response = await supabase.functions.invoke("connect-gmail", {
      body: { 
        code, 
        userId, 
        redirectUri: actualRedirectUri,
        timestamp: new Date().toISOString() // Add timestamp to help with debugging
      },
    });

    // Check if there's an error with the function invocation itself
    if (response.error) {
      console.error("Error invoking connect-gmail function:", response.error);
      return { 
        success: false, 
        error: "Error connecting to Gmail service", 
        edgeFunctionError: response.error.message || String(response.error),
        statusCode: 500  // Use a default status code for error
      };
    }

    // Check for expected data structure
    if (!response.data) {
      console.error("Empty response from connect-gmail function");
      return { 
        success: false, 
        error: "Empty response from server",
        statusCode: 400  // Use a default status code for empty response
      };
    }

    // If there's data but success is false, it means the function returned an error
    if (!response.data.success) {
      console.error("Error in connect-gmail function:", response.data);
      
      // Extract more detailed error information
      return { 
        success: false, 
        error: response.data.error || "Failed to connect Gmail account",
        details: response.data.details || null,
        googleError: response.data.googleError || null,
        googleErrorDescription: response.data.googleErrorDescription || null,
        tokenInfo: response.data.tokenInfo || null,
        statusCode: 400  // Use a default status code for business logic error
      };
    }

    console.log("Successfully connected Google account:", response.data.account?.email || "Unknown email");
    
    return { 
      success: true, 
      account: response.data.account,
      statusCode: 200  // Use a default status code for success
    };
  } catch (error) {
    console.error("Exception in connectGoogleEmail:", error);
    return { 
      success: false, 
      error: error.message || "An unexpected error occurred",
      details: String(error),
      statusCode: 500  // Use a default status code for exception
    };
  }
}

export async function disconnectEmailAccount(accountId) {
  try {
    // First delete the account from the database
    const { error } = await supabase
      .from("email_accounts")
      .delete()
      .eq("id", accountId);

    if (error) {
      console.error("Error disconnecting email account:", error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    console.error("Exception in disconnectEmailAccount:", error);
    return { success: false, error: error.message };
  }
}

export async function syncEmailAccount(accountId) {
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
        statusCode: response.error.status || 500
      };
    }

    // Check if we have data and if it indicates an error
    if (!response.data) {
      console.error("Empty response from sync-emails function");
      return { 
        success: false, 
        error: "Empty response from server", 
        statusCode: 400 
      };
    }

    // Check the success flag directly from the response data
    if (!response.data.success) {
      console.error("Error in sync-emails function:", response.data.error || "Unknown error");
      return { 
        success: false, 
        error: response.data.error || "Failed to sync emails",
        details: response.data.details || null,
        statusCode: response.data.status || 400
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
        warning: "Some newsletters failed to sync",
        details: response.data.details,
        statusCode: 200
      };
    }

    // If we reach here, the sync was successful
    console.log("Sync completed successfully:", response.data);

    return { 
      success: true, 
      synced: response.data.synced || [],
      count: response.data.count || 0,
      statusCode: 200
    };
  } catch (error) {
    console.error("Exception in syncEmailAccount:", error);
    return { success: false, error: error.message || String(error) };
  }
}
