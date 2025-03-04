
/**
 * Result of a sync operation
 */
export interface SyncResult {
  success: boolean;
  error?: string;
  count?: number;
  synced?: any[];
  failed?: any[];
  partial?: boolean;
  warning?: string;
  details?: any;
  statusCode?: number;
  timestamp: number;
  requiresReauthentication?: boolean;
}
