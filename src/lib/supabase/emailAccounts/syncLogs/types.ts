
// Type definitions for sync logs

/**
 * Sync log entry data structure
 */
export interface SyncLogEntry {
  id: string;
  account_id: string;
  timestamp: string;
  status: 'success' | 'failed' | 'partial' | 'scheduled' | 'processing';
  message_count: number;
  error_message?: string | null;
  details?: any | null;
  sync_type?: 'manual' | 'scheduled';
}

/**
 * Sync log input for creating new log entries
 */
export interface SyncLogInput {
  account_id: string;
  status: SyncLogEntry['status'];
  message_count: number;
  error_message?: string | null;
  details?: any | null;
  timestamp?: string;
  sync_type?: 'manual' | 'scheduled';
}

/**
 * Sync schedule settings
 */
export interface SyncScheduleSettings {
  enabled: boolean;
  scheduleType: 'minute' | 'hourly' | 'daily' | 'disabled';
  hour?: number;
  updated_at?: string;
}
