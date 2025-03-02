
import React, { memo } from 'react';
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Plus, Search } from "lucide-react";
import { Input } from "@/components/ui/input";

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
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Avatar className="h-16 w-16 border">
          <div className="font-semibold text-xl">
            {senderBrands[0]?.sender_name?.charAt(0)?.toUpperCase() || 'S'}
          </div>
        </Avatar>
        <div>
          <h3 className="text-xl font-bold">{senderBrands[0]?.sender_name || 'Sender'}</h3>
          <p className="text-sm text-muted-foreground">{senderBrands[0]?.sender_email}</p>
        </div>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-3">
        <Button variant="outline" className="flex items-center gap-2">
          <Plus className="h-4 w-4" /> Follow
        </Button>
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search newsletters..." className="pl-8" />
        </div>
      </div>
      
      <div>
        <h4 className="text-lg font-semibold mb-2">Recent Emails</h4>
        <div className="text-sm text-muted-foreground mb-4">
          {senderBrands[0]?.count || 0} newsletters available
        </div>
      </div>
    </div>
  );
};

export default memo(SenderFilter);
