
import { Newsletter, NewsletterCategory } from "@/lib/supabase";
import { TableRow } from "@/components/ui/table";
import { NewsletterListItem } from "./NewsletterListItem";
import { CategorySelector } from "../CategorySelector";

type SenderGroupProps = {
  sender: string;
  newsletters: Newsletter[];
  categories: NewsletterCategory[];
  onCategoryChange: (newsletter: Newsletter, applySenderWide: boolean) => void;
  isSelected: (id: number) => boolean;
  onToggleSelect: (id: number) => void;
};

export function SenderGroup({
  sender,
  newsletters,
  categories,
  onCategoryChange,
  isSelected,
  onToggleSelect
}: SenderGroupProps) {
  // Take the first newsletter as representative for this sender group
  const representativeNewsletter = newsletters[0];
  
  return (
    <>
      {newsletters.map((newsletter, index) => {
        const isFirstInGroup = index === 0;
        
        return (
          <NewsletterListItem
            key={newsletter.id}
            newsletter={newsletter}
            isSelected={isSelected(newsletter.id)}
            isFirstInGroup={isFirstInGroup}
            index={index}
            onToggleSelect={onToggleSelect}
          />
        );
      })}
    </>
  );
}
