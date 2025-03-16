
import React from "react";

export function LogsTableHeader() {
  return (
    <div className="grid grid-cols-[5%_25%_18%_17%_35%] w-full border-b border-border px-4 py-2.5 text-xs font-medium text-muted-foreground">
      <div>#</div>
      <div>Time</div>
      <div>Status</div>
      <div>Emails</div>
      <div>Details</div>
    </div>
  );
}
