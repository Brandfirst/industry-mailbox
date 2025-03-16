
import React from "react";

export function LogsTableHeader() {
  return (
    <div className="grid grid-cols-[25%_20%_20%_35%] w-full border-b border-border px-4 py-2.5 text-xs font-medium text-muted-foreground">
      <div>Time</div>
      <div>Status</div>
      <div>Messages</div>
      <div>Details</div>
    </div>
  );
}
