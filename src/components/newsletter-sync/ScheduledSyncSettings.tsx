
import { useState, useEffect } from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { toast } from "sonner";
import { getSyncLogs, SyncLogEntry } from "@/lib/supabase/emailAccounts/syncLogs";
import { SyncScheduleControls, SyncLogsList } from "./scheduled-sync";

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
        <SyncScheduleControls
          selectedAccount={selectedAccount}
          isEnabled={isEnabled}
          setIsEnabled={setIsEnabled}
          scheduleOption={scheduleOption}
          setScheduleOption={setScheduleOption}
          specificHour={specificHour}
          setSpecificHour={setSpecificHour}
          refreshLogs={fetchSyncLogs}
        />
        
        <SyncLogsList
          showLogs={showLogs}
          setShowLogs={setShowLogs}
          isLoading={isLoading}
          syncLogs={syncLogs}
          selectedAccount={selectedAccount}
          fetchSyncLogs={fetchSyncLogs}
          formatTimestamp={formatTimestamp}
        />
      </CardContent>
    </Card>
  );
}
