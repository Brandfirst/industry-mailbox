
import React, { memo } from 'react';
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarIcon } from "lucide-react";
import { format } from "date-fns";

interface DateRangePickerProps {
  dateRange: { from: Date | undefined, to: Date | undefined };
  setDateRange: (range: { from: Date | undefined, to: Date | undefined }) => void;
}

const DateRangePicker = ({ dateRange, setDateRange }: DateRangePickerProps) => {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <div className="grid gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={`justify-start text-left font-normal ${
                  dateRange.from ? "" : "text-muted-foreground"
                }`}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {dateRange.from ? format(dateRange.from, "PPP") : "Fra dato"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={dateRange.from}
                onSelect={(date) => setDateRange({ ...dateRange, from: date })}
                disabled={(date) => 
                  dateRange.to ? date > dateRange.to : false
                }
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
        
        <div className="grid gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={`justify-start text-left font-normal ${
                  dateRange.to ? "" : "text-muted-foreground"
                }`}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {dateRange.to ? format(dateRange.to, "PPP") : "Til dato"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={dateRange.to}
                onSelect={(date) => setDateRange({ ...dateRange, to: date })}
                disabled={(date) => 
                  dateRange.from ? date < dateRange.from : false
                }
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>
      
      {(dateRange.from || dateRange.to) && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setDateRange({ from: undefined, to: undefined })}
          className="h-8 px-2"
        >
          Nullstill dato
        </Button>
      )}
    </div>
  );
};

export default memo(DateRangePicker);
