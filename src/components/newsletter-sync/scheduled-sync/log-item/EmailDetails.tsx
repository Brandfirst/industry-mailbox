
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronDownIcon, ChevronUpIcon, Mail } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { createNewsletterNavigationHandler } from "../utils/navigationUtils";
import { getSenderPath } from "@/lib/utils/newsletterNavigation";

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
    
  return (
    <div className="mt-3 pt-3 border-t border-gray-100">
      <div className="font-medium mb-1">Synced Emails:</div>
      <div className="space-y-2 max-h-40 overflow-y-auto">
        {displayedEmails.map((email: any, idx: number) => {
          const hasValidId = email.id || email.newsletter_id;
          
          return (
            <div 
              key={idx} 
              className={`pb-1 mb-1 border-b border-gray-100 last:border-0 p-1 rounded 
                ${hasValidId ? 'cursor-pointer hover:bg-gray-50' : 'bg-gray-50'}`}
              onClick={createNewsletterNavigationHandler(email, navigate)}
            >
              <div className="truncate">
                <span className="font-medium">From:</span> {email.sender || email.sender_email || 'Unknown'}
              </div>
              <div className="truncate">
                <span className="font-medium">Subject:</span> {email.title || email.subject || 'No subject'}
              </div>
              
              <div className="flex items-center mt-1">
                {/* Show different indicators based on if we have a newsletter ID */}
                {hasValidId ? (
                  <div className="text-xs text-blue-500">
                    ID: {email.id || email.newsletter_id}
                  </div>
                ) : (
                  <div className="text-xs flex items-center text-amber-600">
                    <Mail className="h-3 w-3 mr-1" />
                    <span>Only sender info available</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
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
