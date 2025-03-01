
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

/**
 * Newsletter sender statistics
 */
export interface NewsletterSenderStats {
  sender_email: string;
  sender_name: string | null;
  newsletter_count: number;
  last_sync_date: string | null;
  category_id: number | null;
  brand_name?: string | null;
  // We're not adding new fields to avoid breaking existing functionality
  // Analytics data will be stored separately
}

/**
 * Newsletter sender frequency data for analytics
 */
export interface SenderFrequencyAnalytics {
  sender_email: string;
  date: string;
  count: number;
}
