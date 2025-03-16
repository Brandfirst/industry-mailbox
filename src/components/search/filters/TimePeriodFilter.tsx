
import React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Clock } from 'lucide-react';

export type TimePeriodOption = 
  | 'all'
  | 'last30emails' 
  | 'last30days' 
  | 'lastyear'
  | '2025'
  | '2024'
  | '2023'
  | '2022';

interface TimePeriodFilterProps {
  selectedPeriod: TimePeriodOption;
  onPeriodChange: (period: TimePeriodOption) => void;
}

const TimePeriodFilter: React.FC<TimePeriodFilterProps> = ({
  selectedPeriod,
  onPeriodChange
}) => {
  return (
    <div className="relative w-full sm:min-w-[150px]">
      <Select
        value={selectedPeriod}
        onValueChange={(value) => onPeriodChange(value as TimePeriodOption)}
      >
        <SelectTrigger className="w-full bg-white border-border flex items-center gap-2 h-[42px] md:h-10">
          <Clock className="h-4 w-4 text-muted-foreground" />
          <SelectValue placeholder="Filter by period" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Time</SelectItem>
          <SelectItem value="last30emails">Last 30 Emails</SelectItem>
          <SelectItem value="last30days">Last 30 Days</SelectItem>
          <SelectItem value="lastyear">Last Year</SelectItem>
          <SelectItem value="2025">2025</SelectItem>
          <SelectItem value="2024">2024</SelectItem>
          <SelectItem value="2023">2023</SelectItem>
          <SelectItem value="2022">2022</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default TimePeriodFilter;
