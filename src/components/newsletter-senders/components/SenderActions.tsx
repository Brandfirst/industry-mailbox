
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { DeleteConfirmationDialog } from "@/components/newsletter-sync/DeleteConfirmationDialog";

type SenderActionsProps = {
  selectedSenders: string[];
  onDeleteSenders: (senderEmails: string[]) => Promise<void>;
  isDeleting: boolean;
};

const SenderActions = ({
  selectedSenders,
  onDeleteSenders,
  isDeleting
}: SenderActionsProps) => {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const handleDeleteClick = () => {
    setShowDeleteDialog(true);
  };

  const handleConfirmDelete = async () => {
    await onDeleteSenders(selectedSenders);
    setShowDeleteDialog(false);
  };

  if (selectedSenders.length === 0) {
    return null;
  }

  return (
    <>
      <Button 
        variant="destructive" 
        size="sm" 
        onClick={handleDeleteClick}
        disabled={isDeleting}
      >
        <Trash2 className="h-4 w-4 mr-2" />
        Delete {selectedSenders.length} selected
      </Button>
      
      <DeleteConfirmationDialog
        isOpen={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        onConfirm={handleConfirmDelete}
        isDeleting={isDeleting}
        count={selectedSenders.length}
      />
    </>
  );
};

export default SenderActions;
