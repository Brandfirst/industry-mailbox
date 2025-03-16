
import React from "react";
import { UsersIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  Popover,
  PopoverContent,
  PopoverTrigger
} from "@/components/ui/popover";
import { EmailDetails } from "./EmailDetails";

interface SenderInfoProps {
  uniqueSendersCount: number;
  sendersList: string[];
  syncedEmails: any[];
  isSendersOpen: boolean;
  setIsSendersOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export function SenderInfo({ 
  uniqueSendersCount, 
  sendersList, 
  syncedEmails,
  isSendersOpen,
  setIsSendersOpen
}: SenderInfoProps) {
  return (
    <div className="flex items-center gap-1">
      <span>{uniqueSendersCount}</span>
      
      <Popover open={isSendersOpen} onOpenChange={setIsSendersOpen}>
        <PopoverTrigger asChild>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-5 w-5 rounded-full p-0"
            aria-label="View sender details"
          >
            <UsersIcon className="h-3 w-3" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-72 bg-white text-gray-900 border border-gray-200 shadow-md p-4" align="end">
          <div className="space-y-3">
            <h4 className="font-medium text-sm">Sender Information</h4>
            <div className="text-xs">
              <div className="font-medium mb-1">
                {uniqueSendersCount} unique sender{uniqueSendersCount !== 1 ? 's' : ''}:
              </div>
              <div className="max-h-40 overflow-y-auto space-y-1">
                {sendersList.length > 0 ? (
                  sendersList.map((sender, idx) => (
                    <div key={idx} className="truncate">{sender}</div>
                  ))
                ) : (
                  <div className="text-muted-foreground italic">
                    Sender information not available
                  </div>
                )}
              </div>
              
              <EmailDetails syncedEmails={syncedEmails} />
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
