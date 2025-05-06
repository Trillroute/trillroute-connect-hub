
import React, { useState, useCallback, useEffect } from 'react';
import { DayAvailability } from '@/hooks/useUserAvailability';
import DayAvailabilityPanel from './DayAvailabilityPanel';
import CopyDayDialog from './CopyDayDialog';
import { Button } from '@/components/ui/button';
import { Loader2, RefreshCw, Plus } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

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
  const [isCopyDialogOpen, setIsCopyDialogOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [localLoading, setLocalLoading] = useState(loading);
  const [operationInProgress, setOperationInProgress] = useState(false);
  const [expandedDays, setExpandedDays] = useState<string[]>([]);
  
  // Debug log when component renders or availability changes
  useEffect(() => {
    console.log("UserAvailabilitySchedule rendering:", {
      availabilityCount: dailyAvailability.length,
      loading,
      isRefreshing,
      userId,
      slots: dailyAvailability.map(day => ({
        dayName: day.dayName,
        slotsCount: day.slots.length,
        slots: day.slots
      }))
    });
    
    // Expand days with slots by default
    const daysWithSlots = dailyAvailability
      .filter(day => day.slots.length > 0)
      .map(day => day.dayOfWeek.toString());
      
    if (daysWithSlots.length > 0 && !loading) {
      setExpandedDays(daysWithSlots);
    }
  }, [dailyAvailability, loading]);
  
  // Use this effect to sync the loading prop but prevent too frequent updates
  useEffect(() => {
    if (loading && !operationInProgress) {
      const timer = setTimeout(() => {
        setLocalLoading(true);
      }, 300); // Small delay before showing loading state
      return () => clearTimeout(timer);
    } else if (!loading && !operationInProgress) {
      setLocalLoading(false);
    }
  }, [loading, operationInProgress]);

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

  // Wrap slot operations to manage local loading state
  const handleAddSlot = async (dayOfWeek: number, startTime: string, endTime: string) => {
    console.log(`Adding slot for day ${dayOfWeek}: ${startTime} - ${endTime}`);
    setOperationInProgress(true);
    try {
      const result = await onAddSlot(dayOfWeek, startTime, endTime);
      if (result) {
        // Ensure this day is expanded after adding a slot
        if (!expandedDays.includes(dayOfWeek.toString())) {
          setExpandedDays([...expandedDays, dayOfWeek.toString()]);
        }
      }
      return result;
    } finally {
      setTimeout(() => setOperationInProgress(false), 300);
    }
  };
  
  const handleUpdateSlot = async (id: string, startTime: string, endTime: string) => {
    console.log(`Updating slot ${id}: ${startTime} - ${endTime}`);
    setOperationInProgress(true);
    try {
      return await onUpdateSlot(id, startTime, endTime);
    } finally {
      setTimeout(() => setOperationInProgress(false), 300);
    }
  };
  
  const handleDeleteSlot = async (id: string) => {
    console.log(`Deleting slot ${id}`);
    setOperationInProgress(true);
    try {
      return await onDeleteSlot(id);
    } finally {
      setTimeout(() => setOperationInProgress(false), 300);
    }
  };
  
  const handleCopyDayOperation = async (fromDay: number, toDay: number) => {
    console.log(`Copying slots from day ${fromDay} to day ${toDay}`);
    setOperationInProgress(true);
    try {
      const result = await onCopyDay(fromDay, toDay);
      // Ensure target day is expanded after copying slots
      if (result && !expandedDays.includes(toDay.toString())) {
        setExpandedDays([...expandedDays, toDay.toString()]);
      }
      return result;
    } finally {
      setTimeout(() => setOperationInProgress(false), 300);
    }
  };

  // Define what "content loading" means 
  const isContentLoading = (localLoading && (dailyAvailability.length === 0 || !dailyAvailability[0])) || operationInProgress;
  
  // Check if we have valid data to display
  const hasData = dailyAvailability.length > 0;

  const totalSlotsCount = dailyAvailability.reduce((total, day) => total + day.slots.length, 0);
  console.log(`Total slots across all days: ${totalSlotsCount}`);

  return (
    <div className="p-4">
      <div className="flex justify-between mb-4 items-center">
        <h2 className="text-2xl font-bold">Weekly Availability Schedule</h2>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={handleCopyDay}
            disabled={isContentLoading || isRefreshing || !hasData || operationInProgress}
          >
            Copy Day Schedule
          </Button>
          <Button 
            variant="outline" 
            onClick={handleRefresh} 
            disabled={isContentLoading || isRefreshing || operationInProgress}
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
        <div className="space-y-4">
          <div className="mb-2 text-sm text-muted-foreground">
            {totalSlotsCount} total slots defined across all days
          </div>
          <Accordion 
            type="multiple" 
            className="w-full"
            value={expandedDays}
            onValueChange={setExpandedDays}
          >
            {dailyAvailability.map((day) => (
              <AccordionItem key={day.dayOfWeek} value={day.dayOfWeek.toString()}>
                <div className="flex items-center">
                  <AccordionTrigger className="flex-1">
                    <span className="font-semibold text-lg">{day.dayName}</span>
                    <span className="ml-2 text-sm text-muted-foreground">
                      ({day.slots.length} {day.slots.length === 1 ? 'slot' : 'slots'})
                    </span>
                  </AccordionTrigger>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => {
                      e.stopPropagation();
                      const startTime = "09:00:00";
                      const endTime = "10:00:00";
                      handleAddSlot(day.dayOfWeek, startTime, endTime);
                    }}
                    className="mr-4"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <AccordionContent>
                  <DayAvailabilityPanel 
                    day={day}
                    onAddSlot={(startTime, endTime) => handleAddSlot(day.dayOfWeek, startTime, endTime)}
                    onUpdateSlot={handleUpdateSlot}
                    onDeleteSlot={handleDeleteSlot}
                  />
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      )}
      
      {hasData && (
        <CopyDayDialog 
          open={isCopyDialogOpen} 
          onOpenChange={setIsCopyDialogOpen}
          daysOfWeek={dailyAvailability.map(day => ({ 
            dayOfWeek: day.dayOfWeek, 
            dayName: day.dayName 
          }))}
          onCopyDay={handleCopyDayOperation}
        />
      )}
    </div>
  );
};

export default UserAvailabilitySchedule;
