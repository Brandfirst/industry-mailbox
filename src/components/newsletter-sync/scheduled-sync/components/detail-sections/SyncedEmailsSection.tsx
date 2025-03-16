
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronDownIcon, ChevronUpIcon } from "lucide-react";

interface SyncedEmailsSectionProps {
  syncedEmails: any[];
}

export function SyncedEmailsSection({ syncedEmails }: SyncedEmailsSectionProps) {
  const [showAllEmails, setShowAllEmails] = useState(false);
  
  // Skip rendering if no emails
  if (!syncedEmails || syncedEmails.length === 0) return null;
  
  const maxInitialEmails = 3;
  const displayedEmails = showAllEmails 
    ? syncedEmails 
    : syncedEmails.slice(0, maxInitialEmails);
    
  return (
    <div className="mt-2 pt-2 border-t border-gray-100">
      <div className="text-gray-600 mb-1">Synced Emails ({syncedEmails.length}):</div>
      <div className="space-y-2 max-h-60 overflow-y-auto">
        {displayedEmails.map((email: any, index: number) => (
          <div key={index} className="mb-2 pb-2 border-b border-gray-100 last:border-b-0">
            <div><span className="font-medium">From:</span> {email.sender || email.sender_email || 'Unknown'}</div>
            <div className="truncate"><span className="font-medium">Subject:</span> {email.title || 'No subject'}</div>
          </div>
        ))}
        
        {syncedEmails.length > maxInitialEmails && (
          <Button 
            variant="ghost" 
            size="sm" 
            className="w-full h-6 text-xs mt-1" 
            onClick={() => setShowAllEmails(!showAllEmails)}
          >
            {showAllEmails ? (
              <>Show Less <ChevronUpIcon className="ml-1 h-3 w-3" /></>
            ) : (
              <>Show All ({syncedEmails.length}) <ChevronDownIcon className="ml-1 h-3 w-3" /></>
            )}
          </Button>
        )}
      </div>
    </div>
  );
}
