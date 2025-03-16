
import { useState } from "react";
import { NewsletterSenderStats } from "@/lib/supabase/newsletters";

type SortField = 'name' | 'count' | 'last_sync';
type SortDirection = 'asc' | 'desc';

export function useSenderListSorting() {
  const [sortField, setSortField] = useState<SortField>('name');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

  const toggleSort = (field: SortField) => {
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
      } else if (sortField === 'count') {
        comparison = (a.newsletter_count || 0) - (b.newsletter_count || 0);
      } else if (sortField === 'last_sync') {
        if (!a.last_sync_date) return 1;
        if (!b.last_sync_date) return -1;
        comparison = new Date(a.last_sync_date).getTime() - new Date(b.last_sync_date).getTime();
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
