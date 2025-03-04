
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { updateSyncSchedule } from "@/lib/supabase/emailAccounts/syncLogs";

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
      refreshLogs();
    } catch (error) {
      console.error("Error saving schedule:", error);
      toast.error("Failed to save schedule settings");
    }
  };

  return (
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
  );
}
