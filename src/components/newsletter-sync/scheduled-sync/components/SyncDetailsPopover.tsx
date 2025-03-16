
import React from "react";
import { SyncLogEntry } from "@/lib/supabase/emailAccounts/syncLogs";
import { Button } from "@/components/ui/button";
import { InfoIcon } from "lucide-react";
import { 
  Popover,
  PopoverContent,
  PopoverTrigger
} from "@/components/ui/popover";
import { DetailedSyncInfo } from "./DetailedSyncInfo";

interface SyncDetailsPopoverProps {
  log: SyncLogEntry;
  isDetailsOpen: boolean;
  setIsDetailsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export function SyncDetailsPopover({ 
  log, 
  isDetailsOpen, 
  setIsDetailsOpen 
}: SyncDetailsPopoverProps) {
  return (
    <Popover open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
      <PopoverTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-5 w-5 rounded-full p-0 ml-1"
          aria-label="View sync details"
        >
          <InfoIcon className="h-3 w-3" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 bg-white text-gray-900 border border-gray-200 shadow-md p-4" align="end">
        <DetailedSyncInfo log={log} />
      </PopoverContent>
    </Popover>
  );
}
