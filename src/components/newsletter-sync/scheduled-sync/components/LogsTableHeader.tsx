
import React from "react";

export function LogsTableHeader() {
  return (
    <div className="bg-muted px-4 py-2 text-xs font-medium grid grid-cols-[25%_20%_20%_35%] gap-2">
      <div>Time</div>
      <div>Status</div>
      <div>Messages</div>
      <div>Details</div>
    </div>
  );
}
