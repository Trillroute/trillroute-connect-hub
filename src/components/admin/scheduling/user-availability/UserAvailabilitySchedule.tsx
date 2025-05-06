
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
}

const UserAvailabilitySchedule: React.FC<UserAvailabilityScheduleProps> = ({
  dailyAvailability,
  loading,
  onAddSlot,
  onUpdateSlot,
  onDeleteSlot,
  onCopyDay,
  onRefresh
}) => {
  const [activeDay, setActiveDay] = useState("0"); // Default to Sunday
  const [isCopyDialogOpen, setIsCopyDialogOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [loadTimeout, setLoadTimeout] = useState<NodeJS.Timeout | null>(null);
  
  const handleTabChange = useCallback((value: string) => {
    setActiveDay(value);
  }, []);

  const handleCopyDay = useCallback(() => {
    setIsCopyDialogOpen(true);
  }, []);
  
  const handleRefresh = useCallback(async () => {
    if (loading || isRefreshing) return;
    
    setIsRefreshing(true);
    try {
      await onRefresh();
    } finally {
      // Set a timeout to ensure we don't flicker the loading state
      const timeout = setTimeout(() => {
        setIsRefreshing(false);
      }, 500);
      setLoadTimeout(timeout);
    }
  }, [loading, isRefreshing, onRefresh]);

  // Clear timeout on unmount
  useEffect(() => {
    return () => {
      if (loadTimeout) clearTimeout(loadTimeout);
    };
  }, [loadTimeout]);

  console.log("UserAvailabilitySchedule rendering", {
    loading,
    isRefreshing,
    availabilityCount: dailyAvailability.length
  });

  // If we have availability data but still showing loading, force update
  useEffect(() => {
    if (loading && dailyAvailability.length > 0 && dailyAvailability[0].slots.length > 0) {
      console.log("Force ending loading state as we have data");
      setIsRefreshing(false);
    }
  }, [loading, dailyAvailability]);

  const isContentLoading = loading && dailyAvailability.length === 0;

  return (
    <div className="p-4">
      <div className="flex justify-between mb-4 items-center">
        <h2 className="text-2xl font-bold">Weekly Availability Schedule</h2>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={handleCopyDay}
            disabled={isContentLoading || isRefreshing}
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
      ) : dailyAvailability.length === 0 ? (
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
                onAddSlot={(startTime, endTime) => onAddSlot(day.dayOfWeek, startTime, endTime)}
                onUpdateSlot={onUpdateSlot}
                onDeleteSlot={onDeleteSlot}
              />
            </TabsContent>
          ))}
        </Tabs>
      )}
      
      <CopyDayDialog 
        open={isCopyDialogOpen} 
        onOpenChange={setIsCopyDialogOpen}
        daysOfWeek={dailyAvailability.map(day => ({ 
          dayOfWeek: day.dayOfWeek, 
          dayName: day.dayName 
        }))}
        onCopyDay={onCopyDay}
      />
    </div>
  );
};

export default UserAvailabilitySchedule;
