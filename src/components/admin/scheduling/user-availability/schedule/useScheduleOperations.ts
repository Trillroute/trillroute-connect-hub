
import { useState, useCallback } from 'react';

interface UseScheduleOperationsProps {
  loading: boolean;
  onAddSlot: (dayOfWeek: number, startTime: string, endTime: string) => Promise<boolean>;
  onUpdateSlot: (id: string, startTime: string, endTime: string) => Promise<boolean>;
  onDeleteSlot: (id: string) => Promise<boolean>;
  onCopyDay: (fromDay: number, toDay: number) => Promise<boolean>;
  onRefresh: () => Promise<void>;
}

interface UseScheduleOperationsResult {
  isCopyDialogOpen: boolean;
  isRefreshing: boolean;
  localLoading: boolean;
  operationInProgress: boolean;
  setIsCopyDialogOpen: (open: boolean) => void;
  handleCopyDay: () => void;
  handleRefresh: () => Promise<void>;
  handleAddSlot: (dayOfWeek: number, startTime: string, endTime: string) => Promise<boolean>;
  handleUpdateSlot: (id: string, startTime: string, endTime: string) => Promise<boolean>;
  handleDeleteSlot: (id: string) => Promise<boolean>;
  handleCopyDayOperation: (fromDay: number, toDay: number) => Promise<boolean>;
}

export function useScheduleOperations({
  loading,
  onAddSlot,
  onUpdateSlot,
  onDeleteSlot,
  onCopyDay,
  onRefresh
}: UseScheduleOperationsProps): UseScheduleOperationsResult {
  const [isCopyDialogOpen, setIsCopyDialogOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [localLoading, setLocalLoading] = useState(loading);
  const [operationInProgress, setOperationInProgress] = useState(false);
  
  // Use effect to sync loading prop omitted, would be added in the main component

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
      return await onAddSlot(dayOfWeek, startTime, endTime);
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
      return await onCopyDay(fromDay, toDay);
    } finally {
      setTimeout(() => setOperationInProgress(false), 300);
    }
  };

  return {
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
  };
}
