import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { 
  updateSyncSchedule, 
  getSyncSchedule, 
  getNextSyncTime 
} from "@/lib/supabase/emailAccounts/syncLogs";
import { formatDistanceToNow, format } from "date-fns";

type ScheduleOption = "hourly" | "daily" | "disabled";

type SyncScheduleControlsProps = {
  selectedAccount: string | null;
  isEnabled: boolean;
  setIsEnabled: (value: boolean) => void;
  scheduleOption: ScheduleOption;
  setScheduleOption: (value: ScheduleOption) => void;
  specificHour: string;
  setSpecificHour: (value: string) => void;
  refreshLogs: () => void;
};

export function SyncScheduleControls({
  selectedAccount,
  isEnabled,
  setIsEnabled,
  scheduleOption,
  setScheduleOption,
  specificHour,
  setSpecificHour,
  refreshLogs
}: SyncScheduleControlsProps) {
  const [isSaving, setIsSaving] = useState(false);
  const [nextSyncTime, setNextSyncTime] = useState<Date | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);

  useEffect(() => {
    if (!selectedAccount) return;
    
    const loadSyncSchedule = async () => {
      const schedule = await getSyncSchedule(selectedAccount);
      
      if (schedule) {
        setIsEnabled(schedule.enabled);
        setScheduleOption(schedule.scheduleType as ScheduleOption);
        
        if (schedule.hour !== undefined && schedule.hour !== null) {
          setSpecificHour(schedule.hour.toString().padStart(2, '0'));
        }
        
        if (schedule.lastUpdated) {
          setLastUpdated(schedule.lastUpdated);
        }
        
        if (schedule.enabled) {
          const next = getNextSyncTime(schedule.scheduleType, schedule.hour);
          setNextSyncTime(next);
        } else {
          setNextSyncTime(null);
        }
      }
    };
    
    loadSyncSchedule();
  }, [selectedAccount, setIsEnabled, setScheduleOption, setSpecificHour]);
  
  useEffect(() => {
    if (isEnabled) {
      const hour = parseInt(specificHour);
      const next = getNextSyncTime(scheduleOption, isNaN(hour) ? undefined : hour);
      setNextSyncTime(next);
    } else {
      setNextSyncTime(null);
    }
  }, [isEnabled, scheduleOption, specificHour]);
  
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

    setIsSaving(true);
    
    try {
      const success = await updateSyncSchedule(
        selectedAccount,
        isEnabled,
        scheduleOption,
        scheduleOption === "daily" ? parseInt(specificHour) : undefined
      );

      if (!success) throw new Error("Failed to update sync schedule");
      
      setLastUpdated(new Date().toISOString());
      
      if (isEnabled) {
        const scheduleDesc = scheduleOption === "hourly" ? "every hour" : `daily at ${specificHour}:00`;
        toast.success(`Automatic sync enabled for ${scheduleDesc}`);
      } else {
        toast.success("Automatic sync disabled");
      }
      
      refreshLogs();
    } catch (error) {
      console.error("Error saving schedule:", error);
      toast.error("Failed to save schedule settings");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
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
          disabled={!selectedAccount || isSaving}
        >
          {isSaving ? "Saving..." : "Save Schedule"}
        </Button>
      </div>
      
      {selectedAccount && (
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
      )}
    </div>
  );
}
