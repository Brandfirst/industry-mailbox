
import React, { useState, useEffect } from 'react';
import { ScheduleOption } from '../SyncScheduleControls';
import { Clock } from 'lucide-react';

type ScheduleStatusProps = {
  scheduleOption: ScheduleOption;
  specificHour: string;
  lastUpdated?: string;
  isEnabled: boolean;
};

export function ScheduleStatus({ scheduleOption, specificHour, lastUpdated, isEnabled }: ScheduleStatusProps) {
  const [timeUntilNextSync, setTimeUntilNextSync] = useState<string>('');
  const [nextSyncTime, setNextSyncTime] = useState<string>('');
  
  // Calculate next sync time and countdown
  useEffect(() => {
    if (!isEnabled || scheduleOption === 'disabled') {
      setTimeUntilNextSync('');
      setNextSyncTime('');
      return;
    }
    
    const calculateNextSync = () => {
      const now = new Date();
      let nextSync = new Date();
      
      switch (scheduleOption) {
        case 'minute':
          // Next minute
          nextSync.setMinutes(now.getMinutes() + 1);
          nextSync.setSeconds(0);
          break;
        case 'hourly':
          // Next hour
          nextSync.setHours(now.getHours() + 1);
          nextSync.setMinutes(0);
          nextSync.setSeconds(0);
          break;
        case 'daily':
          const hour = parseInt(specificHour, 10);
          if (isNaN(hour) || hour < 0 || hour > 23) return;
          
          // Set to today at specified hour
          nextSync.setHours(hour);
          nextSync.setMinutes(0);
          nextSync.setSeconds(0);
          
          // If that time has already passed today, set to tomorrow
          if (nextSync <= now) {
            nextSync.setDate(nextSync.getDate() + 1);
          }
          break;
      }
      
      // Format the next sync time
      setNextSyncTime(
        nextSync.toLocaleTimeString([], { 
          hour: '2-digit', 
          minute: '2-digit',
          hour12: true
        }) + (scheduleOption === 'daily' ? 
          ` on ${nextSync.toLocaleDateString([], { month: 'short', day: 'numeric' })}` : 
          '')
      );
      
      // Calculate time until next sync
      const diffMs = nextSync.getTime() - now.getTime();
      
      if (diffMs <= 0) return;
      
      const diffSec = Math.floor(diffMs / 1000);
      const diffMin = Math.floor(diffSec / 60);
      const diffHour = Math.floor(diffMin / 60);
      const diffDay = Math.floor(diffHour / 24);
      
      let timeUntil = '';
      
      if (diffDay > 0) {
        timeUntil = `${diffDay}d ${diffHour % 24}h`;
      } else if (diffHour > 0) {
        timeUntil = `${diffHour}h ${diffMin % 60}m`;
      } else if (diffMin > 0) {
        timeUntil = `${diffMin}m ${diffSec % 60}s`;
      } else {
        timeUntil = `${diffSec}s`;
      }
      
      setTimeUntilNextSync(timeUntil);
    };
    
    calculateNextSync();
    
    // Update every second for the countdown
    const interval = setInterval(calculateNextSync, 1000);
    return () => clearInterval(interval);
  }, [scheduleOption, specificHour, isEnabled]);
  
  const getStatusMessage = () => {
    if (!isEnabled) {
      return "Automatic syncing is currently disabled.";
    }
    
    switch (scheduleOption) {
      case "minute":
        return "Emails will sync every minute.";
      case "hourly":
        return "Emails will sync once every hour at the top of the hour.";
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
    <div className="mt-2 space-y-1">
      <div className="text-sm text-gray-600">
        {getStatusMessage()}
      </div>
      
      {isEnabled && scheduleOption !== 'disabled' && nextSyncTime && (
        <div className="flex items-center space-x-2 text-sm text-purple-700 font-medium">
          <Clock className="h-4 w-4" />
          <span>Next sync: {nextSyncTime} {timeUntilNextSync && `(in ${timeUntilNextSync})`}</span>
        </div>
      )}
      
      {lastUpdated && (
        <div className="text-xs text-gray-500">
          Settings last saved: {new Date(lastUpdated).toLocaleString()}
        </div>
      )}
    </div>
  );
}
