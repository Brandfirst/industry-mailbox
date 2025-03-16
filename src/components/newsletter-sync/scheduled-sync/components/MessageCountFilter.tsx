
import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface MessageCountFilterProps {
  value: number;
  onChange: (value: number) => void;
}

export function MessageCountFilter({ value, onChange }: MessageCountFilterProps) {
  const handleValueChange = (newValue: string) => {
    onChange(parseInt(newValue, 10));
  };

  return (
    <div className="flex items-center">
      <label className="text-xs text-muted-foreground mr-2">Min emails:</label>
      <Select
        value={value.toString()}
        onValueChange={handleValueChange}
      >
        <SelectTrigger className="h-8 w-[100px] text-xs">
          <SelectValue placeholder="Email count" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="0">All</SelectItem>
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
