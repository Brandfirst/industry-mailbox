
import React, { memo } from 'react';
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
  
  return (
    <div className="space-y-4">
      <Popover>
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
                  selected={dateRange.from}
                  onSelect={(date) => setDateRange({ ...dateRange, from: date })}
                  disabled={(date) => 
                    dateRange.to ? date > dateRange.to : false
                  }
                  initialFocus
                />
              </div>
              
              <div>
                <h4 className="text-sm font-medium mb-2">Til dato</h4>
                <Calendar
                  mode="single"
                  selected={dateRange.to}
                  onSelect={(date) => setDateRange({ ...dateRange, to: date })}
                  disabled={(date) => 
                    dateRange.from ? date < dateRange.from : false
                  }
                />
              </div>
            </div>
            
            {hasDateSelected && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setDateRange({ from: undefined, to: undefined })}
                className="w-full"
              >
                <X className="h-4 w-4 mr-1" />
                Nullstill datoer
              </Button>
            )}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default memo(DateRangePicker);
