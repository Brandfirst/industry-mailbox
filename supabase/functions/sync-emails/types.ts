
/**
 * Request data structure for sync operation
 */
export interface SyncRequestData {
  accountId: string;
  debug?: boolean;
  verbose?: boolean;
  import_all_emails?: boolean;
}

/**
 * Response data structure for sync operation
 */
export interface SyncResponseData {
  success: boolean;
  partial?: boolean;
  count?: number;
  synced?: any[];
  failed?: any[];
  warning?: string | null;
  error?: string;
  details?: {
    accountEmail?: string;
    provider?: string;
    totalEmails?: number;
    syncedCount?: number;
    failedCount?: number;
    new_senders_count?: number;
    requiresReauthentication?: boolean;
    [key: string]: any;
  };
  debugInfo?: {
    timestamp: string;
    accountId: string;
    emailsProcessed: number;
    mock: boolean;
  } | null;
}

/**
 * Interface for email data
 */
export interface EmailData {
  id: string;
  threadId: string;
  subject: string;
  sender: string;
  sender_email: string;
  date: string;
  html?: string;
  snippet?: string;
  labelIds?: string[];
}
