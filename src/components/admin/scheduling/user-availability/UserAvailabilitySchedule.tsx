
import React from 'react';
import { DayAvailability } from '@/hooks/useUserAvailability';
import CopyDayDialog from './CopyDayDialog';
import { Button } from '@/components/ui/button';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import AvailabilityListView from './list-view/AvailabilityListView';
import { useState, useCallback, memo, useEffect } from 'react';

interface UserAvailabilityScheduleProps {
  dailyAvailability: DayAvailability[];
  loading: boolean;
  onAddSlot: (dayOfWeek: number, startTime: string, endTime: string, category: string) => Promise<boolean>;
  onUpdateSlot: (id: string, startTime: string, endTime: string, category: string) => Promise<boolean>;
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
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isCopyDialogOpen, setIsCopyDialogOpen] = useState(false);
  const [operationInProgress, setOperationInProgress] = useState(false);
  const [stableAvailability, setStableAvailability] = useState<DayAvailability[]>(dailyAvailability);
  
  // Update stable availability only when meaningful changes occur
  useEffect(() => {
    if (!loading && dailyAvailability.length > 0) {
      setStableAvailability(dailyAvailability);
    }
  }, [loading, dailyAvailability]);
  
  const handleRefresh = useCallback(async () => {
    if (loading || isRefreshing) return;
    
    setIsRefreshing(true);
    try {
      await onRefresh();
    } catch (error) {
      console.error("Error during refresh:", error);
    } finally {
      // Use a delay to prevent UI flickering
      setTimeout(() => {
        setIsRefreshing(false);
      }, 500);
    }
  }, [loading, isRefreshing, onRefresh]);

  const handleCopyDay = useCallback(() => {
    setIsCopyDialogOpen(true);
  }, []);
  
  const handleCopyDayOperation = useCallback(async (fromDay: number, toDay: number) => {
    setOperationInProgress(true);
    try {
      return await onCopyDay(fromDay, toDay);
    } catch (error) {
      console.error("Error copying day:", error);
      return false;
    } finally {
      setTimeout(() => {
        setOperationInProgress(false);
      }, 500);
    }
  }, [onCopyDay]);
  
  const handleAddSlot = useCallback(async (dayOfWeek: number, startTime: string, endTime: string, category: string) => {
    setOperationInProgress(true);
    try {
      return await onAddSlot(dayOfWeek, startTime, endTime, category);
    } catch (error) {
      console.error("Error adding slot:", error);
      return false;
    } finally {
      setTimeout(() => {
        setOperationInProgress(false);
      }, 500);
    }
  }, [onAddSlot]);
  
  const handleUpdateSlot = useCallback(async (id: string, startTime: string, endTime: string, category: string) => {
    setOperationInProgress(true);
    try {
      return await onUpdateSlot(id, startTime, endTime, category);
    } catch (error) {
      console.error("Error updating slot:", error);
      return false;
    } finally {
      setTimeout(() => {
        setOperationInProgress(false);
      }, 500);
    }
  }, [onUpdateSlot]);
  
  const handleDeleteSlot = useCallback(async (id: string) => {
    setOperationInProgress(true);
    try {
      return await onDeleteSlot(id);
    } catch (error) {
      console.error("Error deleting slot:", error);
      return false;
    } finally {
      setTimeout(() => {
        setOperationInProgress(false);
      }, 500);
    }
  }, [onDeleteSlot]);
  
  const isContentLoading = loading || operationInProgress;
  const hasData = stableAvailability.length > 0;
  const showLoadingSkeleton = isContentLoading && !hasData;
  const showEmptyState = !isContentLoading && !hasData;

  return (
    <div className="p-4">
      {/* Header with actions */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">Weekly Availability</h2>
        <div className="flex space-x-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleRefresh}
            disabled={isRefreshing || isContentLoading}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button 
            variant="default" 
            size="sm" 
            onClick={handleCopyDay}
            disabled={isContentLoading || !hasData}
          >
            Copy Day
          </Button>
        </div>
      </div>
      
      {/* Content */}
      {showLoadingSkeleton ? (
        <div className="space-y-4">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
        </div>
      ) : showEmptyState ? (
        <Alert variant="default" className="bg-gray-50">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>No Data Available</AlertTitle>
          <AlertDescription>
            No availability data could be loaded. This might be due to connection issues or because no availability has been set yet.
          </AlertDescription>
        </Alert>
      ) : (
        <AvailabilityListView
          dailyAvailability={stableAvailability}
          onAddSlot={handleAddSlot}
          onUpdateSlot={handleUpdateSlot}
          onDeleteSlot={handleDeleteSlot}
        />
      )}
      
      {/* Dialogs */}
      {hasData && (
        <CopyDayDialog 
          open={isCopyDialogOpen} 
          onOpenChange={setIsCopyDialogOpen}
          daysOfWeek={stableAvailability.map(day => ({ 
            dayOfWeek: day.dayOfWeek, 
            dayName: day.dayName 
          }))}
          onCopyDay={handleCopyDayOperation}
        />
      )}
    </div>
  );
};

export default memo(UserAvailabilitySchedule);
