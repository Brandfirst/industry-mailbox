
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronDownIcon, ChevronUpIcon, Mail, AlertCircle, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { createNewsletterNavigationHandler } from "../../utils/navigationUtils";

interface SyncedEmailsSectionProps {
  syncedEmails: any[];
}

export function SyncedEmailsSection({ syncedEmails }: SyncedEmailsSectionProps) {
  const [showAllEmails, setShowAllEmails] = useState(false);
  const [loading, setLoading] = useState<{[key: string]: boolean}>({});
  const navigate = useNavigate();
  
  // Skip rendering if no emails
  if (!syncedEmails || syncedEmails.length === 0) return null;
  
  const maxInitialEmails = 3;
  const displayedEmails = showAllEmails 
    ? syncedEmails 
    : syncedEmails.slice(0, maxInitialEmails);
  
  console.log("Displaying emails in SyncedEmailsSection:", displayedEmails);
  
  // Create a navigation handler that shows loading state
  const createLoadingNavigationHandler = (email: any, index: number) => {
    const originalHandler = createNewsletterNavigationHandler(
      email, 
      navigate,
      () => setLoading(prev => ({...prev, [index]: false}))
    );
    
    return async (e: React.MouseEvent) => {
      setLoading(prev => ({...prev, [index]: true}));
      await originalHandler(e);
    };
  };
  
  return (
    <div className="mt-2 pt-2 border-t border-gray-100">
      <div className="flex items-center mb-1">
        <div className="text-gray-600">Synced Emails ({syncedEmails.length}):</div>
      </div>
      <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
        {displayedEmails.map((email: any, index: number) => {
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
