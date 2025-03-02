
import React, { memo, useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarIcon, X } from "lucide-react";
import { format } from "date-fns";
import { DateRange } from "react-day-picker";

interface DateRangePickerProps {
  dateRange: { from: Date | undefined, to: Date | undefined };
  setDateRange: (range: { from: Date | undefined, to: Date | undefined }) => void;
}

const DateRangePicker = ({ dateRange, setDateRange }: DateRangePickerProps) => {
  const hasDateSelected = dateRange.from || dateRange.to;
  const [tempDateRange, setTempDateRange] = useState<DateRange | undefined>(
    dateRange.from ? { from: dateRange.from, to: dateRange.to } : undefined
  );
  const [open, setOpen] = useState(false);
  
  // Reset temp date range when the popover opens to match current dateRange
  useEffect(() => {
    if (open) {
      setTempDateRange(dateRange.from ? { from: dateRange.from, to: dateRange.to } : undefined);
    }
  }, [open, dateRange]);
  
  const handleApply = () => {
    if (tempDateRange) {
      setDateRange({ 
        from: tempDateRange.from, 
        to: tempDateRange.to 
      });
    }
    setOpen(false);
  };
  
  const handleClear = () => {
    const clearedRange = { from: undefined, to: undefined };
    setTempDateRange(undefined);
    setDateRange(clearedRange);
    setOpen(false);
  };
  
  return (
    <div className="space-y-4">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={`w-full justify-start text-left font-normal ${
              hasDateSelected ? "" : "text-muted-foreground"
            }`}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {hasDateSelected ? (
              <span>
                {dateRange.from && format(dateRange.from, "MMM d, yyyy")} 
                {dateRange.from && dateRange.to && " - "} 
                {dateRange.to && format(dateRange.to, "MMM d, yyyy")}
              </span>
            ) : (
              "Velg datoperiode"
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <div className="p-4 space-y-4">
            <Calendar
              mode="range"
              defaultMonth={dateRange.from || new Date()}
              selected={tempDateRange}
              onSelect={setTempDateRange}
              numberOfMonths={1}
              captionLayout="dropdown-buttons"
              fromYear={2020}
              toYear={2030}
              initialFocus
            />
            
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleClear}
                className="flex-1"
              >
                <X className="h-4 w-4 mr-1" />
                Nullstill
              </Button>
              <Button
                size="sm"
                onClick={handleApply}
                className="flex-1"
              >
                Bruk datoer
              </Button>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default memo(DateRangePicker);
