
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

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
      className="flex justify-between items-center py-2"
    >
      <span className="text-sm font-medium text-primary">
        {selectedCount} newsletter{selectedCount > 1 ? 's' : ''} selected
      </span>
      <Button 
        variant="destructive" 
        size="sm" 
        onClick={onDelete}
        disabled={isDeleting}
        className="transition-all duration-200 hover:scale-105"
      >
        <Trash2 className="h-4 w-4 mr-2" />
        Delete Selected
      </Button>
    </motion.div>
  );
}
