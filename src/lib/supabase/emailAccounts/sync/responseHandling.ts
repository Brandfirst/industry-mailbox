
import { SyncResult } from './types';
import { toast } from "sonner";
import { addSyncLog } from '../syncLogs';

/**
 * Handles error response from sync operation
 */
export function handleSyncError(accountId: string, error: any): SyncResult {
  console.error("Exception in syncEmailAccount:", error);
  
  // Create a user-friendly error message
  let userErrorMessage = error.message || String(error);
  
  // Make the error message more user-friendly for common errors
  if (userErrorMessage.includes('Failed to fetch') || userErrorMessage.includes('TypeError: Failed to fetch')) {
    userErrorMessage = "Network connectivity issue: Unable to reach the server. Please check your connection and try again.";
  } else if (userErrorMessage.includes('CORS') || userErrorMessage.includes('cross-origin')) {
    userErrorMessage = "Browser security restriction: The request was blocked. This is likely a temporary issue.";
  }
  
  // Log the error
  try {
    addSyncLog({
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
    error: userErrorMessage,
    timestamp: Date.now()
  };
}

/**
 * Process successful sync response data
 */
export function processSyncResponse(accountId: string, response: any): SyncResult | null {
  // Check if we need to re-authenticate
  if (response.data?.details?.requiresReauthentication) {
    console.warn("Authentication error - account requires re-authentication");
    
    // Show a toast message for the user
    toast.error("Gmail authentication expired. Please disconnect and reconnect your account.", {
      duration: 6000,
    });
    
    // Log the failed sync attempt
    try {
      addSyncLog({
        account_id: accountId,
        status: 'failed',
        message_count: 0,
        error_message: "Authentication expired",
        timestamp: new Date().toISOString()
      });
    } catch (logError) {
      console.error("Failed to log authentication error:", logError);
    }
    
    return {
      success: false,
      error: response.data.error || "Authentication expired",
      requiresReauthentication: true,
      statusCode: 401,
      timestamp: Date.now()
    };
  }

  // Check the success flag directly from the response data
  if (!response.data?.success) {
    console.error("Error in sync-emails function:", response.data?.error || "Unknown error");
    
    // Log the failed sync attempt
    try {
      addSyncLog({
        account_id: accountId,
        status: 'failed',
        message_count: 0,
        error_message: response.data?.error || "Failed to sync emails",
        timestamp: new Date().toISOString()
      });
    } catch (logError) {
      console.error("Failed to log sync failure:", logError);
    }
    
    return { 
      success: false, 
      error: response.data?.error || "Failed to sync emails",
      details: response.data?.details || null,
      statusCode: response.data?.statusCode || 400,
      timestamp: Date.now()
    };
  }

  return null; // Return null if response is valid and successful
}

/**
 * Handle empty or error response
 */
export function handleEmptyResponse(accountId: string, response: any): SyncResult | null {
  // Check if we have data and if it indicates an error
  if (!response.data) {
    console.error("Empty response from sync-emails function");
    
    // Log the failed sync attempt
    try {
      addSyncLog({
        account_id: accountId,
        status: 'failed',
        message_count: 0,
        error_message: "Empty response from server",
        timestamp: new Date().toISOString()
      });
    } catch (logError) {
      console.error("Failed to log empty response error:", logError);
    }
    
    return { 
      success: false, 
      error: "Empty response from server", 
      statusCode: 400,
      timestamp: Date.now()
    };
  }

  return null; // Return null if response is not empty
}

/**
 * Handle API error response
 */
export function handleApiError(accountId: string, error: any): SyncResult {
  console.error("Error invoking sync-emails function:", error);
  
  // Create a user-friendly error message
  let userErrorMessage = error.message || "Error connecting to sync service";
  
  // Make API error messages more friendly
  if (userErrorMessage.includes('Failed to fetch')) {
    userErrorMessage = "Network issue: Could not connect to the sync service. Please try again later.";
  }
  
  // Log the failed sync attempt
  try {
    addSyncLog({
      account_id: accountId,
      status: 'failed',
      message_count: 0,
      error_message: error.message || "Error connecting to sync service",
      timestamp: new Date().toISOString()
    });
  } catch (logError) {
    console.error("Failed to log API error:", logError);
  }
  
  return { 
    success: false, 
    error: userErrorMessage,
    statusCode: error ? 500 : 400,
    timestamp: Date.now()
  };
}
