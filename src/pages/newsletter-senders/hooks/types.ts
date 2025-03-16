
export type SortKey = "name" | "newsletters" | "lastSync" | "brand" | "category";

export interface UseNewsletterSendersResult {
  senders: any[];
  categories: any[];
  loading: boolean;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  sortKey: SortKey;
  sortAsc: boolean;
  refreshing: boolean;
  updatingCategory: string | null;
  updatingBrand: string | null;
  deleting: boolean;
  frequencyData: any;
  loadingAnalytics: boolean;
  handleRefresh: () => void;
  handleCategoryChange: (senderEmail: string, categoryId: number | null) => void;
  handleBrandChange: (senderEmail: string, brandName: string) => void;
  handleDeleteSenders: (senderEmails: string[]) => void;
  toggleSort: (key: SortKey) => void;
  filteredSenders: any[];
}
