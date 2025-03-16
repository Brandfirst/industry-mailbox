
import React from "react";
import { Badge } from "@/components/ui/badge";
import { SyncLogEntry } from "@/lib/supabase/emailAccounts/syncLogs";

interface StatusBadgeProps {
  status: SyncLogEntry["status"];
}

export function StatusBadge({ status }: StatusBadgeProps) {
  // Get status display configuration
  const getStatusDisplay = (status: SyncLogEntry["status"]) => {
    switch(status?.toLowerCase()) {
      case "success":
        return {
          label: "Success",
          className: "bg-green-100 text-green-800"
        };
      case "failed":
        return {
          label: "Failed",
          className: "bg-red-100 text-red-800"
        };
      case "scheduled":
        return {
          label: "Scheduled",
          className: "bg-blue-100 text-blue-800"
        };
      case "processing":
        return {
          label: "Processing",
          className: "bg-yellow-100 text-yellow-800"
        };
      case "partial":
        return {
          label: "Partial",
          className: "bg-orange-100 text-orange-800"
        };
      default:
        return {
          label: status || "Unknown",
          className: "bg-gray-100 text-gray-800"
        };
    }
  };
  
  const statusDisplay = getStatusDisplay(status);
  
  return (
    <Badge className={`inline-block px-2 py-1 rounded text-xs ${statusDisplay.className}`}>
      {statusDisplay.label}
    </Badge>
  );
}
