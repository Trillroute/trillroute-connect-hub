
import React, { useState, useCallback, useEffect } from 'react';
import { DayAvailability } from '@/hooks/useUserAvailability';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import DayAvailabilityPanel from './DayAvailabilityPanel';
import CopyDayDialog from './CopyDayDialog';
import { Button } from '@/components/ui/button';
import { Loader2, RefreshCw } from 'lucide-react';

interface UserAvailabilityScheduleProps {
  dailyAvailability: DayAvailability[];
  loading: boolean;
  onAddSlot: (dayOfWeek: number, startTime: string, endTime: string) => Promise<boolean>;
  onUpdateSlot: (id: string, startTime: string, endTime: string) => Promise<boolean>;
  onDeleteSlot: (id: string) => Promise<boolean>;
  onCopyDay: (fromDay: number, toDay: number) => Promise<boolean>;
  onRefresh: () => Promise<void>;
  userId?: string;
}

const UserAvailabilitySchedule: React.FC<UserAvailabilityScheduleProps> = ({
  dailyAvailability,
  loading,
  onAddSlot,
  onUpdateSlot,
  onDeleteSlot,
  onCopyDay,
  onRefresh,
  userId
}) => {
  const [activeDay, setActiveDay] = useState("0"); // Default to Sunday
  const [isCopyDialogOpen, setIsCopyDialogOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [localLoading, setLocalLoading] = useState(loading);
  
  // Use this effect to sync the loading prop but prevent too frequent updates
  useEffect(() => {
    // Only update local loading state if the main loading state has been true for a while
    // This helps prevent flickering on quick operations
    if (loading) {
      const timer = setTimeout(() => {
        setLocalLoading(true);
      }, 300); // Small delay before showing loading state
      return () => clearTimeout(timer);
    } else {
      setLocalLoading(false);
    }
  }, [loading]);
  
  const handleTabChange = useCallback((value: string) => {
    setActiveDay(value);
  }, []);

  const handleCopyDay = useCallback(() => {
    setIsCopyDialogOpen(true);
  }, []);
  
  const handleRefresh = useCallback(async () => {
    if (localLoading || isRefreshing) return;
    
    setIsRefreshing(true);
    try {
      await onRefresh();
    } finally {
      // Set a delay before removing refreshing state to prevent flickering
      setTimeout(() => {
        setIsRefreshing(false);
      }, 300);
    }
  }, [localLoading, isRefreshing, onRefresh]);

  // Reset active day when user changes
  useEffect(() => {
    setActiveDay("0"); // Reset to Sunday when user changes
  }, [userId]);

  console.log("UserAvailabilitySchedule rendering", {
    loading: localLoading,
    isRefreshing,
    availabilityCount: dailyAvailability.length,
    userId
  });

  // Define what "content loading" means 
  const isContentLoading = localLoading && (dailyAvailability.length === 0 || !dailyAvailability[0]?.slots);
  
  // Check if we have valid data to display
  const hasData = dailyAvailability.length > 0;

  // Add a wrapper function for addSlot to prevent flickering
  const handleAddSlot = async (dayOfWeek: number, startTime: string, endTime: string) => {
    // Don't set local loading here to prevent flickering
    return await onAddSlot(dayOfWeek, startTime, endTime);
  };
  
  // Add a wrapper function for updateSlot to prevent flickering
  const handleUpdateSlot = async (id: string, startTime: string, endTime: string) => {
    // Don't set local loading here to prevent flickering
    return await onUpdateSlot(id, startTime, endTime);
  };
  
  // Add a wrapper function for deleteSlot to prevent flickering
  const handleDeleteSlot = async (id: string) => {
    // Don't set local loading here to prevent flickering
    return await onDeleteSlot(id);
  };

  return (
    <div className="p-4">
      <div className="flex justify-between mb-4 items-center">
        <h2 className="text-2xl font-bold">Weekly Availability Schedule</h2>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={handleCopyDay}
            disabled={isContentLoading || isRefreshing || !hasData}
          >
            Copy Day Schedule
          </Button>
          <Button 
            variant="outline" 
            onClick={handleRefresh} 
            disabled={isContentLoading || isRefreshing}
          >
            {isRefreshing ? (
              <><Loader2 className="h-4 w-4 animate-spin mr-2" /> Refreshing...</>
            ) : (
              <><RefreshCw className="h-4 w-4 mr-2" /> Refresh</>
            )}
          </Button>
        </div>
      </div>
      
      {isContentLoading ? (
        <div className="flex justify-center items-center h-48">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : !hasData ? (
        <div className="flex justify-center items-center h-48 text-gray-500">
          No availability data could be loaded
        </div>
      ) : (
        <Tabs defaultValue={activeDay} value={activeDay} onValueChange={handleTabChange}>
          <TabsList className="grid grid-cols-7 w-full">
            {dailyAvailability.map((day) => (
              <TabsTrigger key={day.dayOfWeek} value={day.dayOfWeek.toString()}>
                {day.dayName}
              </TabsTrigger>
            ))}
          </TabsList>
          
          {dailyAvailability.map((day) => (
            <TabsContent key={day.dayOfWeek} value={day.dayOfWeek.toString()}>
              <DayAvailabilityPanel 
                day={day}
                onAddSlot={(startTime, endTime) => handleAddSlot(day.dayOfWeek, startTime, endTime)}
                onUpdateSlot={handleUpdateSlot}
                onDeleteSlot={handleDeleteSlot}
              />
            </TabsContent>
          ))}
        </Tabs>
      )}
      
      {hasData && (
        <CopyDayDialog 
          open={isCopyDialogOpen} 
          onOpenChange={setIsCopyDialogOpen}
          daysOfWeek={dailyAvailability.map(day => ({ 
            dayOfWeek: day.dayOfWeek, 
            dayName: day.dayName 
          }))}
          onCopyDay={onCopyDay}
        />
      )}
    </div>
  );
};

export default UserAvailabilitySchedule;
