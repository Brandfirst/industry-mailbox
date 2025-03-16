
import React from "react";
import { Badge } from "@/components/ui/badge";

interface TypeColumnProps {
  syncType: string;
}

export function TypeColumn({ syncType }: TypeColumnProps) {
  return (
    <Badge variant={syncType === 'manual' ? 'outline' : 'secondary'} className="font-normal">
      {syncType === 'manual' ? 'Manual' : 'Scheduled'}
    </Badge>
  );
}
