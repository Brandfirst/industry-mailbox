
/**
 * Type definitions for sync logs
 */

export interface SyncLogEntry {
  id?: string;
  account_id: string;
  timestamp: string;
  status: 'success' | 'failed' | 'scheduled';
  message_count: number;
  error_message?: string;
  details?: any;
  sync_type?: 'manual' | 'scheduled';
}

export interface SyncSchedule {
  enabled: boolean;
  scheduleType: string;
  hour?: number;
  lastUpdated?: string;
}
