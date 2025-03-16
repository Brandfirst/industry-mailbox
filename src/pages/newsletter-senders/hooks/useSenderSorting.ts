
import { useState, useCallback } from "react";
import { NewsletterSenderStats } from "@/lib/supabase/newsletters/types";
import { SortKey } from "./types";

export function useSenderSorting() {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("name");
  const [sortAsc, setSortAsc] = useState(true);

  const toggleSort = useCallback((key: SortKey) => {
    if (sortKey === key) {
      setSortAsc(!sortAsc);
    } else {
      setSortKey(key);
      setSortAsc(true);
    }
  }, [sortKey, sortAsc]);

  const filterSenders = useCallback((senders: NewsletterSenderStats[]) => {
    return senders
      .filter(sender => {
        const senderName = sender.sender_name?.toLowerCase() || "";
        const senderEmail = sender.sender_email?.toLowerCase() || "";
        const term = searchTerm.toLowerCase();
        return senderName.includes(term) || senderEmail.includes(term);
      })
      .sort((a, b) => {
        let comparison = 0;
        
        if (sortKey === "name") {
          const nameA = a.sender_name?.toLowerCase() || a.sender_email?.toLowerCase() || "";
          const nameB = b.sender_name?.toLowerCase() || b.sender_email?.toLowerCase() || "";
          comparison = nameA.localeCompare(nameB);
        } else if (sortKey === "count") {
          comparison = (a.newsletter_count || 0) - (b.newsletter_count || 0);
        } else if (sortKey === "date") {
          const dateA = a.last_sync_date ? new Date(a.last_sync_date).getTime() : 0;
          const dateB = b.last_sync_date ? new Date(b.last_sync_date).getTime() : 0;
          comparison = dateA - dateB;
        }
        
        return sortAsc ? comparison : -comparison;
      });
  }, [searchTerm, sortKey, sortAsc]);

  return {
    searchTerm,
    setSearchTerm,
    sortKey,
    sortAsc,
    toggleSort,
    filterSenders
  };
}
