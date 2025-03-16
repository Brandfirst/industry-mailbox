
import React from "react";
import { 
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogClose
} from "@/components/ui/dialog";
import { SyncedEmailsSection } from "./detail-sections/SyncedEmailsSection";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface SyncedEmailsDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  syncedEmails: any[];
  title?: string;
}

export function SyncedEmailsDialog({ 
  isOpen, 
  onOpenChange, 
  syncedEmails,
  title = "Synced Emails"
}: SyncedEmailsDialogProps) {
  const emailCount = syncedEmails?.length || 0;
  
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md bg-white">
        <DialogTitle>{title}</DialogTitle>
        <DialogClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </DialogClose>
        <DialogDescription>
          {emailCount} email{emailCount !== 1 ? 's' : ''} synced in this operation
        </DialogDescription>
        
        <div className="mt-2 max-h-[60vh] overflow-y-auto pr-2">
          <SyncedEmailsSection syncedEmails={syncedEmails} />
          
          {emailCount === 0 && (
            <div className="py-4 text-center text-muted-foreground">
              No email details available for this sync operation
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
