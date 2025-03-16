
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow, format } from "date-fns";

type ScheduleStatusProps = {
  isEnabled: boolean;
  nextSyncTime: Date | null;
  lastUpdated: string | null;
  selectedAccount: string | null;
};

export function ScheduleStatus({
  isEnabled,
  nextSyncTime,
  lastUpdated,
  selectedAccount
}: ScheduleStatusProps) {
  if (!selectedAccount) {
    return null;
  }

  return (
    <div className="flex items-center justify-between text-sm text-muted-foreground mt-2">
      <div>
        {isEnabled ? (
          <div className="flex items-center space-x-2">
            <Badge variant="success" className="bg-green-100 text-green-800 hover:bg-green-100">
              Scheduled
            </Badge>
            {nextSyncTime && (
              <span>
                Next sync: {formatDistanceToNow(nextSyncTime, { addSuffix: true })} 
                <span className="text-xs ml-1 opacity-70">
                  ({format(nextSyncTime, "MMM d, h:mm a")})
                </span>
              </span>
            )}
          </div>
        ) : (
          <Badge variant="outline" className="bg-gray-100">Not scheduled</Badge>
        )}
      </div>
      
      {lastUpdated && (
        <div className="text-xs opacity-70">
          Last updated: {formatDistanceToNow(new Date(lastUpdated), { addSuffix: true })}
        </div>
      )}
    </div>
  );
}
