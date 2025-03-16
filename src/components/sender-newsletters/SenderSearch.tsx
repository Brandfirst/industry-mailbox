
import React from 'react';
import SearchBar from '@/components/SearchBar';
import { TimePeriodOption } from '@/components/search/filters/TimePeriodFilter';

interface SenderSearchProps {
  senderName: string;
  onSearch: (query: string) => void;
  onPeriodChange?: (period: TimePeriodOption) => void;
  selectedPeriod?: TimePeriodOption;
}

const SenderSearch = ({ 
  senderName, 
  onSearch, 
  onPeriodChange,
  selectedPeriod = "all"
}: SenderSearchProps) => {
  return (
    <div className="py-4 sm:py-6 px-4 md:px-6 lg:px-8 bg-slate-50 border-b border-slate-200">
      <div className="max-w-6xl mx-auto">
        <SearchBar 
          placeholder={`Search ${senderName} newsletters...`}
          onSearch={onSearch}
          onPeriodChange={onPeriodChange}
          selectedPeriod={selectedPeriod}
        />
      </div>
    </div>
  );
};

export default SenderSearch;
