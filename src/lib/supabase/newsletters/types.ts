import { Newsletter, NewsletterCategory } from "../types";

// Define interface for the filter options
export interface NewsletterFilterOptions {
  searchQuery?: string;
  sender?: string;
  categoryId?: number | string;
  fromDate?: Date | string;
  toDate?: Date | string;
  page?: number;
  limit?: number;
  industries?: string[];
  accountId?: string;
}

export interface DeleteNewslettersResponse {
  success: boolean;
  count: number;
}

export interface NewsletterQueryResult {
  data: Newsletter[];
  count: number | null;
}

export interface NewsletterSenderStats {
  sender_email: string;
  sender_name: string;
  newsletter_count: number;
  last_sync_date: string | null;
  category_id: number | null;
}
