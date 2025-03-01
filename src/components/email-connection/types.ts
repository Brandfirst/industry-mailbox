
export interface EmailAccount {
  id: string;
  email: string;
  created_at: string;
  last_sync: string | null;
  provider?: string;
  user_id?: string;
}

export interface SyncResult {
  count: number;
  timestamp: number;
}

// Add a selection state interface for newsletters
export interface NewsletterSelectionState {
  selectedIds: number[];
  allSelected: boolean;
}
