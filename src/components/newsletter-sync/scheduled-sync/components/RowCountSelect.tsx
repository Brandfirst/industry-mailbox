
import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface RowCountSelectProps {
  value: number;
  onChange: (value: number) => void;
}

export function RowCountSelect({ value, onChange }: RowCountSelectProps) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-muted-foreground">Rows:</span>
      <Select
        value={value.toString()}
        onValueChange={(val) => onChange(parseInt(val))}
      >
        <SelectTrigger className="w-16 h-8">
          <SelectValue placeholder={value.toString()} />
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
