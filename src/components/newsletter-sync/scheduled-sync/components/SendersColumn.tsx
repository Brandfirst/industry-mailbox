
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
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
    <div className="flex items-center justify-center w-full">
      {uniqueSendersCount > 0 ? (
        <div>
          <Button 
            variant="link" 
            size="sm" 
            className={`px-0 py-0 h-auto text-blue-600 hover:text-blue-800 underline underline-offset-2 ${!showClickableSenders ? 'pointer-events-none opacity-70' : ''}`}
            disabled={!showClickableSenders}
            onClick={() => setIsDialogOpen(true)}
          >
            <span>{uniqueSendersCount}</span>
          </Button>
          
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
