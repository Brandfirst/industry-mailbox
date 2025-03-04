
import { SyncResult } from './types';
import { toast } from "sonner";
import { addSyncLog } from '../syncLogs';

/**
 * Handles error response from sync operation
 */
export function handleSyncError(accountId: string, error: any): SyncResult {
  console.error("Exception in syncEmailAccount:", error);
  
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
    error: error.message || String(error),
    timestamp: Date.now()
  };
}

/**
 * Process successful sync response data
 */
export function processSyncResponse(accountId: string, response: any): SyncResult {
  // Check if we need to re-authenticate
  if (response.data?.details?.requiresReauthentication) {
    console.warn("Authentication error - account requires re-authentication");
    
    // Show a toast message for the user
    toast.error("Gmail authentication expired. Please disconnect and reconnect your account.", {
      duration: 6000,
    });
    
    // Log the failed sync attempt
    addSyncLog({
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
  if (!response.data?.success) {
    console.error("Error in sync-emails function:", response.data?.error || "Unknown error");
    
    // Log the failed sync attempt
    addSyncLog({
      account_id: accountId,
      status: 'failed',
      message_count: 0,
      error_message: response.data?.error || "Failed to sync emails",
      timestamp: new Date().toISOString()
    });
    
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
    addSyncLog({
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

  return null; // Return null if response is not empty
}

/**
 * Handle API error response
 */
export function handleApiError(accountId: string, error: any): SyncResult {
  console.error("Error invoking sync-emails function:", error);
  
  // Log the failed sync attempt
  addSyncLog({
    account_id: accountId,
    status: 'failed',
    message_count: 0,
    error_message: error.message || "Error connecting to sync service",
    timestamp: new Date().toISOString()
  });
  
  return { 
    success: false, 
    error: error.message || "Error connecting to sync service",
    statusCode: error ? 500 : 400,
    timestamp: Date.now()
  };
}
