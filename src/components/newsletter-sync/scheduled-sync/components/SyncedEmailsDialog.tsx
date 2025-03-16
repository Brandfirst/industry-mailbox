
import React from "react";
import { 
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogClose
} from "@/components/ui/dialog";
import { X, Mail, AlertCircle, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { createNewsletterNavigationHandler } from "../utils/navigationUtils";
import { Button } from "@/components/ui/button";

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
  const [loading, setLoading] = React.useState<{[key: string]: boolean}>({});
  
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
  
  // Create a navigation handler that shows loading state
  const createLoadingNavigationHandler = (email: any, index: number) => {
    const originalHandler = createNewsletterNavigationHandler(
      email, 
      navigate, 
      () => {
        setLoading(prev => ({...prev, [index]: false}));
        onOpenChange(false);
      }
    );
    
    return async (e: React.MouseEvent) => {
      setLoading(prev => ({...prev, [index]: true}));
      await originalHandler(e);
    };
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
              {emails.map((email, index) => {
                const hasValidId = email.id || email.newsletter_id;
                const isLoading = loading[index] || false;
                
                return (
                  <div 
                    key={index} 
                    className={`mb-2 pb-2 border-b border-gray-100 last:border-b-0 rounded p-2
                      ${hasValidId ? 'bg-gray-50 cursor-pointer hover:bg-gray-100' : 'bg-amber-50'}`}
                    onClick={createLoadingNavigationHandler(email, index)}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div><span className="font-medium">From:</span> {email.sender || email.sender_email || 'Unknown'}</div>
                        <div className="truncate"><span className="font-medium">Subject:</span> {email.title || email.subject || 'No subject'}</div>
                        {email.date && <div className="text-xs text-gray-500 mt-1">Date: {new Date(email.date).toLocaleString()}</div>}
                        
                        {/* Status indicator */}
                        {hasValidId ? (
                          <div className="text-xs text-blue-500 mt-1 flex items-center">
                            <Mail className="h-3 w-3 mr-1" /> 
                            Newsletter ID: {email.id || email.newsletter_id}
                          </div>
                        ) : (
                          <div className="text-xs text-blue-500 mt-1 flex items-center">
                            <AlertCircle className="h-3 w-3 mr-1" />
                            Finding latest newsletter from this sender
                          </div>
                        )}
                        
                        {/* Loading indicator */}
                        {isLoading && (
                          <div className="mt-1 flex items-center text-blue-600">
                            <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                            <span className="text-xs">Loading newsletter...</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
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
