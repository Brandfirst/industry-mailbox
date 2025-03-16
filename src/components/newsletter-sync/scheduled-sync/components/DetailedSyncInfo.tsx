
import React, { useState } from "react";
import { SyncLogEntry } from "@/lib/supabase/emailAccounts/syncLogs";
import { Button } from "@/components/ui/button";
import { ChevronDownIcon, ChevronUpIcon } from "lucide-react";

interface DetailedSyncInfoProps {
  log: SyncLogEntry;
}

export function DetailedSyncInfo({ log }: DetailedSyncInfoProps) {
  const [showAllEmails, setShowAllEmails] = useState(false);
  const [showAllSenders, setShowAllSenders] = useState(false);
  
  // Extract account email from log
  const accountEmail = log.details?.accountEmail || 
                      (log.account_email ? log.account_email : 'Not available');
                      
  const syncedCount = log.details?.syncedCount || 0;
  const failedCount = log.details?.failedCount || 0;
  const startTime = log.timestamp ? new Date(log.timestamp).toLocaleString() : 'Unknown';
  const syncType = log.sync_type || 'manual';
  const syncedEmails = log.details?.synced || [];
  const newSenders = log.details?.new_senders_count || 0;
  
  // Extract unique senders for display
  const uniqueSenders = new Set<string>();
  syncedEmails.forEach((email: any) => {
    if (email.sender_email) {
      uniqueSenders.add(email.sender_email);
    }
  });
  const uniqueSendersArray = Array.from(uniqueSenders);
  
  // For display control
  const maxInitialEmails = 3;
  const maxInitialSenders = 3;
  const displayedEmails = showAllEmails 
    ? syncedEmails 
    : syncedEmails.slice(0, maxInitialEmails);
  const displayedSenders = showAllSenders 
    ? uniqueSendersArray 
    : uniqueSendersArray.slice(0, maxInitialSenders);
  
  return (
    <div className="space-y-3 p-1 text-gray-900 bg-white">
      <h4 className="font-medium text-sm">Sync Details</h4>
      
      <div className="space-y-2 text-xs">
        <div className="grid grid-cols-2 gap-1">
          <div className="text-gray-600">Account:</div>
          <div className="font-medium">{accountEmail}</div>
        </div>
        
        <div className="grid grid-cols-2 gap-1">
          <div className="text-gray-600">Started:</div>
          <div>{startTime}</div>
        </div>
        
        <div className="grid grid-cols-2 gap-1">
          <div className="text-gray-600">Type:</div>
          <div className="capitalize">{syncType}</div>
        </div>
        
        {log.status !== 'scheduled' && (
          <>
            <div className="grid grid-cols-2 gap-1">
              <div className="text-gray-600">Status:</div>
              <div>{log.status}</div>
            </div>
            
            <div className="grid grid-cols-2 gap-1">
              <div className="text-gray-600">Synced:</div>
              <div>{syncedCount} emails</div>
            </div>
            
            <div className="grid grid-cols-2 gap-1">
              <div className="text-gray-600">Failed:</div>
              <div>{failedCount} emails</div>
            </div>
            
            {/* New senders section */}
            {newSenders > 0 && uniqueSendersArray.length > 0 && (
              <div className="mt-2 pt-2 border-t border-gray-100">
                <div className="text-gray-600 mb-1">New Senders ({newSenders}):</div>
                <div className="max-h-40 overflow-y-auto">
                  {displayedSenders.map((sender: string, index: number) => (
                    <div key={index} className="mb-1 text-xs">{sender}</div>
                  ))}
                  
                  {uniqueSendersArray.length > maxInitialSenders && (
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="w-full h-6 text-xs mt-1" 
                      onClick={() => setShowAllSenders(!showAllSenders)}
                    >
                      {showAllSenders ? (
                        <>Show Less <ChevronUpIcon className="ml-1 h-3 w-3" /></>
                      ) : (
                        <>Show All ({uniqueSendersArray.length}) <ChevronDownIcon className="ml-1 h-3 w-3" /></>
                      )}
                    </Button>
                  )}
                </div>
              </div>
            )}
            
            {/* Synced emails section */}
            {syncedEmails.length > 0 && (
              <div className="mt-2 pt-2 border-t border-gray-100">
                <div className="text-gray-600 mb-1">Synced Emails ({syncedEmails.length}):</div>
                <div className="max-h-40 overflow-y-auto">
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
            )}
          </>
        )}
        
        {log.error_message && (
          <div className="mt-2 pt-2 border-t border-gray-100">
            <div className="text-gray-600 mb-1">Error:</div>
            <div className="text-red-600 break-words">{log.error_message}</div>
          </div>
        )}
      </div>
    </div>
  );
}
