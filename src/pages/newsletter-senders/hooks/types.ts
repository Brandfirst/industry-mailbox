
import { NewsletterSenderStats, SenderFrequencyAnalytics } from "@/lib/supabase/newsletters/types";
import { NewsletterCategory } from "@/lib/supabase/types";
import { SenderSortField } from "@/components/newsletter-senders/components/SenderTableHeaders";

export type SenderFrequencyData = {
  date: string;
  sender: string;
  count: number;
};

// Changed SortKey to match SenderSortField from SenderTableHeaders component
export type SortKey = SenderSortField;

export type UseNewsletterSendersState = {
  senders: NewsletterSenderStats[];
  categories: NewsletterCategory[];
  loading: boolean;
  searchTerm: string;
  sortKey: SortKey;
  sortAsc: boolean;
  refreshing: boolean;
  updatingCategory: string | null; // Changed from boolean to string | null to match expected types
  updatingBrand: string | null; // Changed from boolean to string | null
  deleting: boolean;
  frequencyData: SenderFrequencyData[] | null;
  loadingAnalytics: boolean;
};

export type UseNewsletterSendersResult = UseNewsletterSendersState & {
  setSearchTerm: (term: string) => void;
  handleRefresh: () => Promise<void>;
  handleCategoryChange: (senderEmail: string, categoryId: number | null) => Promise<void>;
  handleBrandChange: (senderEmail: string, brandName: string) => Promise<void>;
  handleDeleteSenders: (senderEmails: string[]) => Promise<void>;
  toggleSort: (key: SortKey) => void;
  filteredSenders: NewsletterSenderStats[];
};
