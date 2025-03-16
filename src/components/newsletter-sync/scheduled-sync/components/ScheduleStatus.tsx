
import React from 'react';
import { ScheduleOption } from './ScheduleSelector';

type ScheduleStatusProps = {
  scheduleOption: ScheduleOption;
  specificHour: string;
};

export function ScheduleStatus({ scheduleOption, specificHour }: ScheduleStatusProps) {
  const getStatusMessage = () => {
    switch (scheduleOption) {
      case "minute":
        return "Emails will sync every minute.";
      case "hourly":
        return "Emails will sync once every hour.";
      case "daily":
        const hour = parseInt(specificHour, 10);
        if (isNaN(hour) || hour < 0 || hour > 23) {
          return "Please enter a valid hour (0-23).";
        }
        return `Emails will sync once a day at ${hour}:00.`;
      case "disabled":
        return "Automatic syncing is currently disabled.";
      default:
        return "";
    }
  };

  return (
    <div className="mt-2 text-sm text-gray-600">
      {getStatusMessage()}
    </div>
  );
}
