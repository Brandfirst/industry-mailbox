
import React from "react";
import { 
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogClose
} from "@/components/ui/dialog";
import { X } from "lucide-react";
import { useNavigate } from "react-router-dom";

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
  const navigate = useNavigate();
  
  // Ensure we have a valid array of emails
  const emails = Array.isArray(syncedEmails) ? syncedEmails : [];
  const emailCount = emails.length;
  
  // Detailed debug logging for every render of this component
  React.useEffect(() => {
    if (isOpen) {
      console.log("SyncedEmailsDialog opened");
      console.log("Email count:", emailCount);
      console.log("Synced emails data:", emails);
      
      // Check if the syncedEmails are in the expected format
      if (emailCount > 0) {
        console.log("First email sample:", emails[0]);
      }
    }
  }, [isOpen, emailCount, emails]);
  
  // Improved dialog open state handling
  const handleOpenChange = (open: boolean) => {
    console.log("Dialog open state changing to:", open);
    onOpenChange(open);
  };
  
  // Navigation handler
  const navigateToNewsletter = (email: any) => {
    if (email.id) {
      console.log(`Navigating to newsletter ID: ${email.id}`);
      navigate(`/newsletter/${email.id}`);
      onOpenChange(false); // Close the dialog after navigation
    } else {
      console.log("Cannot navigate: email has no valid ID");
    }
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
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
          {emailCount > 0 ? (
            <div className="space-y-2">
              {emails.map((email, index) => (
                <div 
                  key={index} 
                  className="mb-2 pb-2 border-b border-gray-100 last:border-b-0 rounded bg-gray-50 p-2 cursor-pointer hover:bg-gray-100"
                  onClick={() => navigateToNewsletter(email)}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div><span className="font-medium">From:</span> {email.sender || email.sender_email || 'Unknown'}</div>
                      <div className="truncate"><span className="font-medium">Subject:</span> {email.title || email.subject || 'No subject'}</div>
                      {email.date && <div className="text-xs text-gray-500 mt-1">Date: {new Date(email.date).toLocaleString()}</div>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-4 text-center text-muted-foreground">
              No email details available for this sync operation
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
