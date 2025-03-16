
import React, { useState, useEffect } from "react";
import { SyncLogItem } from "./SyncLogItem";
import { LogsHeader } from "./components/LogsHeader";
import { LogsContainer } from "./components/LogsContainer";
import { LogsContent } from "./components/LogsContent";
import { SyncLogEntry } from "@/lib/supabase/emailAccounts/syncLogs";
import { LogsTableHeader } from "./components/LogsTableHeader";
import { AccountNotice } from "./components/AccountNotice";
import { useLogsFetching } from "./hooks/useLogsFetching";
import { useRealtimeSync } from "./hooks/useRealtimeSync";
import { 
  Pagination, 
  PaginationContent, 
  PaginationItem, 
  PaginationLink, 
  PaginationNext, 
  PaginationPrevious 
} from "@/components/ui/pagination";

interface SyncLogsListProps {
  showLogs: boolean;
  setShowLogs: (show: boolean) => void;
  isLoading: boolean;
  syncLogs: SyncLogEntry[];
  selectedAccount: string | null;
  fetchSyncLogs: () => void;
  formatTimestamp: (timestamp: string) => string;
  setSyncLogs: React.Dispatch<React.SetStateAction<SyncLogEntry[]>>;
}

export function SyncLogsList({
  showLogs,
  setShowLogs,
  isLoading,
  syncLogs,
  selectedAccount,
  fetchSyncLogs,
  formatTimestamp,
  setSyncLogs
}: SyncLogsListProps) {
  const [rowCount, setRowCount] = useState<string>("10");
  const [filteredLogs, setFilteredLogs] = useState<SyncLogEntry[]>([]);
  const [messageCountFilter, setMessageCountFilter] = useState<string>("1"); // Set default to "1" (≥ 1)
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = parseInt(rowCount, 10);
  
  // Use our custom hooks for log fetching and refreshing
  const { isRefreshing, handleRefresh } = useLogsFetching(
    selectedAccount, 
    showLogs, 
    fetchSyncLogs
  );
  
  // Use realtime sync for live updates
  useRealtimeSync(selectedAccount, showLogs, setSyncLogs);

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
  
  if (!showLogs) {
    return (
      <div className="mt-4 pt-4 border-t border-gray-200">
        <LogsHeader 
          title="Sync History" 
          onToggle={() => setShowLogs(true)}
          onRefresh={handleRefresh}
          isRefreshing={isRefreshing}
          showLogs={false}
        />
      </div>
    );
  }

  const paginatedLogs = getPaginatedLogs();
  const totalEntriesText = `Showing ${paginatedLogs.length} of ${filteredLogs.length} entries`;

  return (
    <div className="mt-4 pt-4 border-t border-gray-200">
      <LogsHeader 
        title="Sync History" 
        onToggle={() => setShowLogs(false)}
        rowCount={rowCount}
        onRowCountChange={setRowCount}
        messageCountFilter={messageCountFilter}
        onMessageCountFilterChange={setMessageCountFilter}
        onRefresh={handleRefresh}
        isRefreshing={isRefreshing}
      />
      
      <LogsContainer>
        {!selectedAccount ? (
          <AccountNotice />
        ) : isLoading || isRefreshing ? (
          <div className="flex justify-center items-center p-8">
            <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
          </div>
        ) : filteredLogs.length === 0 ? (
          <div className="text-center p-8 text-muted-foreground">
            {syncLogs.length > 0 
              ? "No sync logs match your current filters"
              : "No sync history available yet"}
          </div>
        ) : (
          <>
            <div className="text-xs text-muted-foreground p-2">{totalEntriesText}</div>
            <LogsContent>
              <LogsTableHeader />
              {paginatedLogs.map((log) => {
                // Find the log's original position in the full list to determine its number
                const originalIndex = syncLogs.findIndex(item => item.id === log.id);
                
                // Calculate row number based on original position in full list
                // Use the length of the total logs to show most recent items with higher numbers
                // This ensures the latest log has the highest number
                const itemNumber = syncLogs.length - originalIndex;
                
                return (
                  <SyncLogItem 
                    key={log.id} 
                    log={log} 
                    formatTimestamp={formatTimestamp}
                    itemNumber={itemNumber}
                    totalItems={filteredLogs.length}
                  />
                );
              })}
            </LogsContent>
            
            {totalPages > 1 && (
              <div className="p-2 flex justify-center">
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious 
                        onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                        disabled={currentPage === 1}
                      />
                    </PaginationItem>
                    
                    {getPageRange().map((page, index) => {
                      if (page === 'ellipsis-start' || page === 'ellipsis-end') {
                        return (
                          <PaginationItem key={`ellipsis-${index}`}>
                            <span className="h-8 w-8 flex items-center justify-center">...</span>
                          </PaginationItem>
                        );
                      }
                      
                      return (
                        <PaginationItem key={`page-${page}`}>
                          <PaginationLink
                            isActive={currentPage === page}
                            onClick={() => setCurrentPage(Number(page))}
                          >
                            {page}
                          </PaginationLink>
                        </PaginationItem>
                      );
                    })}
                    
                    <PaginationItem>
                      <PaginationNext 
                        onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                        disabled={currentPage === totalPages}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            )}
          </>
        )}
      </LogsContainer>
    </div>
  );
}
