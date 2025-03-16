
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { SenderPopover } from "./SenderPopover";
import { SendersDialog } from "./SendersDialog";

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
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  // Only enable clicking when there are senders to show
  const showClickableSenders = uniqueSendersCount > 0;
  
  return (
    <div className="flex items-center">
      {uniqueSendersCount > 0 ? (
        <div className="flex items-center gap-1">
          <Button 
            variant="ghost" 
            size="sm" 
            className={`h-auto p-0 ${showClickableSenders ? 'text-blue-600 hover:text-blue-800 hover:bg-blue-50' : ''}`}
            disabled={!showClickableSenders}
            onClick={() => setIsDialogOpen(true)}
          >
            <span>{uniqueSendersCount}</span>
          </Button>
          
          <SenderPopover 
            sendersList={sendersList}
            uniqueSendersCount={uniqueSendersCount}
            syncedEmails={syncedEmails}
            isSendersOpen={isSendersOpen}
            setIsSendersOpen={setIsSendersOpen}
            onViewAllClick={() => {
              setIsSendersOpen(false);
              setIsDialogOpen(true);
            }}
          />
          
          {showClickableSenders && (
            <SendersDialog
              isOpen={isDialogOpen}
              onOpenChange={setIsDialogOpen}
              sendersList={sendersList}
              syncedEmails={syncedEmails}
              title={`Unique Senders (${uniqueSendersCount})`}
            />
          )}
        </div>
      ) : (
        <span>0</span>
      )}
    </div>
  );
}
