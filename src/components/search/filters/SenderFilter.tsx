
import React, { memo, useState } from 'react';
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface SenderBrand {
  sender_email: string;
  sender_name: string;
  count: number;
  brand_name?: string;
}

interface SenderFilterProps {
  senderBrands: SenderBrand[];
  selectedBrands: string[];
  handleBrandChange: (brand: string, checked: boolean) => void;
}

const SenderFilter = ({ 
  senderBrands, 
  selectedBrands, 
  handleBrandChange 
}: SenderFilterProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  
  const filteredBrands = senderBrands.filter(brand => {
    const displayName = brand.brand_name || brand.sender_name;
    return (
      displayName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      brand.sender_email.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });
  
  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Søk avsendere..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-8"
        />
      </div>
      
      <div className="max-h-[200px] overflow-y-auto space-y-2">
        {filteredBrands.length === 0 ? (
          <p className="text-sm text-muted-foreground">Ingen avsendere funnet</p>
        ) : (
          filteredBrands.map((brand) => {
            // Use brand_name if available, otherwise fall back to sender_name
            const displayName = brand.brand_name || brand.sender_name;
            
            return (
              <div key={brand.sender_email} className="flex items-start space-x-2">
                <Checkbox
                  id={`brand-${brand.sender_email}`}
                  checked={selectedBrands.includes(brand.sender_email)}
                  onCheckedChange={(checked) => 
                    handleBrandChange(brand.sender_email, checked === true)
                  }
                />
                <Label 
                  htmlFor={`brand-${brand.sender_email}`}
                  className="text-sm cursor-pointer leading-tight"
                >
                  <span className="font-medium">{displayName} <span className="text-xs text-muted-foreground">({brand.count})</span></span>
                </Label>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default memo(SenderFilter);
