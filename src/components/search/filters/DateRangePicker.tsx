
import React, { memo, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarIcon, X } from "lucide-react";
import { format } from "date-fns";

interface DateRangePickerProps {
  dateRange: { from: Date | undefined, to: Date | undefined };
  setDateRange: (range: { from: Date | undefined, to: Date | undefined }) => void;
}

const DateRangePicker = ({ dateRange, setDateRange }: DateRangePickerProps) => {
  const hasDateSelected = dateRange.from || dateRange.to;
  const [tempDateRange, setTempDateRange] = useState<{ from: Date | undefined, to: Date | undefined }>(dateRange);
  const [open, setOpen] = useState(false);
  
  const handleApply = () => {
    setDateRange(tempDateRange);
    setOpen(false);
  };
  
  const handleClear = () => {
    const clearedRange = { from: undefined, to: undefined };
    setTempDateRange(clearedRange);
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
            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
              <div>
                <h4 className="text-sm font-medium mb-2">Fra dato</h4>
                <Calendar
                  mode="single"
                  selected={tempDateRange.from}
                  onSelect={(date) => setTempDateRange({ ...tempDateRange, from: date })}
                  disabled={(date) => 
                    tempDateRange.to ? date > tempDateRange.to : false
                  }
                  initialFocus
                />
              </div>
              
              <div>
                <h4 className="text-sm font-medium mb-2">Til dato</h4>
                <Calendar
                  mode="single"
                  selected={tempDateRange.to}
                  onSelect={(date) => setTempDateRange({ ...tempDateRange, to: date })}
                  disabled={(date) => 
                    tempDateRange.from ? date < tempDateRange.from : false
                  }
                />
              </div>
            </div>
            
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
