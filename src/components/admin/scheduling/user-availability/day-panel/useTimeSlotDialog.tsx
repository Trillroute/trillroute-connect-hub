
import { useState, useCallback } from 'react';
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

  const handleSave = useCallback(async (startTime: string, endTime: string, category: string) => {
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
  }, [state.isEditing, state.slot, state.dayOfWeek, onUpdateSlot, onAddSlot, closeDialog]);

  const handleDelete = useCallback(async () => {
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
  }, [state.slot, onDeleteSlot, closeDialog]);

  // Aliases for backward compatibility with code that uses old naming conventions
  const isDialogOpen = state.isOpen;
  const editingSlot = state.slot;
  const setIsDialogOpen = (open: boolean) => {
    if (!open) closeDialog();
  };
  const handleOpenEditDialog = openEditDialog;
  const handleOpenNewDialog = openAddDialog;
  const handleCloseDialog = closeDialog;
  const handleSaveSlot = handleSave;

  return {
    // New API
    isOpen: state.isOpen,
    isEditing: state.isEditing,
    isLoading: state.isLoading,
    slot: state.slot,
    dayOfWeek: state.dayOfWeek,
    openAddDialog,
    openEditDialog,
    closeDialog,
    handleSave,
    handleDelete,
    // Backward compatibility API
    isDialogOpen,
    editingSlot,
    setIsDialogOpen,
    handleOpenEditDialog,
    handleOpenNewDialog,
    handleCloseDialog,
    handleSaveSlot
  };
}
