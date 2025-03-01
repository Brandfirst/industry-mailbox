
import { Newsletter, NewsletterCategory } from "@/lib/supabase";
import { TableCell, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { formatDistanceToNow } from "date-fns";
import { motion } from "framer-motion";
import { NewsletterViewDialog } from "../NewsletterViewDialog";

type NewsletterListItemProps = {
  newsletter: Newsletter;
  isSelected: boolean;
  isFirstInGroup: boolean;
  index: number;
  onToggleSelect: (id: number) => void;
};

export function NewsletterListItem({
  newsletter,
  isSelected,
  isFirstInGroup,
  index,
  onToggleSelect,
}: NewsletterListItemProps) {
  return (
    <TableRow 
      key={newsletter.id}
      isSelected={isSelected}
      className={`${isSelected ? "bg-primary/10 transition-colors duration-200" : "transition-colors duration-200"} ${isFirstInGroup ? "border-t-2 border-t-muted" : ""}`}
    >
      <TableCell>
        <Checkbox 
          checked={isSelected}
          onCheckedChange={() => onToggleSelect(newsletter.id)}
          className="transition-transform duration-200 data-[state=checked]:animate-scale-in"
        />
      </TableCell>
      <TableCell className="text-center font-medium text-muted-foreground">
        {index + 1}
      </TableCell>
      <TableCell className={`font-medium ${isFirstInGroup ? "font-semibold" : ""}`}>
        {isFirstInGroup && (
          <div className="mb-1 text-sm px-2 py-1 rounded-md bg-muted/50 inline-block">
            {newsletter.sender || newsletter.sender_email}
          </div>
        )}
      </TableCell>
      <TableCell>
        {isSelected && (
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
          <div className="text-sm text-muted-foreground italic">
            Set at sender level
          </div>
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
}
