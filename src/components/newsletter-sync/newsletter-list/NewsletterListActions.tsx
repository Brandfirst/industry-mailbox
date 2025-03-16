
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "@/components/ui/badge";

type NewsletterListActionsProps = {
  selectedCount: number;
  onDelete: () => void;
  isDeleting: boolean;
};

export function NewsletterListActions({
  selectedCount,
  onDelete,
  isDeleting
}: NewsletterListActionsProps) {
  if (selectedCount === 0) return null;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.2 }}
      className="bg-background border rounded-md p-3 shadow-sm flex justify-between items-center my-2"
    >
      <div className="flex items-center gap-2">
        <Badge variant="secondary" className="px-2 py-1">
          {selectedCount}
        </Badge>
        <span className="text-sm">
          {selectedCount === 1 ? 'newsletter' : 'newsletters'} selected
        </span>
      </div>
      <Button 
        variant="destructive" 
        size="sm" 
        onClick={onDelete}
        disabled={isDeleting}
        className="gap-1"
      >
        <Trash2 className="h-4 w-4" />
        {isDeleting ? "Deleting..." : "Delete Selected"}
      </Button>
    </motion.div>
  );
}
