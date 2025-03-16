
import React, { useState } from "react";
import { SyncLogEntry } from "@/lib/supabase/emailAccounts/syncLogs";
import { ScheduleDetails } from "./ScheduleDetails";
import { Button } from "@/components/ui/button";
import { ExternalLinkIcon } from "lucide-react";
import { SyncedEmailsDialog } from "./SyncedEmailsDialog";

interface EmailsColumnProps {
  log: SyncLogEntry;
  totalEmails: number;
}

export function EmailsColumn({ log, totalEmails }: EmailsColumnProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const scheduleDetails = log.status === 'scheduled' && log.details;
  const syncedEmails = log.details?.synced || [];
  
  // Debug logging to see what's happening with the synced emails
  console.log("Synced emails for log:", log.id, totalEmails, "emails, clickable:", log.status !== 'scheduled');
  
  // Remove the showClickableEmails variable and directly use the condition
  // Make it clickable for any non-scheduled logs, even with 0 emails
  
  const handleClickEmails = () => {
    console.log("Email button clicked, opening dialog");
    setIsDialogOpen(true);
  };
  
  return (
    <div className="flex items-center">
      {log.status !== 'scheduled' ? (
        <>
          <Button 
            variant="link"
            size="sm" 
            className="px-0 py-0 h-auto flex items-center text-blue-600 hover:text-blue-800 cursor-pointer underline underline-offset-2"
            onClick={handleClickEmails}
            aria-label="View email details"
            // Important: Remove the disabled attribute completely
          >
            <span>{totalEmails} email{totalEmails !== 1 ? 's' : ''}</span>
            <ExternalLinkIcon className="h-3 w-3 ml-1" />
          </Button>
          
          {/* Always render the dialog but control its open state */}
          <SyncedEmailsDialog 
            isOpen={isDialogOpen}
            onOpenChange={setIsDialogOpen}
            syncedEmails={syncedEmails}
            title={`Emails from ${log.account?.email || ''}`}
          />
        </>
      ) : scheduleDetails && (
        <ScheduleDetails 
          scheduleType={log.details.schedule_type} 
          hour={log.details.hour} 
        />
      )}
    </div>
  );
}
