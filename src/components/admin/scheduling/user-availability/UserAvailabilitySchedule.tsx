
import React, { useEffect } from 'react';
import { DayAvailability } from '@/hooks/useUserAvailability';
import CopyDayDialog from './CopyDayDialog';
import ScheduleHeader from './schedule/ScheduleHeader';
import ScheduleContent from './schedule/ScheduleContent';
import { useScheduleOperations } from './schedule/useScheduleOperations';

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
  const {
    isCopyDialogOpen,
    isRefreshing,
    localLoading,
    operationInProgress,
    setIsCopyDialogOpen,
    handleCopyDay,
    handleRefresh,
    handleAddSlot,
    handleUpdateSlot,
    handleDeleteSlot,
    handleCopyDayOperation
  } = useScheduleOperations({
    loading,
    onAddSlot,
    onUpdateSlot,
    onDeleteSlot,
    onCopyDay,
    onRefresh
  });
  
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
  }, [dailyAvailability, loading, isRefreshing, userId]);

  // Define what "content loading" means 
  const isContentLoading = (localLoading && (dailyAvailability.length === 0 || !dailyAvailability[0]?.slots)) || operationInProgress;
  
  // Check if we have valid data to display
  const hasData = dailyAvailability.length > 0;

  return (
    <div className="p-4">
      <ScheduleHeader
        onCopyDay={handleCopyDay}
        onRefresh={handleRefresh}
        isRefreshing={isRefreshing}
        isContentLoading={isContentLoading}
        hasData={hasData}
        operationInProgress={operationInProgress}
      />
      
      <ScheduleContent
        dailyAvailability={dailyAvailability}
        isContentLoading={isContentLoading}
        hasData={hasData}
        onAddSlot={handleAddSlot}
        onUpdateSlot={handleUpdateSlot}
        onDeleteSlot={handleDeleteSlot}
      />
      
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
