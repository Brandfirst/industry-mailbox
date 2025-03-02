
import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CardTitle } from "@/components/ui/card";

interface SenderPageHeaderProps {
  onRefresh: () => void;
  refreshing: boolean;
}

export default function SenderPageHeader({ onRefresh, refreshing }: SenderPageHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <CardTitle className="text-2xl font-bold">Newsletter Senders</CardTitle>
      <div className="flex items-center gap-2">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={onRefresh}
          disabled={refreshing}
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>
    </div>
  );
}
