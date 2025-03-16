
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
  
  // Process the synced emails based on the log structure
  // The log might have the emails directly in log.details.synced OR 
  // we might need to construct synthetic emails from senders information
  let syncedEmails = [];
  
  // Enhanced debug logging to see exactly what's happening with the emails data
  console.log("Synced emails for log:", log.id, "Total emails:", totalEmails);
  console.log("Full log details:", log.details);
  
  // Check if we have synced emails data directly available
  if (log.details?.synced && Array.isArray(log.details.synced) && log.details.synced.length > 0) {
    syncedEmails = log.details.synced;
  } 
  // If not, but we have senders information, construct synthetic email objects
  else if (log.details?.senders && Array.isArray(log.details.senders) && log.details.senders.length > 0) {
    // Create synthetic email objects from senders
    syncedEmails = log.details.senders.map(sender => ({
      sender_email: sender,
      sender: sender,
      subject: "Email from " + sender,
      date: log.timestamp
    }));
  }
  // If we know there are emails but don't have details, create a placeholder
  else if (totalEmails > 0) {
    // Create a single placeholder email when we know emails were synced but don't have details
    syncedEmails = [{
      sender_email: "Unknown sender",
      sender: "Unknown sender",
      subject: `${totalEmails} email(s) synced`,
      date: log.timestamp
    }];
  }
  
  console.log("Processed emails for display:", syncedEmails);
  
  const handleClickEmails = () => {
    console.log("Email button clicked, opening dialog with emails:", syncedEmails);
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
          >
            <span>{totalEmails} email{totalEmails !== 1 ? 's' : ''}</span>
            <ExternalLinkIcon className="h-3 w-3 ml-1" />
          </Button>
          
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
