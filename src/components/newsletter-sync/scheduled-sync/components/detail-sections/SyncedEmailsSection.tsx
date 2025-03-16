
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronDownIcon, ChevronUpIcon, Eye } from "lucide-react";
import { NewsletterViewDialog } from "@/components/newsletter-sync/newsletter-view";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { InfoIcon } from "lucide-react";
import { Newsletter } from "@/lib/supabase/types";
import { useNavigate } from "react-router-dom";
import { getNewsletterPath } from "@/lib/utils/newsletterNavigation";

interface SyncedEmailsSectionProps {
  syncedEmails: any[];
}

export function SyncedEmailsSection({ syncedEmails }: SyncedEmailsSectionProps) {
  const [showAllEmails, setShowAllEmails] = useState(false);
  const navigate = useNavigate();
  
  // Skip rendering if no emails
  if (!syncedEmails || syncedEmails.length === 0) return null;
  
  const maxInitialEmails = 3;
  const displayedEmails = showAllEmails 
    ? syncedEmails 
    : syncedEmails.slice(0, maxInitialEmails);
  
  console.log("Displaying emails in SyncedEmailsSection:", displayedEmails);
  
  const navigateToNewsletter = (email: any) => {
    // If the email has an actual newsletter ID, go directly to it
    if (email.id && !email.id.toString().startsWith('temp-')) {
      navigate(`/newsletter/${email.id}`);
    } else if (email.gmail_message_id) {
      // If it has a Gmail message ID, try to find the newsletter by that ID
      // This is just a navigation, we're not actually searching
      navigate(`/newsletter/${email.id}`);
    } else {
      console.log("Cannot navigate: email has no valid ID");
    }
  };
    
  return (
    <div className="mt-2 pt-2 border-t border-gray-100">
      <div className="flex items-center mb-1">
        <div className="text-gray-600">Synced Emails ({syncedEmails.length}):</div>
      </div>
      <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
        {displayedEmails.map((email: any, index: number) => {
          // Create a simplified reference just for display
          return (
            <div 
              key={index} 
              className="mb-2 pb-2 border-b border-gray-100 last:border-b-0 rounded bg-gray-50 p-2 cursor-pointer hover:bg-gray-100"
              onClick={() => navigateToNewsletter(email)}
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div><span className="font-medium">From:</span> {email.sender || email.sender_email || 'Unknown'}</div>
                  <div className="truncate"><span className="font-medium">Subject:</span> {email.title || email.subject || 'No subject'}</div>
                  {email.date && <div className="text-xs text-gray-500 mt-1">Date: {new Date(email.date).toLocaleString()}</div>}
                </div>
                <div onClick={(e) => e.stopPropagation()}>
                  <NewsletterViewDialog 
                    newsletter={{
                      id: email.id || index,
                      title: email.title || email.subject || 'No subject',
                      sender: email.sender || 'Unknown',
                      sender_email: email.sender_email || email.sender || 'Unknown',
                      content: email.content || null,
                      published_at: email.date || new Date().toISOString(),
                      industry: email.industry || '',
                      preview: email.preview || email.subject || '',
                      created_at: email.created_at || new Date().toISOString(),
                      gmail_message_id: email.gmail_message_id || '',
                      gmail_thread_id: email.gmail_thread_id || '',
                      email_id: email.email_id || ''
                    } as Newsletter} 
                  />
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
