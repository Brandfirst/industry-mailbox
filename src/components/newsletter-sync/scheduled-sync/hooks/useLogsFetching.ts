
import { useEffect, useRef, useState } from "react";

export function useLogsFetching(
  selectedAccount: string | null,
  showLogs: boolean,
  fetchSyncLogs: () => Promise<void> | void
) {
  const initialFetchCompleted = useRef(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  // Force fetch logs when component mounts if logs should be shown
  useEffect(() => {
    if (selectedAccount && showLogs && !initialFetchCompleted.current) {
      console.log("SyncLogsList: Fetching logs on mount/account change");
      fetchSyncLogs();
      initialFetchCompleted.current = true;
    }
  }, [selectedAccount, showLogs, fetchSyncLogs]);
  
  // Reset the ref when selectedAccount changes
  useEffect(() => {
    initialFetchCompleted.current = false;
  }, [selectedAccount]);
  
  const handleRefresh = async () => {
    if (isRefreshing) return;
    
    setIsRefreshing(true);
    try {
      await Promise.resolve(fetchSyncLogs());
    } catch (error) {
      console.error("Error refreshing logs:", error);
    } finally {
      setIsRefreshing(false);
    }
  };
  
  return {
    isRefreshing,
    handleRefresh
  };
}
