
import React from "react";

export function LogsTableHeader() {
  return (
    <div className="grid grid-cols-[5%_25%_18%_17%_35%] w-full border-b border-border px-4 py-2.5 text-xs font-medium text-muted-foreground">
      <div className="flex items-center">#</div>
      <div className="flex items-center">Time</div>
      <div className="flex items-center">Status</div>
      <div className="flex items-center">Emails</div>
      <div className="flex items-center">Details</div>
    </div>
  );
}
