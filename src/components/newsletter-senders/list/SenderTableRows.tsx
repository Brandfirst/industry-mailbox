
import { NewsletterSenderStats } from "@/lib/supabase/newsletters";
import { NewsletterCategory } from "@/lib/supabase/types";
import EmptyTableRow from "../components/EmptyTableRow";
import SenderTableRow from "../components/SenderTableRow";

interface SenderTableRowsProps {
  senders: NewsletterSenderStats[];
  categories: NewsletterCategory[];
  selectedSenders: string[];
  effectiveUpdatingCategory: string | null;
  effectiveUpdatingBrand: string | null;
  getBrandInputValue: (sender: NewsletterSenderStats) => string;
  onCategoryChange: (senderEmail: string, categoryId: string) => void;
  onBrandUpdate: (senderEmail: string, brandName: string) => Promise<void>;
  onToggleSelect?: (senderEmail: string) => void;
}

const SenderTableRows = ({
  senders,
  categories,
  selectedSenders,
  effectiveUpdatingCategory,
  effectiveUpdatingBrand,
  getBrandInputValue,
  onCategoryChange,
  onBrandUpdate,
  onToggleSelect
}: SenderTableRowsProps) => {
  if (senders.length === 0) {
    return <EmptyTableRow colSpan={onToggleSelect ? 7 : 6} />;
  }
  
  return (
    <>
      {senders.map((sender, index) => (
        <SenderTableRow
          key={sender.sender_email}
          sender={sender}
          index={index}
          categories={categories}
          isSelected={selectedSenders.includes(sender.sender_email)}
          updatingCategory={effectiveUpdatingCategory}
          updatingBrand={effectiveUpdatingBrand}
          brandInputValue={getBrandInputValue(sender)}
          onCategoryChange={onCategoryChange}
          onBrandUpdate={onBrandUpdate}
          onToggleSelect={onToggleSelect}
        />
      ))}
    </>
  );
};

export default SenderTableRows;
