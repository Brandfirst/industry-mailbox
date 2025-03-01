
import { Newsletter, NewsletterCategory } from "@/lib/supabase";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Info } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { motion } from "framer-motion";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { NewsletterViewDialog } from "../NewsletterViewDialog";

type NewsletterListTableProps = {
  newsletters: Newsletter[];
  categories: NewsletterCategory[];
  senderGroups: Record<string, Newsletter[]>;
  isSelected: (id: number) => boolean;
  onToggleSelectAll: () => void;
  onToggleSelectNewsletter: (id: number) => void;
  allSelected: boolean;
};

export function NewsletterListTable({
  newsletters,
  categories,
  isSelected,
  onToggleSelectAll,
  onToggleSelectNewsletter,
  allSelected
}: NewsletterListTableProps) {
  
  // Get category name by ID
  const getCategoryNameById = (categoryId: number | null) => {
    if (!categoryId) return "Uncategorized";
    const category = categories.find(cat => cat.id === categoryId);
    return category ? category.name : "Uncategorized";
  };
  
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
                      <p>Categories are managed in the Newsletter Senders section</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {newsletters.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="h-32 text-center text-muted-foreground">
                No newsletters found.
              </TableCell>
            </TableRow>
          ) : (
            newsletters.map((newsletter, index) => (
              <TableRow 
                key={newsletter.id}
                className={isSelected(newsletter.id) ? "bg-primary/10 transition-colors duration-200" : "transition-colors duration-200"}
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
                <TableCell className="font-medium">
                  <div className="text-sm px-2 py-1 rounded-md bg-muted/50 inline-block">
                    {newsletter.sender || "Unknown Sender"}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {newsletter.sender_email || "No email"}
                  </div>
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
                  <Badge variant="outline" className="bg-primary/5">
                    {getCategoryNameById(newsletter.category_id)}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="transition-transform duration-200 hover:scale-105">
                    <NewsletterViewDialog newsletter={newsletter} />
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
