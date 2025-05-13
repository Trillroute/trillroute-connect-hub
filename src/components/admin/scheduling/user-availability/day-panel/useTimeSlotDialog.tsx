
import React, { useState, useCallback } from 'react';
import { UserAvailability } from '@/services/availability/types';

interface UseTimeSlotDialogProps {
  onAddSlot: (dayOfWeek: number, startTime: string, endTime: string, category: string) => Promise<boolean>;
  onUpdateSlot: (id: string, startTime: string, endTime: string, category: string) => Promise<boolean>;
  onDeleteSlot: (id: string) => Promise<boolean>;
}

interface TimeSlotDialogState {
  isOpen: boolean;
  isEditing: boolean;
  isLoading: boolean;
  slot: UserAvailability | null;
  dayOfWeek: number;
}

export function useTimeSlotDialog({
  onAddSlot,
  onUpdateSlot,
  onDeleteSlot
}: UseTimeSlotDialogProps) {
  const [state, setState] = useState<TimeSlotDialogState>({
    isOpen: false,
    isEditing: false,
    isLoading: false,
    slot: null,
    dayOfWeek: 0
  });

  // Helper function to convert our component's slot format to the API's UserAvailability format
  const convertToUserAvailability = (slot: {
    id: string;
    userId: string;
    dayOfWeek: number;
    startTime: string;
    endTime: string;
    category: string;
    createdAt: Date;
    updatedAt: Date;
  }): UserAvailability => {
    return {
      id: slot.id,
      user_id: slot.userId,
      dayOfWeek: slot.dayOfWeek,
      startTime: slot.startTime,
      endTime: slot.endTime,
      category: slot.category,
      created_at: slot.createdAt,
      updated_at: slot.updatedAt
    } as UserAvailability;
  };

  const openAddDialog = useCallback((dayOfWeek: number) => {
    setState({
      isOpen: true,
      isEditing: false,
      isLoading: false,
      slot: null,
      dayOfWeek
    });
  }, []);

  const openEditDialog = useCallback((slot: UserAvailability, dayOfWeek: number) => {
    setState({
      isOpen: true,
      isEditing: true,
      isLoading: false,
      slot,
      dayOfWeek
    });
  }, []);

  const closeDialog = useCallback(() => {
    setState(prev => ({
      ...prev,
      isOpen: false,
      isLoading: false
    }));
  }, []);

  const handleSave = async (startTime: string, endTime: string, category: string) => {
    setState(prev => ({ ...prev, isLoading: true }));

    try {
      let success: boolean;

      if (state.isEditing && state.slot) {
        // Update existing slot
        success = await onUpdateSlot(state.slot.id, startTime, endTime, category);
      } else {
        // Add new slot
        success = await onAddSlot(state.dayOfWeek, startTime, endTime, category);
      }

      if (success) {
        closeDialog();
      } else {
        setState(prev => ({ ...prev, isLoading: false }));
      }
    } catch (error) {
      console.error('Error saving time slot:', error);
      setState(prev => ({ ...prev, isLoading: false }));
    }
  };

  const handleDelete = async () => {
    if (!state.slot) return;
    
    setState(prev => ({ ...prev, isLoading: true }));

    try {
      const success = await onDeleteSlot(state.slot.id);
      if (success) {
        closeDialog();
      } else {
        setState(prev => ({ ...prev, isLoading: false }));
      }
    } catch (error) {
      console.error('Error deleting time slot:', error);
      setState(prev => ({ ...prev, isLoading: false }));
    }
  };

  return {
    isOpen: state.isOpen,
    isEditing: state.isEditing,
    isLoading: state.isLoading,
    slot: state.slot,
    dayOfWeek: state.dayOfWeek,
    openAddDialog,
    openEditDialog,
    closeDialog,
    handleSave,
    handleDelete
  };
}
