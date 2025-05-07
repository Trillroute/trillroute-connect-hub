
import React from 'react';
import { DayAvailability } from '@/hooks/useUserAvailability';
import CopyDayDialog from './CopyDayDialog';
import { Button } from '@/components/ui/button';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import AvailabilityListView from './list-view/AvailabilityListView';
import { useState } from 'react';

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
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isCopyDialogOpen, setIsCopyDialogOpen] = useState(false);
  const [operationInProgress, setOperationInProgress] = useState(false);
  
  const handleRefresh = async () => {
    if (loading || isRefreshing) return;
    
    setIsRefreshing(true);
    try {
      await onRefresh();
    } finally {
      setTimeout(() => {
        setIsRefreshing(false);
      }, 500);
    }
  };

  const handleCopyDay = () => {
    setIsCopyDialogOpen(true);
  };
  
  const handleCopyDayOperation = async (fromDay: number, toDay: number) => {
    setOperationInProgress(true);
    try {
      return await onCopyDay(fromDay, toDay);
    } finally {
      setTimeout(() => {
        setOperationInProgress(false);
      }, 500);
    }
  };
  
  const handleAddSlot = async (dayOfWeek: number, startTime: string, endTime: string) => {
    setOperationInProgress(true);
    try {
      return await onAddSlot(dayOfWeek, startTime, endTime);
    } finally {
      setTimeout(() => {
        setOperationInProgress(false);
      }, 500);
    }
  };
  
  const handleUpdateSlot = async (id: string, startTime: string, endTime: string) => {
    setOperationInProgress(true);
    try {
      return await onUpdateSlot(id, startTime, endTime);
    } finally {
      setTimeout(() => {
        setOperationInProgress(false);
      }, 500);
    }
  };
  
  const handleDeleteSlot = async (id: string) => {
    setOperationInProgress(true);
    try {
      return await onDeleteSlot(id);
    } finally {
      setTimeout(() => {
        setOperationInProgress(false);
      }, 500);
    }
  };
  
  const isContentLoading = loading || operationInProgress;
  const hasData = dailyAvailability.length > 0;

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
      {isContentLoading ? (
        <div className="space-y-4">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
        </div>
      ) : !hasData ? (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            Failed to load availability data. Please try refreshing.
          </AlertDescription>
        </Alert>
      ) : (
        <AvailabilityListView
          dailyAvailability={dailyAvailability}
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
