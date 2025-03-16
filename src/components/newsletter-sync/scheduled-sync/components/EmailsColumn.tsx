
import React, { useState } from "react";
import { SyncLogEntry } from "@/lib/supabase/emailAccounts/syncLogs";
import { ScheduleDetails } from "./ScheduleDetails";
import { Button } from "@/components/ui/button";
import { SyncedEmailsDialog } from "./SyncedEmailsDialog";

interface EmailsColumnProps {
  log: SyncLogEntry;
  totalEmails: number;
}

export function EmailsColumn({ log, totalEmails }: EmailsColumnProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const scheduleDetails = log.status === 'scheduled' && log.details;
  
  // Process the synced emails based on the log structure
  let syncedEmails = [];
  
  // Enhanced debug logging
  console.log("Processing emails for log:", log.id, "Total emails:", totalEmails);
  console.log("Log details structure:", log.details);
  
  // Check for different potential email data structures in the logs
  if (log.details?.synced && Array.isArray(log.details.synced) && log.details.synced.length > 0) {
    // Map and ensure each email has the correct properties for navigation
    syncedEmails = log.details.synced.map(email => {
      // Make sure we preserve the newsletter ID if it exists
      return {
        ...email,
        // If the email has a newsletter_id property but not an id, copy it to id
        id: email.id || email.newsletter_id || null
      };
    });
    
    console.log("Found synced emails with details:", syncedEmails);
  } 
  // If we have newsletter data in the log
  else if (log.details?.newsletters && Array.isArray(log.details.newsletters) && log.details.newsletters.length > 0) {
    syncedEmails = log.details.newsletters;
    console.log("Found newsletters in log details:", syncedEmails);
  }
  // If not, but we have senders information, construct synthetic email objects
  else if (log.details?.senders && Array.isArray(log.details.senders) && log.details.senders.length > 0) {
    // Create synthetic email objects from senders, but note they won't have IDs for navigation
    syncedEmails = log.details.senders.map(sender => ({
      sender_email: sender,
      sender: sender,
      subject: "Email from " + sender,
      date: log.timestamp
    }));
    console.log("Created synthetic emails from senders:", syncedEmails);
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
    console.log("Created placeholder for emails without details");
  }
  
  // Check for newsletter IDs
  if (syncedEmails.length > 0) {
    console.log("First email has ID:", syncedEmails[0].id || syncedEmails[0].newsletter_id || "No ID found");
  }
  
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
            className="px-0 py-0 h-auto text-blue-600 hover:text-blue-800 underline underline-offset-2"
            onClick={handleClickEmails}
            aria-label="View email details"
          >
            <span>{totalEmails}</span>
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
