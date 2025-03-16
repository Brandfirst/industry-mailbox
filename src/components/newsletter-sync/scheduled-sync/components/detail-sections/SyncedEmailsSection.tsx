
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronDownIcon, ChevronUpIcon, Eye } from "lucide-react";
import { NewsletterViewDialog } from "@/components/newsletter-sync/newsletter-view";

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
  
  console.log("Displaying emails in SyncedEmailsSection:", displayedEmails);
    
  return (
    <div className="mt-2 pt-2 border-t border-gray-100">
      <div className="text-gray-600 mb-1">Synced Emails ({syncedEmails.length}):</div>
      <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
        {displayedEmails.map((email: any, index: number) => (
          <div key={index} className="mb-2 pb-2 border-b border-gray-100 last:border-b-0 rounded bg-gray-50 p-2">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div><span className="font-medium">From:</span> {email.sender || email.sender_email || 'Unknown'}</div>
                <div className="truncate"><span className="font-medium">Subject:</span> {email.title || email.subject || 'No subject'}</div>
                {email.date && <div className="text-xs text-gray-500 mt-1">Date: {new Date(email.date).toLocaleString()}</div>}
              </div>
              <NewsletterViewDialog 
                newsletter={{
                  id: email.id || index,
                  title: email.title || email.subject || 'No subject',
                  sender: email.sender || email.sender_email || 'Unknown',
                  sender_email: email.sender_email || email.sender || 'Unknown',
                  content: email.content || '',
                  published_at: email.date || new Date().toISOString(),
                }}
              />
            </div>
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
