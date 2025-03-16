
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronDownIcon, ChevronUpIcon } from "lucide-react";

interface UniqueSendersSectionProps {
  uniqueSendersArray: string[];
  newSendersCount: number;
}

export function UniqueSendersSection({ uniqueSendersArray, newSendersCount }: UniqueSendersSectionProps) {
  const [showAllSenders, setShowAllSenders] = useState(false);
  
  if (newSendersCount <= 0 || uniqueSendersArray.length === 0) return null;
  
  const maxInitialSenders = 3;
  const displayedSenders = showAllSenders 
    ? uniqueSendersArray 
    : uniqueSendersArray.slice(0, maxInitialSenders);
  
  return (
    <div className="mt-2 pt-2 border-t border-gray-100">
      <div className="text-gray-600 mb-1">New Senders ({newSendersCount}):</div>
      <div className="max-h-40 overflow-y-auto">
        {displayedSenders.map((sender: string, index: number) => (
          <div key={index} className="mb-1 text-xs">{sender}</div>
        ))}
        
        {uniqueSendersArray.length > maxInitialSenders && (
          <Button 
            variant="ghost" 
            size="sm" 
            className="w-full h-6 text-xs mt-1" 
            onClick={() => setShowAllSenders(!showAllSenders)}
          >
            {showAllSenders ? (
              <>Show Less <ChevronUpIcon className="ml-1 h-3 w-3" /></>
            ) : (
              <>Show All ({uniqueSendersArray.length}) <ChevronDownIcon className="ml-1 h-3 w-3" /></>
            )}
          </Button>
        )}
      </div>
    </div>
  );
}
