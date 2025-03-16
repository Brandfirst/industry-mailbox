
import React from "react";
import { RowCountSelect } from "./RowCountSelect";
import { MessageCountFilter } from "./MessageCountFilter";

interface FilterControlsProps {
  rowCount: string;
  onRowCountChange: (value: string) => void;
  messageCountFilter: string;
  onMessageCountFilterChange: (value: string) => void;
}

export function FilterControls({
  rowCount,
  onRowCountChange,
  messageCountFilter,
  onMessageCountFilterChange
}: FilterControlsProps) {
  return (
    <div className="flex items-center gap-2">
      <RowCountSelect 
        value={rowCount} 
        onChange={onRowCountChange} 
      />
      
      <MessageCountFilter
        value={messageCountFilter}
        onChange={onMessageCountFilterChange}
      />
    </div>
  );
}
