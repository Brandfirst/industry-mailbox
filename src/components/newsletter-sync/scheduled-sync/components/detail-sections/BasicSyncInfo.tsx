
import React from "react";

interface BasicSyncInfoProps {
  accountEmail: string;
  syncedCount: number;
  failedCount: number;
  startTime: string;
  syncType: string;
  status?: string;
}

export function BasicSyncInfo({ 
  accountEmail, 
  syncedCount, 
  failedCount, 
  startTime, 
  syncType,
  status 
}: BasicSyncInfoProps) {
  return (
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
      
      {status && status !== 'scheduled' && (
        <>
          <div className="grid grid-cols-2 gap-1">
            <div className="text-gray-600">Status:</div>
            <div>{status}</div>
          </div>
          
          <div className="grid grid-cols-2 gap-1">
            <div className="text-gray-600">Synced:</div>
            <div>{syncedCount} emails</div>
          </div>
          
          <div className="grid grid-cols-2 gap-1">
            <div className="text-gray-600">Failed:</div>
            <div>{failedCount} emails</div>
          </div>
        </>
      )}
    </div>
  );
}
