
import React from "react";

export function LogsTableHeader() {
  return (
    <div className="grid grid-cols-[25%_20%_20%_35%] w-full gap-2 bg-muted px-4 py-2 text-xs font-medium">
      <div>Time</div>
      <div>Status</div>
      <div>Messages</div>
      <div>Details</div>
    </div>
  );
}
