
import { useState, useEffect } from "react";
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
import { getSyncLogs, SyncLogEntry, updateSyncSchedule } from "@/lib/supabase/emailAccounts/syncLogs";

type ScheduleOption = "hourly" | "daily" | "disabled";

type ScheduledSyncSettingsProps = {
  selectedAccount: string | null;
};

export function ScheduledSyncSettings({ selectedAccount }: ScheduledSyncSettingsProps) {
  const [scheduleOption, setScheduleOption] = useState<ScheduleOption>("disabled");
  const [specificHour, setSpecificHour] = useState<string>("09");
  const [isEnabled, setIsEnabled] = useState(false);
  const [syncLogs, setSyncLogs] = useState<SyncLogEntry[]>([]);
  const [showLogs, setShowLogs] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch sync logs when selected account changes or when showLogs is toggled
  useEffect(() => {
    if (selectedAccount && showLogs) {
      fetchSyncLogs();
    }
  }, [selectedAccount, showLogs]);

  const fetchSyncLogs = async () => {
    if (!selectedAccount) return;
    
    setIsLoading(true);
    try {
      const logs = await getSyncLogs(selectedAccount, 10);
      setSyncLogs(logs);
    } catch (error) {
      console.error("Error fetching sync logs:", error);
      toast.error("Failed to load sync history");
    } finally {
      setIsLoading(false);
    }
  };

  const handleScheduleChange = (value: string) => {
    setScheduleOption(value as ScheduleOption);
    
    if (value !== "disabled" && !isEnabled) {
      setIsEnabled(true);
    }
  };

  const handleSaveSchedule = async () => {
    if (!selectedAccount) {
      toast.error("Please select an email account first");
      return;
    }

    try {
      // Save schedule settings to the database using the updateSyncSchedule function
      const success = await updateSyncSchedule(
        selectedAccount,
        isEnabled,
        scheduleOption,
        scheduleOption === "daily" ? parseInt(specificHour) : undefined
      );

      if (!success) throw new Error("Failed to update sync schedule");
      
      toast.success(`Automatic sync ${isEnabled ? "enabled" : "disabled"} for ${scheduleOption === "hourly" ? "every hour" : `daily at ${specificHour}:00`}`);
      
      // Refresh logs after saving
      if (showLogs) {
        fetchSyncLogs();
      }
    } catch (error) {
      console.error("Error saving schedule:", error);
      toast.error("Failed to save schedule settings");
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  // Determine display status and message count for nicer UI
  const getDisplayStatus = (log: SyncLogEntry) => {
    if (log.status === "success") {
      return {
        label: "Success",
        className: "bg-green-100 text-green-800"
      };
    } else {
      return {
        label: "Failed",
        className: "bg-red-100 text-red-800"
      };
    }
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
              onClick={() => {
                setShowLogs(!showLogs);
                if (!showLogs && selectedAccount) {
                  fetchSyncLogs();
                }
              }}
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
                {isLoading ? (
                  <div className="px-4 py-4 text-xs text-center text-muted-foreground">
                    Loading sync logs...
                  </div>
                ) : syncLogs.length > 0 ? (
                  syncLogs.map((log, index) => {
                    const statusDisplay = getDisplayStatus(log);
                    return (
                      <div key={index} className="px-4 py-2 text-xs grid grid-cols-4 gap-2">
                        <div>{formatTimestamp(log.timestamp)}</div>
                        <div>
                          <span className={`inline-block px-2 py-1 rounded text-xs ${statusDisplay.className}`}>
                            {statusDisplay.label}
                          </span>
                        </div>
                        <div>{log.message_count}</div>
                        <div className="text-muted-foreground truncate">
                          {log.error_message || "Completed successfully"}
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="px-4 py-4 text-xs text-center text-muted-foreground">
                    {selectedAccount ? "No sync logs available" : "Select an account to view sync logs"}
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
