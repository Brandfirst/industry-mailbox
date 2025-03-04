
import { useState } from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

type ScheduleOption = "hourly" | "daily" | "disabled";
type SyncLogEntry = {
  timestamp: string;
  status: "success" | "failed";
  accountId: string;
  messageCount: number;
  error?: string;
};

type ScheduledSyncSettingsProps = {
  selectedAccount: string | null;
};

export function ScheduledSyncSettings({ selectedAccount }: ScheduledSyncSettingsProps) {
  const [scheduleOption, setScheduleOption] = useState<ScheduleOption>("disabled");
  const [specificHour, setSpecificHour] = useState<string>("09");
  const [isEnabled, setIsEnabled] = useState(false);
  const [syncLogs, setSyncLogs] = useState<SyncLogEntry[]>([]);
  const [showLogs, setShowLogs] = useState(false);

  // Mock sync logs for demo
  const mockSyncLogs: SyncLogEntry[] = [
    {
      timestamp: new Date(Date.now() - 3600000).toISOString(),
      status: "success",
      accountId: selectedAccount || "unknown",
      messageCount: 15
    },
    {
      timestamp: new Date(Date.now() - 7200000).toISOString(),
      status: "failed",
      accountId: selectedAccount || "unknown",
      messageCount: 0,
      error: "Connection timeout"
    },
    {
      timestamp: new Date(Date.now() - 10800000).toISOString(),
      status: "success",
      accountId: selectedAccount || "unknown",
      messageCount: 23
    }
  ];

  const handleScheduleChange = (value: string) => {
    setScheduleOption(value as ScheduleOption);
    
    if (value !== "disabled" && !isEnabled) {
      setIsEnabled(true);
    }
  };

  const handleSaveSchedule = () => {
    if (!selectedAccount) {
      toast.error("Please select an email account first");
      return;
    }

    // In a real implementation, this would save the schedule to the database
    toast.success(`Automatic sync ${isEnabled ? "enabled" : "disabled"} for ${scheduleOption === "hourly" ? "every hour" : `daily at ${specificHour}:00`}`);
    
    // For demonstration, load mock logs
    setSyncLogs(mockSyncLogs);
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  return (
    <Card className="w-full mt-4">
      <CardHeader>
        <CardTitle className="text-base">Automatic Sync Settings</CardTitle>
        <CardDescription>
          Configure when your emails should automatically sync
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Switch 
              id="auto-sync" 
              checked={isEnabled} 
              onCheckedChange={setIsEnabled}
              disabled={!selectedAccount}
            />
            <Label htmlFor="auto-sync">Enable automatic sync</Label>
          </div>
          
          <div className="flex items-center space-x-2">
            <Select 
              value={scheduleOption} 
              onValueChange={handleScheduleChange}
              disabled={!isEnabled || !selectedAccount}
            >
              <SelectTrigger className="w-36">
                <SelectValue placeholder="Select frequency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="hourly">Every hour</SelectItem>
                <SelectItem value="daily">Daily</SelectItem>
                <SelectItem value="disabled">Disabled</SelectItem>
              </SelectContent>
            </Select>
            
            {scheduleOption === "daily" && (
              <div className="flex items-center space-x-2">
                <Label htmlFor="specific-hour">at</Label>
                <Input
                  id="specific-hour"
                  type="number"
                  min="0"
                  max="23"
                  className="w-16"
                  value={specificHour}
                  onChange={(e) => setSpecificHour(e.target.value)}
                  disabled={!isEnabled || !selectedAccount}
                />
                <Label htmlFor="specific-hour">:00</Label>
              </div>
            )}
          </div>
          
          <Button 
            variant="outline" 
            onClick={handleSaveSchedule}
            disabled={!isEnabled || !selectedAccount}
          >
            Save Schedule
          </Button>
        </div>
        
        <div className="mt-6">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium">Sync History</h3>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setShowLogs(!showLogs)}
              className="text-xs"
            >
              {showLogs ? "Hide logs" : "Show logs"}
            </Button>
          </div>
          
          {showLogs && (
            <div className="mt-2 border rounded-md overflow-hidden">
              <div className="bg-muted px-4 py-2 text-xs font-medium grid grid-cols-4 gap-2">
                <div>Time</div>
                <div>Status</div>
                <div>Messages</div>
                <div>Details</div>
              </div>
              <div className="divide-y">
                {syncLogs.length > 0 ? (
                  syncLogs.map((log, index) => (
                    <div key={index} className="px-4 py-2 text-xs grid grid-cols-4 gap-2">
                      <div>{formatTimestamp(log.timestamp)}</div>
                      <div>
                        <span className={`inline-block px-2 py-1 rounded text-xs ${
                          log.status === "success" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                        }`}>
                          {log.status}
                        </span>
                      </div>
                      <div>{log.messageCount}</div>
                      <div className="text-muted-foreground truncate">
                        {log.error || "Completed successfully"}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="px-4 py-4 text-xs text-center text-muted-foreground">
                    No sync logs available
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
