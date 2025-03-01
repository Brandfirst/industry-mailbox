
import { useState } from "react";
import { Check, ChevronDown, FolderIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Newsletter, NewsletterCategory } from "@/lib/supabase";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

type CategorySelectorProps = {
  newsletter: Newsletter;
  categories: NewsletterCategory[];
  onCategoryChange: (newsletter: Newsletter) => void;
};

export function CategorySelector({
  newsletter,
  categories,
  onCategoryChange,
}: CategorySelectorProps) {
  const [open, setOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Get the current category
  const currentCategoryId = newsletter.category_id;
  const currentCategory = currentCategoryId
    ? categories.find((c) => c.id === currentCategoryId)
    : null;

  const handleCategorySelect = async (categoryId: string) => {
    // Convert empty string to null for database storage
    const categoryIdToSave = categoryId === "uncategorized" ? null : Number(categoryId);
    
    // If category hasn't changed, do nothing
    if (categoryIdToSave === newsletter.category_id) {
      setOpen(false);
      return;
    }
    
    setIsSaving(true);
    
    try {
      // For the update to be reflected immediately in UI,
      // create a new newsletter object with the updated category
      const updatedNewsletter = {
        ...newsletter,
        category_id: categoryIdToSave,
      };
      
      // Call the DB update function (not shown here)
      // Implement API call to update category
      
      onCategoryChange(updatedNewsletter);
      setOpen(false);
      toast.success("Category updated");
    } catch (error) {
      console.error("Error updating category:", error);
      toast.error("Failed to update category");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          role="combobox"
          aria-expanded={open}
          className="justify-between w-[180px]"
          disabled={isSaving}
        >
          {currentCategory ? (
            <span className="truncate">{currentCategory.name}</span>
          ) : (
            <span className="text-muted-foreground">Uncategorized</span>
          )}
          <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0 w-[200px]">
        <Command>
          <CommandInput placeholder="Search categories..." />
          <CommandEmpty>No category found.</CommandEmpty>
          <CommandGroup>
            <CommandItem
              value="uncategorized"
              onSelect={() => handleCategorySelect("uncategorized")}
              className="text-muted-foreground"
            >
              <div className="flex items-center gap-2">
                {!currentCategory && <Check className="h-4 w-4" />}
                <span>Uncategorized</span>
              </div>
            </CommandItem>
            {categories.map((category) => (
              <CommandItem
                key={category.id}
                value={category.name}
                onSelect={() => handleCategorySelect(String(category.id))}
              >
                <div className="flex items-center gap-2">
                  {currentCategoryId === category.id && (
                    <Check className="h-4 w-4" />
                  )}
                  <FolderIcon className="h-4 w-4 text-muted-foreground" />
                  <span>{category.name}</span>
                </div>
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
