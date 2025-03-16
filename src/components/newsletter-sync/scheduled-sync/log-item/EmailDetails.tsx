
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronDownIcon, ChevronUpIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface EmailDetailsProps {
  syncedEmails: any[];
}

export function EmailDetails({ syncedEmails }: EmailDetailsProps) {
  const [showAllEmails, setShowAllEmails] = useState(false);
  const navigate = useNavigate();
  
  // Skip rendering if no emails
  if (syncedEmails.length === 0) return null;
  
  const maxInitialEmails = 5;
  const displayedEmails = showAllEmails 
    ? syncedEmails 
    : syncedEmails.slice(0, maxInitialEmails);
    
  const navigateToNewsletter = (email: any) => {
    // Direct navigation to the newsletter detail page
    if (email.id) {
      console.log(`Navigating to newsletter ID: ${email.id}`);
      navigate(`/newsletter/${email.id}`);
    } else {
      console.log("Cannot navigate: email has no valid ID");
    }
  };
    
  return (
    <div className="mt-3 pt-3 border-t border-gray-100">
      <div className="font-medium mb-1">Synced Emails:</div>
      <div className="space-y-2 max-h-40 overflow-y-auto">
        {displayedEmails.map((email: any, idx: number) => (
          <div 
            key={idx} 
            className="pb-1 mb-1 border-b border-gray-100 last:border-0 cursor-pointer hover:bg-gray-50 p-1 rounded"
            onClick={() => navigateToNewsletter(email)}
          >
            <div className="truncate"><span className="font-medium">From:</span> {email.sender || email.sender_email || 'Unknown'}</div>
            <div className="truncate"><span className="font-medium">Subject:</span> {email.title || email.subject || 'No subject'}</div>
          </div>
        ))}
        {syncedEmails.length > maxInitialEmails && (
          <Button 
            variant="ghost" 
            size="sm" 
            className="w-full h-6 text-xs mt-1" 
            onClick={(e) => {
              e.stopPropagation();
              setShowAllEmails(!showAllEmails);
            }}
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
