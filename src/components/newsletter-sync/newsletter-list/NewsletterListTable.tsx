
import { Newsletter, NewsletterCategory } from "@/lib/supabase";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Info } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { SenderGroup } from "./SenderGroup";
import { CategorySelector } from "../CategorySelector";

type NewsletterListTableProps = {
  newsletters: Newsletter[];
  categories: NewsletterCategory[];
  senderGroups: Record<string, Newsletter[]>;
  onCategoryChange: (newsletter: Newsletter, applySenderWide: boolean) => void;
  isSelected: (id: number) => boolean;
  onToggleSelectAll: () => void;
  onToggleSelectNewsletter: (id: number) => void;
  allSelected: boolean;
};

export function NewsletterListTable({
  newsletters,
  categories,
  senderGroups,
  onCategoryChange,
  isSelected,
  onToggleSelectAll,
  onToggleSelectNewsletter,
  allSelected
}: NewsletterListTableProps) {
  // Get unique senders
  const uniqueSenders = Object.keys(senderGroups);
  
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[50px]">
              <Checkbox 
                checked={allSelected} 
                onCheckedChange={onToggleSelectAll}
              />
            </TableHead>
            <TableHead className="w-[60px] text-center">#</TableHead>
            <TableHead>Sender</TableHead>
            <TableHead>Title</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>
              <div className="flex items-center gap-1">
                Category
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="h-4 w-4 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent className="max-w-xs">
                      <p>Categories are applied to all newsletters from the same sender</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {uniqueSenders.map((sender) => {
            // Get all newsletters for this sender
            const senderNewsletters = senderGroups[sender];
            
            // Take the first newsletter as representative for this sender group
            const representativeNewsletter = senderNewsletters[0];
            
            return senderNewsletters.map((newsletter, index) => {
              const isFirstInGroup = index === 0;
              
              return (
                <TableRow 
                  key={newsletter.id}
                  isSelected={isSelected(newsletter.id)}
                  className={`${isSelected(newsletter.id) ? "bg-primary/10 transition-colors duration-200" : "transition-colors duration-200"} ${isFirstInGroup ? "border-t-2 border-t-muted" : ""}`}
                >
                  <TableCell>
                    <Checkbox 
                      checked={isSelected(newsletter.id)}
                      onCheckedChange={() => onToggleSelectNewsletter(newsletter.id)}
                      className="transition-transform duration-200 data-[state=checked]:animate-scale-in"
                    />
                  </TableCell>
                  <TableCell className="text-center font-medium text-muted-foreground">
                    {index + 1}
                  </TableCell>
                  <TableCell className={`font-medium ${isFirstInGroup ? "font-semibold" : ""}`}>
                    {isFirstInGroup && (
                      <div className="mb-1 text-sm px-2 py-1 rounded-md bg-muted/50 inline-block">
                        {sender}
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    {isSelected(newsletter.id) && (
                      <motion.span
                        initial={{ opacity: 0, x: -5 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="inline-block mr-2 text-xs px-1.5 py-0.5 rounded-md bg-primary text-primary-foreground font-medium"
                      >
                        Selected
                      </motion.span>
                    )}
                    {newsletter.title || "Untitled"}
                  </TableCell>
                  <TableCell>
                    {newsletter.published_at
                      ? formatDistanceToNow(new Date(newsletter.published_at), { addSuffix: true })
                      : "Unknown"}
                  </TableCell>
                  <TableCell>
                    {isFirstInGroup ? (
                      <CategorySelector 
                        newsletter={representativeNewsletter}
                        categories={categories}
                        onCategoryChange={onCategoryChange}
                      />
                    ) : (
                      <div className="text-sm text-muted-foreground italic">
                        ↑ Same as sender
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="transition-transform duration-200 hover:scale-105">
                      <NewsletterViewDialog newsletter={newsletter} />
                    </div>
                  </TableCell>
                </TableRow>
              );
            });
          })}
        </TableBody>
      </Table>
    </div>
  );
}
