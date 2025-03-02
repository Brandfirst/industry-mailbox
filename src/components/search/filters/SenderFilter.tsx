
import React from 'react';
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

interface SenderBrand {
  sender_email: string;
  sender_name: string;
  count: number;
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
  if (senderBrands.length === 0) return null;
  
  return (
    <div className="space-y-2">
      <h4 className="text-sm font-medium">Avsendere</h4>
      <div className="space-y-2 max-h-60 overflow-y-auto">
        {senderBrands.map((brand) => (
          <div key={brand.sender_email} className="flex items-center space-x-2">
            <Checkbox 
              id={`brand-${brand.sender_email}`} 
              checked={selectedBrands.includes(brand.sender_email)} 
              onCheckedChange={(checked) => handleBrandChange(brand.sender_email, !!checked)}
            />
            <Label htmlFor={`brand-${brand.sender_email}`} className="cursor-pointer">
              {brand.sender_name || brand.sender_email}
            </Label>
            <span className="text-sm text-muted-foreground ml-auto">
              {brand.count || 0}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SenderFilter;
