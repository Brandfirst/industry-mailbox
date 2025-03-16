
import { NewsletterSenderStats, SenderFrequencyAnalytics } from "@/lib/supabase/newsletters/types";
import { NewsletterCategory } from "@/lib/supabase/types";

export type SenderFrequencyData = {
  date: string;
  sender: string;
  count: number;
};

export type SortKey = "name" | "count" | "date";

export type UseNewsletterSendersState = {
  senders: NewsletterSenderStats[];
  categories: NewsletterCategory[];
  loading: boolean;
  searchTerm: string;
  sortKey: SortKey;
  sortAsc: boolean;
  refreshing: boolean;
  updatingCategory: boolean;
  updatingBrand: boolean;
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
