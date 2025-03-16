
import { useState, useEffect } from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { toast } from "sonner";
import { getSyncLogs, SyncLogEntry, getSyncSchedule, SyncScheduleSettings } from "@/lib/supabase/emailAccounts/syncLogs";
import { SyncScheduleControls, SyncLogsList } from "./scheduled-sync";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { InfoIcon, AlertTriangleIcon } from "lucide-react";

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
  const [isLoadingSettings, setIsLoadingSettings] = useState(false);

  // Fetch account settings when selected account changes
  useEffect(() => {
    if (selectedAccount) {
      loadAccountSettings();
    } else {
      // Reset if no account selected
      setIsEnabled(false);
      setScheduleOption("disabled");
      setSpecificHour("09");
    }
  }, [selectedAccount]);

  // Fetch sync logs when selected account changes or when showLogs is toggled
  useEffect(() => {
    if (selectedAccount && showLogs) {
      fetchSyncLogs();
    }
  }, [selectedAccount, showLogs]);

  const loadAccountSettings = async () => {
    if (!selectedAccount) return;
    
    setIsLoadingSettings(true);
    try {
      const settings = await getSyncSchedule(selectedAccount);
      if (settings) {
        setIsEnabled(settings.enabled);
        setScheduleOption(settings.scheduleType as ScheduleOption);
        
        if (settings.hour !== undefined && settings.hour !== null) {
          setSpecificHour(settings.hour.toString().padStart(2, '0'));
        }
      }
    } catch (error) {
      console.error("Error loading account settings:", error);
      toast.error("Failed to load sync settings");
    } finally {
      setIsLoadingSettings(false);
    }
  };

  const fetchSyncLogs = async () => {
    if (!selectedAccount) return;
    
    setIsLoading(true);
    try {
      const logs = await getSyncLogs(selectedAccount, 20);
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
        {isLoadingSettings ? (
          <div className="space-y-2">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        ) : (
          <>
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
            
            {!selectedAccount && (
              <Alert variant="default" className="mt-4 bg-yellow-50/10 border-yellow-200">
                <AlertTriangleIcon className="h-4 w-4 text-yellow-500" />
                <AlertDescription className="text-sm text-yellow-700">
                  Select an email account to configure automatic sync settings
                </AlertDescription>
              </Alert>
            )}
            
            {selectedAccount && (
              <Alert variant="default" className="mt-4 bg-blue-50/10 border-blue-200">
                <InfoIcon className="h-4 w-4 text-blue-500" />
                <AlertDescription className="text-sm text-blue-700">
                  Automatic sync requires that the account remains connected. If authentication expires, 
                  you'll need to reconnect the account.
                </AlertDescription>
              </Alert>
            )}
            
            <SyncLogsList
              showLogs={showLogs}
              setShowLogs={setShowLogs}
              isLoading={isLoading}
              syncLogs={syncLogs}
              selectedAccount={selectedAccount}
              fetchSyncLogs={fetchSyncLogs}
              formatTimestamp={formatTimestamp}
            />
          </>
        )}
      </CardContent>
    </Card>
  );
}
