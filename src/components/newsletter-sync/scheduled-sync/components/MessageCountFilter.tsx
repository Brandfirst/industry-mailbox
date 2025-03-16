
import React from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface MessageCountFilterProps {
  value: string;
  onChange: (value: string) => void;
}

export function MessageCountFilter({ value, onChange }: MessageCountFilterProps) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-xs font-medium">Min emails:</span>
      <Select 
        value={value} 
        onValueChange={onChange}
      >
        <SelectTrigger className="h-7 w-[80px] text-xs">
          <SelectValue placeholder="All" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All</SelectItem>
          <SelectItem value="1">≥ 1</SelectItem>
          <SelectItem value="5">≥ 5</SelectItem>
          <SelectItem value="10">≥ 10</SelectItem>
          <SelectItem value="20">≥ 20</SelectItem>
          <SelectItem value="50">≥ 50</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
