
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
import { toast } from "sonner";

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
  
  // Detailed debug logging to troubleshoot navigation issues
  React.useEffect(() => {
    if (isOpen) {
      console.log("SyncedEmailsDialog opened");
      console.log("Email count:", emailCount);
      console.log("Synced emails data:", emails);
      
      // Check if the syncedEmails have newsletter IDs
      if (emailCount > 0) {
        emails.forEach((email, index) => {
          console.log(`Email ${index} has ID:`, email.id);
          console.log(`Email ${index} full data:`, email);
        });
      }
    }
  }, [isOpen, emailCount, emails]);
  
  // Improved dialog open state handling
  const handleOpenChange = (open: boolean) => {
    console.log("Dialog open state changing to:", open);
    onOpenChange(open);
  };
  
  // Enhanced navigation handler with newsletter ID extraction
  const navigateToNewsletter = (email: any, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Detailed logging to troubleshoot
    console.log("Attempting to navigate with email:", email);
    
    if (email.id) {
      console.log(`Navigating to newsletter ID: ${email.id}`);
      navigate(`/newsletter/${email.id}`);
      onOpenChange(false); // Close the dialog after navigation
    } else if (email.newsletter_id) {
      // Support alternative ID field
      console.log(`Navigating to newsletter ID (from newsletter_id): ${email.newsletter_id}`);
      navigate(`/newsletter/${email.newsletter_id}`);
      onOpenChange(false);
    } else {
      console.log("Cannot navigate: email has no valid ID");
      toast.error("Can't open this newsletter - no ID available");
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
                  onClick={(e) => navigateToNewsletter(email, e)}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div><span className="font-medium">From:</span> {email.sender || email.sender_email || 'Unknown'}</div>
                      <div className="truncate"><span className="font-medium">Subject:</span> {email.title || email.subject || 'No subject'}</div>
                      {email.date && <div className="text-xs text-gray-500 mt-1">Date: {new Date(email.date).toLocaleString()}</div>}
                      
                      {/* Debug: show newsletter ID if available */}
                      {(email.id || email.newsletter_id) && 
                        <div className="text-xs text-blue-500 mt-1">
                          Newsletter ID: {email.id || email.newsletter_id}
                        </div>
                      }
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
