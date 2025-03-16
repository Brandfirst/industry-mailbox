
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { getSyncLogs, getSyncSchedule } from "@/lib/supabase/emailAccounts/syncLogs";
import { SyncScheduleControls, SyncLogsList } from "./scheduled-sync";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { InfoIcon, AlertTriangleIcon } from "lucide-react";
import { SyncLogEntry } from "@/lib/supabase/emailAccounts/syncLogs";

type ScheduleOption = "minute" | "hourly" | "daily" | "disabled";
type ScheduledSyncSettingsProps = {
  selectedAccount: string | null;
};

export function ScheduledSyncSettings({
  selectedAccount
}: ScheduledSyncSettingsProps) {
  const [scheduleOption, setScheduleOption] = useState<ScheduleOption>("disabled");
  const [specificHour, setSpecificHour] = useState<string>("09");
  const [isEnabled, setIsEnabled] = useState(false);
  const [syncLogs, setSyncLogs] = useState<SyncLogEntry[]>([]);
  const [showLogs, setShowLogs] = useState(true); // Set to true by default to show logs immediately
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingSettings, setIsLoadingSettings] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<string | undefined>(undefined);
  const [settingsLoaded, setSettingsLoaded] = useState(false);

  // Fetch account settings when selected account changes
  useEffect(() => {
    if (selectedAccount) {
      console.log("Account selected, loading settings for:", selectedAccount);
      setSettingsLoaded(false);
      loadAccountSettings();

      // Also fetch logs when account changes
      if (showLogs) {
        fetchSyncLogs();
      }
    } else {
      // Reset if no account selected
      console.log("No account selected, resetting settings");
      setIsEnabled(false);
      setScheduleOption("disabled");
      setSpecificHour("09");
      setLastUpdated(undefined);
      setSettingsLoaded(false);
      setSyncLogs([]);
    }
  }, [selectedAccount]);

  const loadAccountSettings = async () => {
    if (!selectedAccount) return;
    setIsLoadingSettings(true);
    try {
      console.log("Loading account settings for:", selectedAccount);
      const settings = await getSyncSchedule(selectedAccount);
      console.log("Retrieved settings:", settings);
      if (settings) {
        // Update state with the retrieved settings
        setIsEnabled(settings.enabled);
        setScheduleOption(settings.scheduleType as ScheduleOption);
        setLastUpdated(settings.updated_at);
        if (settings.hour !== undefined && settings.hour !== null) {
          setSpecificHour(settings.hour.toString().padStart(2, '0'));
        }

        // Mark settings as loaded
        setSettingsLoaded(true);
        console.log("Settings loaded successfully:", {
          enabled: settings.enabled,
          scheduleType: settings.scheduleType,
          hour: settings.hour,
          lastUpdated: settings.updated_at
        });
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
      console.log("Fetching sync logs for account:", selectedAccount);
      // Increased limit to 100 to ensure we have enough logs for row count filtering
      const logs = await getSyncLogs(selectedAccount, 100); 
      console.log("Retrieved logs:", logs);
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

  return <Card className="w-full mt-4">
      <CardHeader>
        <CardTitle className="text-base">Automatic Sync Settings</CardTitle>
        <CardDescription>
          Configure when your emails should automatically sync
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoadingSettings ? <div className="space-y-2">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div> : <>
            <SyncScheduleControls selectedAccount={selectedAccount} isEnabled={isEnabled} setIsEnabled={setIsEnabled} scheduleOption={scheduleOption} setScheduleOption={setScheduleOption} specificHour={specificHour} setSpecificHour={setSpecificHour} refreshLogs={fetchSyncLogs} lastUpdated={lastUpdated} settingsLoaded={settingsLoaded} />
            
            {!selectedAccount && <Alert variant="default" className="mt-4 bg-yellow-50/10 border-yellow-200">
                <AlertTriangleIcon className="h-4 w-4 text-yellow-500" />
                <AlertDescription className="text-sm text-yellow-700">
                  Select an email account to configure automatic sync settings
                </AlertDescription>
              </Alert>}
            
            <SyncLogsList 
              showLogs={showLogs} 
              setShowLogs={setShowLogs} 
              isLoading={isLoading} 
              syncLogs={syncLogs} 
              selectedAccount={selectedAccount} 
              fetchSyncLogs={fetchSyncLogs} 
              formatTimestamp={formatTimestamp} 
              setSyncLogs={setSyncLogs} 
            />
          </>}
      </CardContent>
    </Card>;
}
