
import React, { memo } from 'react';
import { NewsletterCategory } from '@/lib/supabase/types';
import { Button } from "@/components/ui/button";
import { User } from 'lucide-react';
import { 
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger
} from "@/components/ui/collapsible";
import SenderFilter from './SenderFilter';

interface SenderBrand {
  sender_email: string;
  sender_name: string;
  count: number;
}

interface DesktopFilterSidebarProps {
  isOpen: boolean;
  toggleDesktopFilters: () => void;
  categories: NewsletterCategory[];
  selectedCategory: string;
  handleCategoryChange: (categoryId: string) => void;
  senderBrands: SenderBrand[];
  selectedBrands: string[];
  handleBrandChange: (brand: string, checked: boolean) => void;
  dateRange: { from: Date | undefined, to: Date | undefined };
  setDateRange: (range: { from: Date | undefined, to: Date | undefined }) => void;
  onApplyFilters: () => void;
}

const DesktopFilterSidebar = ({
  isOpen,
  toggleDesktopFilters,
  senderBrands,
  selectedBrands,
  handleBrandChange
}: DesktopFilterSidebarProps) => {
  return (
    <div className="hidden md:block">
      <Collapsible
        open={isOpen}
        onOpenChange={toggleDesktopFilters}
        className="border-r"
      >
        <div className="flex items-center justify-between px-4 py-2 border-b">
          <span className="font-medium">Sender Profile</span>
        </div>
        
        <CollapsibleContent className="w-80 p-4">
          <SenderFilter 
            senderBrands={senderBrands}
            selectedBrands={selectedBrands}
            handleBrandChange={handleBrandChange}
          />
        </CollapsibleContent>
      </Collapsible>
      
      {!isOpen && (
        <div className="w-12 flex flex-col items-center py-4 border-r">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={toggleDesktopFilters}
            className="mb-2"
            title="Sender Profile"
          >
            <User className="h-5 w-5" />
          </Button>
        </div>
      )}
    </div>
  );
};

export default memo(DesktopFilterSidebar);
