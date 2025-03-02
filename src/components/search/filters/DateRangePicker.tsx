
import React, { useState, memo, useCallback } from 'react';
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X } from 'lucide-react';

interface DateRangePickerProps {
  dateRange: { from: Date | undefined, to: Date | undefined };
  setDateRange: (range: { from: Date | undefined, to: Date | undefined }) => void;
}

const DateRangePicker = ({ dateRange, setDateRange }: DateRangePickerProps) => {
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  
  // Format date for display
  const formatDateRange = () => {
    if (!dateRange.from && !dateRange.to) return '';
    
    const formatDate = (date: Date | undefined) => {
      if (!date) return '';
      return date.toISOString().split('T')[0];
    };
    
    return `${formatDate(dateRange.from)} — ${formatDate(dateRange.to)}`;
  };

  // Clear date range
  const handleClearDateRange = useCallback(() => {
    setDateRange({ from: undefined, to: undefined });
    setIsDatePickerOpen(false);
  }, [setDateRange]);

  // Toggle date picker
  const toggleDatePicker = useCallback(() => {
    setIsDatePickerOpen(prev => !prev);
  }, []);

  // Handle calendar selection
  const handleCalendarSelect = useCallback((range: { from: Date | undefined; to: Date | undefined } | undefined) => {
    if (range) {
      setDateRange({
        from: range.from,
        to: range.to
      });
      if (range.to) setIsDatePickerOpen(false);
    }
  }, [setDateRange]);

  return (
    <div className="space-y-2">
      <h4 className="text-sm font-medium">Dato</h4>
      <div className="border rounded-md">
        <div className="flex">
          <Button
            type="button"
            variant="ghost"
            className={`flex-1 rounded-md ${!isDatePickerOpen ? 'bg-muted' : ''}`}
            onClick={toggleDatePicker}
          >
            Datoområde
          </Button>
        </div>
      </div>
      
      <div className="relative">
        <Input
          type="text"
          placeholder="Velg datoer"
          className="w-full cursor-pointer"
          value={formatDateRange()}
          onClick={toggleDatePicker}
          readOnly
        />
        
        {(dateRange.from || dateRange.to) ? (
          <Button
            variant="ghost"
            size="sm"
            className="absolute right-1 top-1/2 transform -translate-y-1/2"
            onClick={handleClearDateRange}
          >
            <X className="h-4 w-4" />
          </Button>
        ) : null}
        
        {isDatePickerOpen && (
          <div className="absolute z-50 mt-2 bg-popover border rounded-md shadow-md">
            <div className="p-2 bg-muted/30 border-b flex items-center justify-between">
              <span className="text-sm font-medium">
                {dateRange.from && dateRange.to 
                  ? 'Valgt periode' 
                  : dateRange.from 
                    ? 'Velg sluttdato' 
                    : 'Velg startdato'}
              </span>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleClearDateRange}
              >
                Nullstill
              </Button>
            </div>
            <Calendar
              initialFocus
              mode="range"
              defaultMonth={dateRange.from}
              selected={{
                from: dateRange.from,
                to: dateRange.to
              }}
              onSelect={handleCalendarSelect}
              className="rounded-md"
            />
          </div>
        )}
      </div>
      
      <p className="text-xs text-muted-foreground">
        30 dagers søkegrense. Oppgrader for å søke lenger tilbake.
      </p>
    </div>
  );
};

export default memo(DateRangePicker);
