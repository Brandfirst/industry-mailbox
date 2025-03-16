
import React from "react";

export type SenderInfoProps = {
  accountEmail?: string;
  syncedCount?: number;
  failedCount?: number;
  newSendersCount?: number;
  scheduleType?: string;
  hour?: number | null;
};

export function SenderInfo({ 
  accountEmail, 
  syncedCount, 
  failedCount, 
  newSendersCount,
  scheduleType,
  hour
}: SenderInfoProps) {
  return (
    <div className="mt-2 text-sm">
      {accountEmail && (
        <div className="text-gray-700">
          <span className="font-medium">Account:</span> {accountEmail}
        </div>
      )}
      
      {syncedCount !== undefined && (
        <div className="text-gray-700">
          <span className="font-medium">Synced:</span> {syncedCount} emails
          {failedCount !== undefined && failedCount > 0 && (
            <span className="text-red-600 ml-2">
              (Failed: {failedCount})
            </span>
          )}
        </div>
      )}
      
      {newSendersCount !== undefined && newSendersCount > 0 && (
        <div className="text-gray-700">
          <span className="font-medium">New senders:</span> {newSendersCount}
        </div>
      )}
      
      {scheduleType && (
        <div className="text-gray-700">
          <span className="font-medium">Schedule:</span> {scheduleType}
          {hour !== undefined && hour !== null && scheduleType === "daily" && (
            <span> at {hour}:00</span>
          )}
        </div>
      )}
    </div>
  );
}
