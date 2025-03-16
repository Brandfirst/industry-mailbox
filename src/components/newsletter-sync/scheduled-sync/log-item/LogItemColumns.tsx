
import React from "react";

export type LogItemColumnsProps = {
  status: React.ReactNode;
  timestamp: string;
  syncType: "manual" | "scheduled";
  messageCount: number;
};

export function LogItemColumns({ 
  status, 
  timestamp, 
  syncType, 
  messageCount 
}: LogItemColumnsProps) {
  return (
    <div className="grid grid-cols-4 gap-3 mb-2">
      <div>
        {status}
      </div>
      <div className="text-sm text-gray-600">
        {timestamp}
      </div>
      <div className="text-sm text-gray-600 capitalize">
        {syncType}
      </div>
      <div className="text-sm text-gray-600">
        {messageCount} emails
      </div>
    </div>
  );
}
