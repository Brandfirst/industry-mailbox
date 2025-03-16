
import { useState } from "react";
import { NewsletterSenderStats } from "@/lib/supabase/newsletters";
import { SenderSortField } from "../components/SenderTableHeaders";

type SortDirection = 'asc' | 'desc';

export function useSenderListSorting() {
  const [sortField, setSortField] = useState<SenderSortField>('name');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

  const toggleSort = (field: SenderSortField) => {
    if (sortField === field) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const sortSenders = (senders: NewsletterSenderStats[]) => {
    return [...senders].sort((a, b) => {
      let comparison = 0;
      
      if (sortField === 'name') {
        const nameA = a.sender_name?.toLowerCase() || a.sender_email?.toLowerCase() || "";
        const nameB = b.sender_name?.toLowerCase() || b.sender_email?.toLowerCase() || "";
        comparison = nameA.localeCompare(nameB);
      } else if (sortField === 'newsletters') {
        comparison = (a.newsletter_count || 0) - (b.newsletter_count || 0);
      } else if (sortField === 'lastSync') {
        // Sort by last_sync_date, handling null values
        if (!a.last_sync_date) return 1;
        if (!b.last_sync_date) return -1;
        comparison = new Date(a.last_sync_date).getTime() - new Date(b.last_sync_date).getTime();
      } else if (sortField === 'brand') {
        const brandA = a.brand_name?.toLowerCase() || "";
        const brandB = b.brand_name?.toLowerCase() || "";
        comparison = brandA.localeCompare(brandB);
      } else if (sortField === 'category') {
        const catA = a.category_id || 0;
        const catB = b.category_id || 0;
        comparison = catA - catB;
      }
      
      return sortDirection === 'asc' ? comparison : -comparison;
    });
  };

  return {
    sortField,
    sortDirection,
    toggleSort,
    sortSenders
  };
}
