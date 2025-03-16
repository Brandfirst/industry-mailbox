
import React from "react";

export function LogsTableHeader() {
  return (
    <div className="bg-muted px-4 py-2 text-xs font-medium grid grid-cols-4 gap-2">
      <div>Time</div>
      <div>Status</div>
      <div>Messages</div>
      <div>Details</div>
    </div>
  );
}
