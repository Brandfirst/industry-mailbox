
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
    
    // Add more detailed logging for the request
    console.log("Invoking connect-gmail with payload:", {
      code: code ? `${code.substring(0, 10)}...` : null, // Log first few chars of code for debugging
      userId,
      redirectUri: actualRedirectUri
    });
    
    const response = await supabase.functions.invoke("connect-gmail", {
      body: { 
        code, 
        userId, 
        redirectUri: actualRedirectUri,
        timestamp: new Date().toISOString() // Add timestamp to help with debugging
      },
    });
    
    // Add more detailed logging for the response
    console.log("connect-gmail response:", {
      status: response.status,
      error: response.error,
      dataReceived: !!response.data,
      dataSuccess: response.data?.success,
      dataError: response.data?.error,
      dataAccount: response.data?.account ? `${response.data.account.email} (ID: ${response.data.account.id})` : null,
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
        statusCode: response.data.statusCode || 400  // Use a default status code for business logic error
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
    console.log(`Disconnecting email account with ID: ${accountId}`);
    
    // First get the account details before deletion (for logging purposes)
    const { data: accountData, error: fetchError } = await supabase
      .from("email_accounts")
      .select("email, user_id")
      .eq("id", accountId)
      .single();
      
    if (fetchError) {
      console.error("Error fetching email account details before disconnection:", fetchError);
    } else {
      console.log(`Preparing to disconnect email ${accountData?.email} for user ${accountData?.user_id}`);
    }
    
    // Delete the account from the database
    const { error } = await supabase
      .from("email_accounts")
      .delete()
      .eq("id", accountId);

    if (error) {
      console.error("Error disconnecting email account:", error);
      return { success: false, error: error.message };
    }
    
    // Log successful deletion
    console.log(`Successfully disconnected email account ${accountId} (${accountData?.email || "unknown email"})`);
    
    // Optionally, we could call a function to notify the edge function about the deletion
    try {
      const notifyResponse = await supabase.functions.invoke("disconnect-notification", {
        body: { 
          accountId, 
          email: accountData?.email, 
          userId: accountData?.user_id,
          timestamp: new Date().toISOString()
        },
      });
      
      if (notifyResponse.error) {
        console.warn("Error notifying edge function about disconnection:", notifyResponse.error);
        // Continue anyway since the account was successfully deleted
      }
    } catch (notifyError) {
      // Just log the error but don't fail the whole operation
      console.warn("Exception when notifying edge function:", notifyError);
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
        statusCode: response.error.status || 500,
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
        statusCode: response.data.status || 400,
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
