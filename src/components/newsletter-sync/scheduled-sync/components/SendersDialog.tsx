
import React from "react";
import { 
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { UniqueSendersSection } from "./detail-sections/UniqueSendersSection";

interface SendersDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  sendersList: string[];
  syncedEmails: any[];
  title?: string;
}

export function SendersDialog({ 
  isOpen, 
  onOpenChange, 
  sendersList,
  syncedEmails,
  title = "Unique Senders"
}: SendersDialogProps) {
  const sendersCount = sendersList?.length || 0;
  
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md bg-white">
        <DialogTitle>{title}</DialogTitle>
        <DialogDescription>
          {sendersCount} unique sender{sendersCount !== 1 ? 's' : ''} in this sync operation
        </DialogDescription>
        
        <div className="mt-2 max-h-[60vh] overflow-y-auto pr-2">
          {/* Senders List */}
          <div className="space-y-1 mb-4">
            {sendersList.length > 0 ? (
              sendersList.map((sender, idx) => (
                <div key={idx} className="py-1 px-2 border-b border-gray-100 last:border-b-0">
                  {sender}
                </div>
              ))
            ) : (
              <div className="py-4 text-center text-muted-foreground">
                No sender information available
              </div>
            )}
          </div>

          {/* Related Emails */}
          {syncedEmails.length > 0 && (
            <div className="pt-3 border-t border-gray-200">
              <h3 className="font-medium mb-2">Related Emails:</h3>
              <div className="space-y-2">
                {syncedEmails.map((email, idx) => (
                  <div key={idx} className="text-sm p-2 bg-gray-50 rounded-md">
                    <div><span className="font-medium">From:</span> {email.sender || email.sender_email || 'Unknown'}</div>
                    <div><span className="font-medium">Subject:</span> {email.title || email.subject || 'No subject'}</div>
                    {email.date && <div><span className="font-medium">Date:</span> {new Date(email.date).toLocaleString()}</div>}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
