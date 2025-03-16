
import { useState, useEffect } from "react";
import { SyncLogEntry } from "@/lib/supabase/emailAccounts/syncLogs";

interface UsePaginatedLogsOptions {
  syncLogs: SyncLogEntry[];
  rowCount: string;
  messageCountFilter: string;
}

export function usePaginatedLogs({
  syncLogs,
  rowCount,
  messageCountFilter,
}: UsePaginatedLogsOptions) {
  const [currentPage, setCurrentPage] = useState(1);
  const [filteredLogs, setFilteredLogs] = useState<SyncLogEntry[]>([]);
  const itemsPerPage = parseInt(rowCount, 10);

  // Filter logs based on selected criteria
  useEffect(() => {
    if (!syncLogs) {
      setFilteredLogs([]);
      return;
    }

    let filtered = [...syncLogs];
    
    // Apply message count filter if not "all"
    if (messageCountFilter !== "all") {
      const minCount = parseInt(messageCountFilter, 10);
      filtered = filtered.filter(log => {
        // Include logs with message_count >= minCount
        return log.message_count && log.message_count >= minCount;
      });
    }
    
    setFilteredLogs(filtered);
    // Reset to first page when filters change
    setCurrentPage(1);
  }, [syncLogs, messageCountFilter]);
  
  // Get paginated logs
  const getPaginatedLogs = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredLogs.slice(startIndex, endIndex);
  };
  
  // Calculate total pages
  const totalPages = Math.ceil(filteredLogs.length / itemsPerPage);
  
  // Get page range for pagination display
  const getPageRange = () => {
    const range = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      // Show all pages if total pages are less than max visible
      for (let i = 1; i <= totalPages; i++) {
        range.push(i);
      }
    } else {
      // Always include first page
      range.push(1);
      
      let startPage = Math.max(2, currentPage - 1);
      let endPage = Math.min(totalPages - 1, currentPage + 1);
      
      // Adjust if at start or end
      if (currentPage <= 2) {
        endPage = Math.min(4, totalPages - 1);
      } else if (currentPage >= totalPages - 1) {
        startPage = Math.max(totalPages - 3, 2);
      }
      
      // Add ellipsis at start if needed
      if (startPage > 2) {
        range.push('ellipsis-start');
      }
      
      // Add middle pages
      for (let i = startPage; i <= endPage; i++) {
        range.push(i);
      }
      
      // Add ellipsis at end if needed
      if (endPage < totalPages - 1) {
        range.push('ellipsis-end');
      }
      
      // Always include last page
      if (totalPages > 1) {
        range.push(totalPages);
      }
    }
    
    return range;
  };

  // Calculate display details
  const paginatedLogs = getPaginatedLogs();
  const startIndex = (currentPage - 1) * itemsPerPage + 1;
  const endIndex = Math.min(startIndex + paginatedLogs.length - 1, filteredLogs.length);
  const totalEntriesText = `Showing ${startIndex}-${endIndex} of ${filteredLogs.length} entries`;

  return {
    filteredLogs,
    paginatedLogs,
    currentPage,
    setCurrentPage,
    totalPages,
    getPageRange,
    totalEntriesText,
    startIndex
  };
}
