
import React from "react";

interface SendersColumnProps {
  uniqueSendersCount: number;
  sendersList: string[];
  syncedEmails: any[];
  isSendersOpen: boolean;
  setIsSendersOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export function SendersColumn({ 
  uniqueSendersCount
}: SendersColumnProps) {
  // Only showing the count without the popover or other interactive elements
  return (
    <div className="flex items-center">
      <span>{uniqueSendersCount}</span>
    </div>
  );
}
