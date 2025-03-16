
import { useState, useRef, useEffect } from "react";

export function usePagination(selectedAccount: string | null) {
  const [page, setPage] = useState(1);
  
  // Track account changes to prevent page reset issues
  const prevSelectedAccountRef = useRef<string | null>(null);
  
  // Reset page when account changes
  useEffect(() => {
    if (prevSelectedAccountRef.current !== selectedAccount) {
      prevSelectedAccountRef.current = selectedAccount;
      setPage(1); // Reset to first page when account changes
    }
  }, [selectedAccount]);

  return {
    page,
    setPage
  };
}
