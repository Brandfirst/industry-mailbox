
import React from "react";
import { SyncLogEntry } from "@/lib/supabase/emailAccounts/syncLogs";
import { Button } from "@/components/ui/button";
import { UsersIcon } from "lucide-react";
import { 
  Popover,
  PopoverContent,
  PopoverTrigger
} from "@/components/ui/popover";

interface SenderPopoverProps {
  sendersList: string[];
  uniqueSendersCount: number;
  syncedEmails: any[];
  isSendersOpen: boolean;
  setIsSendersOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export function SenderPopover({ 
  sendersList, 
  uniqueSendersCount, 
  syncedEmails, 
  isSendersOpen, 
  setIsSendersOpen 
}: SenderPopoverProps) {
  return (
    <Popover open={isSendersOpen} onOpenChange={setIsSendersOpen}>
      <PopoverTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-5 w-5 rounded-full p-0"
          aria-label="View sender details"
        >
          <UsersIcon className="h-3 w-3" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-72 bg-white text-gray-900 border border-gray-200 shadow-md p-4" align="end">
        <div className="space-y-3">
          <h4 className="font-medium text-sm">Sender Information</h4>
          <div className="text-xs">
            <div className="font-medium mb-1">
              {uniqueSendersCount} unique sender{uniqueSendersCount !== 1 ? 's' : ''}:
            </div>
            <div className="max-h-40 overflow-y-auto space-y-1">
              {sendersList.length > 0 ? (
                sendersList.map((sender, idx) => (
                  <div key={idx} className="truncate">{sender}</div>
                ))
              ) : (
                <div className="text-muted-foreground italic">
                  Sender information not available
                </div>
              )}
            </div>
            
            {syncedEmails.length > 0 && (
              <div className="mt-3 pt-3 border-t border-gray-100">
                <div className="font-medium mb-1">Synced Emails:</div>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {syncedEmails.slice(0, 5).map((email: any, idx: number) => (
                    <div key={idx} className="pb-1 mb-1 border-b border-gray-100 last:border-0">
                      <div className="truncate"><span className="font-medium">From:</span> {email.sender || email.sender_email || 'Unknown'}</div>
                      <div className="truncate"><span className="font-medium">Subject:</span> {email.title || email.subject || 'No subject'}</div>
                    </div>
                  ))}
                  {syncedEmails.length > 5 && (
                    <div className="text-xs text-muted-foreground">
                      + {syncedEmails.length - 5} more email{syncedEmails.length - 5 !== 1 ? 's' : ''}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
