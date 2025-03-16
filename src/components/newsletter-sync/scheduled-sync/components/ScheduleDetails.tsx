
import React from "react";

interface ScheduleDetailsProps {
  scheduleType?: string;
  hour?: string | number;
}

export function ScheduleDetails({ scheduleType, hour }: ScheduleDetailsProps) {
  if (!scheduleType) return null;
  
  if (scheduleType === 'hourly') {
    return <div>Every hour</div>;
  } else if (scheduleType === 'minute') {
    return <div>Every minute</div>;
  } else {
    return <div>Daily at {hour}:00</div>;
  }
}
