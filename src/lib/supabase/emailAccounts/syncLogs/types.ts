
export interface SyncLogEntry {
  id: string;
  account_id: string;
  timestamp: string;
  status: 'success' | 'failed' | 'partial' | 'scheduled';
  message_count: number;
  error_message?: string;
  details?: {
    [key: string]: any;
  };
  sync_type?: 'manual' | 'scheduled';
}

export interface SyncLogInput {
  account_id: string;
  status: SyncLogEntry['status'];
  message_count: number;
  error_message?: string;
  details?: {
    [key: string]: any;
  };
  timestamp: string;
  sync_type?: 'manual' | 'scheduled';
}

export interface SyncScheduleSettings {
  enabled: boolean;
  scheduleType: 'minute' | 'hourly' | 'daily' | 'disabled';
  hour?: number;
  updated_at?: string;
}
