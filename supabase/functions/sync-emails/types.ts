
// Types for sync-emails function

// Basic request data structure for the sync-emails function
export interface SyncRequestData {
  accountId: string;
  debug?: boolean;
  verbose?: boolean;
  import_all_emails?: boolean;
  scheduled?: boolean; // Flag to indicate if this is a scheduled sync
}

// Email structure for processing
export interface Email {
  id: string;
  subject: string;
  sender: string;
  sender_email: string;
  date: string;
  html: string;
  snippet?: string;
  // Additional fields that might be used
  threadId?: string;
  labelIds?: string[];
}

// Response data structure from the sync-emails function
export interface SyncResponseData {
  success: boolean;
  partial?: boolean;
  data?: {
    count: number;
    synced: any[];
    failed?: any[];
    warning?: string | null;
    details?: {
      accountEmail: string;
      provider: string;
      totalEmails: number;
      syncedCount: number;
      failedCount: number;
      new_senders_count: number;
      sync_type?: string;
    };
    debugInfo?: any;
  };
  error?: string;
  errorDetails?: any;
}

// Account data structure for processing emails
export interface AccountData {
  id: string;
  email: string;
  access_token: string;
  refresh_token: string;
  provider: string;
}

// Account result from the account handler
export interface AccountResult {
  success: boolean;
  accountData?: AccountData;
  error?: string;
}

// Email processing result
export interface EmailProcessingResult {
  synced: any[];
  failed: any[];
  uniqueSenders: Set<string>;
}
