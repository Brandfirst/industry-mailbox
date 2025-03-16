
import React from "react";
import { SyncLogEntry } from "@/lib/supabase/emailAccounts/syncLogs";

interface DetailedSyncInfoProps {
  log: SyncLogEntry;
}

export function DetailedSyncInfo({ log }: DetailedSyncInfoProps) {
  const accountEmail = log.details?.accountEmail || 'Not available';
  const syncedCount = log.details?.syncedCount || 0;
  const failedCount = log.details?.failedCount || 0;
  const startTime = log.timestamp ? new Date(log.timestamp).toLocaleString() : 'Unknown';
  const syncType = log.sync_type || 'manual';
  const syncedEmails = log.details?.synced || [];
  const newSenders = log.details?.new_senders_count || 0;
  
  return (
    <div className="space-y-3 p-1 text-gray-900 bg-white">
      <h4 className="font-medium text-sm">Sync Details</h4>
      
      <div className="space-y-2 text-xs">
        <div className="grid grid-cols-2 gap-1">
          <div className="text-gray-600">Account:</div>
          <div>{accountEmail}</div>
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
            
            {newSenders > 0 && (
              <div className="grid grid-cols-2 gap-1">
                <div className="text-gray-600">New senders:</div>
                <div>{newSenders}</div>
              </div>
            )}
            
            {syncedEmails.length > 0 && (
              <div className="mt-2 pt-2 border-t border-gray-100">
                <div className="text-gray-600 mb-1">Synced Emails:</div>
                <div className="max-h-40 overflow-y-auto">
                  {syncedEmails.map((email: any, index: number) => (
                    <div key={index} className="mb-2 pb-2 border-b border-gray-100 last:border-b-0">
                      <div><span className="font-medium">From:</span> {email.sender || email.sender_email || 'Unknown'}</div>
                      <div className="truncate"><span className="font-medium">Subject:</span> {email.title || 'No subject'}</div>
                    </div>
                  ))}
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
