
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

type ScheduleOption = "hourly" | "daily" | "disabled";

type ScheduleSelectorProps = {
  isEnabled: boolean;
  setIsEnabled: (value: boolean) => void;
  scheduleOption: ScheduleOption;
  setScheduleOption: (value: ScheduleOption) => void;
  specificHour: string;
  setSpecificHour: (value: string) => void;
  onSaveSchedule: () => void;
  isSaving: boolean;
  disabled: boolean;
};

export function ScheduleSelector({
  isEnabled,
  setIsEnabled,
  scheduleOption,
  setScheduleOption,
  specificHour,
  setSpecificHour,
  onSaveSchedule,
  isSaving,
  disabled
}: ScheduleSelectorProps) {
  const handleScheduleChange = (value: string) => {
    setScheduleOption(value as ScheduleOption);
    
    if (value !== "disabled" && !isEnabled) {
      setIsEnabled(true);
    }
  };

  return (
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center space-x-2">
        <Switch 
          id="auto-sync" 
          checked={isEnabled} 
          onCheckedChange={setIsEnabled}
          disabled={disabled}
        />
        <Label htmlFor="auto-sync">Enable automatic sync</Label>
      </div>
      
      <div className="flex items-center space-x-2">
        <Select 
          value={scheduleOption} 
          onValueChange={handleScheduleChange}
          disabled={!isEnabled || disabled}
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
              disabled={!isEnabled || disabled}
            />
            <Label htmlFor="specific-hour">:00</Label>
          </div>
        )}
      </div>
      
      <Button 
        variant="outline" 
        onClick={onSaveSchedule}
        disabled={disabled || isSaving}
      >
        {isSaving ? "Saving..." : "Save Schedule"}
      </Button>
    </div>
  );
}
