
import { NewsletterCategory } from "@/lib/supabase/types";
import { NewsletterSenderStats } from "@/lib/supabase/newsletters";

type SortField = 'name' | 'count' | 'last_sync';
type SortDirection = 'asc' | 'desc';

// Get category name by ID
export const getCategoryNameById = (
  categoryId: number | null, 
  categories: NewsletterCategory[]
) => {
  if (!categoryId) return "Uncategorized";
  const category = categories.find(cat => cat.id === categoryId);
  return category ? category.name : "Uncategorized";
};

// Get category color by ID
export const getCategoryColorById = (
  categoryId: number | null, 
  categories: NewsletterCategory[]
) => {
  if (!categoryId) return "#666666";
  const category = categories.find(cat => cat.id === categoryId);
  return category ? category.color : "#666666";
};

// Filter and sort senders
export const filterAndSortSenders = (
  senders: NewsletterSenderStats[],
  searchTerm: string,
  sortField: SortField,
  sortDirection: SortDirection
) => {
  return senders
    .filter(sender => 
      sender.sender_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sender.sender_email?.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      let comparison = 0;
      
      if (sortField === 'name') {
        const nameA = a.sender_name?.toLowerCase() || a.sender_email?.toLowerCase() || "";
        const nameB = b.sender_name?.toLowerCase() || b.sender_email?.toLowerCase() || "";
        comparison = nameA.localeCompare(nameB);
      } else if (sortField === 'count') {
        comparison = (a.newsletter_count || 0) - (b.newsletter_count || 0);
      } else if (sortField === 'last_sync') {
        // Sort by last_sync_date, handling null values
        if (!a.last_sync_date) return 1;
        if (!b.last_sync_date) return -1;
        comparison = new Date(a.last_sync_date).getTime() - new Date(b.last_sync_date).getTime();
      }
      
      return sortDirection === 'asc' ? comparison : -comparison;
    });
};
