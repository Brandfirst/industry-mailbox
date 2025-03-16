
import React from 'react';
import SearchBar from '@/components/SearchBar';

interface SenderSearchProps {
  senderName: string;
  onSearch: (query: string) => void;
}

const SenderSearch = ({ senderName, onSearch }: SenderSearchProps) => {
  return (
    <div className="container px-4 md:px-6 mb-8">
      <SearchBar 
        onSearch={onSearch}
        placeholder={`Søk i nyhetsbrev fra ${senderName}...`}
      />
    </div>
  );
};

export default SenderSearch;
