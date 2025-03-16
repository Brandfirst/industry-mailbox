
import React from 'react';
import { Clock, CheckCircle, AlertCircle } from 'lucide-react';

export type ScheduleOption = "hourly" | "daily" | "disabled";

export type ScheduleStatusProps = {
  scheduleOption: ScheduleOption;
  specificHour?: string;
};

export function ScheduleStatus({ scheduleOption, specificHour }: ScheduleStatusProps) {
  const getStatusMessage = () => {
    switch (scheduleOption) {
      case 'hourly':
        return 'Your emails will sync automatically every hour.';
      case 'daily':
        return `Your emails will sync automatically once per day at ${specificHour}:00.`;
      case 'disabled':
      default:
        return 'Automatic sync is currently disabled.';
    }
  };

  const getStatusIcon = () => {
    switch (scheduleOption) {
      case 'hourly':
      case 'daily':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'disabled':
      default:
        return <AlertCircle className="w-4 h-4 text-amber-500" />;
    }
  };

  return (
    <div className="flex items-center text-sm text-muted-foreground mt-2">
      <Clock className="w-4 h-4 mr-1" />
      <span className="mr-2">Status:</span>
      {getStatusIcon()}
      <span className="ml-1">{getStatusMessage()}</span>
    </div>
  );
}
