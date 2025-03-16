
import React from "react";
import { Button } from "@/components/ui/button";
import { SenderPopover } from "./SenderPopover";

interface SendersColumnProps {
  uniqueSendersCount: number;
  sendersList: string[];
  syncedEmails: any[];
  isSendersOpen: boolean;
  setIsSendersOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export function SendersColumn({ 
  uniqueSendersCount, 
  sendersList, 
  syncedEmails,
  isSendersOpen,
  setIsSendersOpen
}: SendersColumnProps) {
  return (
    <div className="flex items-center">
      {uniqueSendersCount > 0 ? (
        <div className="flex items-center gap-1">
          <span>{uniqueSendersCount}</span>
          <SenderPopover 
            sendersList={sendersList}
            uniqueSendersCount={uniqueSendersCount}
            syncedEmails={syncedEmails}
            isSendersOpen={isSendersOpen}
            setIsSendersOpen={setIsSendersOpen}
          />
        </div>
      ) : (
        <span>0</span>
      )}
    </div>
  );
}
