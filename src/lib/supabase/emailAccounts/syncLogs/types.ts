
export interface SyncLogEntry {
  id: string;
  account_id: string;
  timestamp: string;
  message_count: number;
  status: "scheduled" | "processing" | "success" | "failed" | "partial";
  error_message?: string | null;
  details?: {
    schedule_type?: string;
    hour?: number | null;
    total_emails?: number;
    synced_count?: number;
    failed_count?: number;
    new_senders_count?: number;
    accountEmail?: string;
    synced?: any[];
    [key: string]: any;
  } | null;
  sync_type?: "manual" | "scheduled";
  account?: {
    id: string;
    email: string;
  };
}

export interface SyncLogInput {
  account_id: string;
  status: "scheduled" | "processing" | "success" | "failed" | "partial";
  message_count: number;
  error_message?: string | null;
  details?: Record<string, any> | null;
  sync_type?: "manual" | "scheduled";
}

export type ScheduleOption = "minute" | "hourly" | "daily" | "disabled";

export interface SyncScheduleSettings {
  enabled: boolean;
  scheduleType: ScheduleOption;
  hour?: number | null;
  updated_at?: string;
}
