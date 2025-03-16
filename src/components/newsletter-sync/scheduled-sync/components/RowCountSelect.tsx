
import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface RowCountSelectProps {
  value: string;
  onChange: (value: string) => void;
}

export function RowCountSelect({ value, onChange }: RowCountSelectProps) {
  return (
    <div className="flex items-center gap-2 ml-4">
      <span className="text-sm text-muted-foreground">Rows:</span>
      <Select
        value={value}
        onValueChange={onChange}
      >
        <SelectTrigger className="w-16 h-8">
          <SelectValue placeholder={value} />
        </SelectTrigger>
        <SelectContent className="bg-white text-black">
          <SelectItem value="5" className="text-black">5</SelectItem>
          <SelectItem value="10" className="text-black">10</SelectItem>
          <SelectItem value="15" className="text-black">15</SelectItem>
          <SelectItem value="20" className="text-black">20</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
