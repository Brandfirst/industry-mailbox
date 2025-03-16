
import React from "react";
import { Badge } from "@/components/ui/badge";

interface TypeColumnProps {
  syncType: string;
}

export function TypeColumn({ syncType }: TypeColumnProps) {
  return (
    <div className="flex items-center">
      <Badge variant={syncType === 'manual' ? 'outline' : 'secondary'} className="font-normal">
        {syncType === 'manual' ? 'Manual' : 'Scheduled'}
      </Badge>
    </div>
  );
}
