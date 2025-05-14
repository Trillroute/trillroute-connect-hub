
import { useState, useCallback } from 'react';
import { UserAvailability } from '@/services/userAvailabilityService';
import { formatTimeForInput, parseTimeForDisplay } from '@/components/admin/scheduling/utils/dateUtils';

interface UseTimeSlotDialogProps {
  onAddSlot: (startTime: string, endTime: string, category: string) => Promise<boolean>;
  onUpdateSlot: (id: string, startTime: string, endTime: string, category: string) => Promise<boolean>;
}

export function useTimeSlotDialog({ onAddSlot, onUpdateSlot }: UseTimeSlotDialogProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingSlot, setEditingSlot] = useState<UserAvailability | null>(null);

  const handleOpenEditDialog = useCallback((slot: UserAvailability) => {
    setEditingSlot(slot);
    setIsDialogOpen(true);
  }, []);

  const handleOpenNewDialog = useCallback((hour?: number, minute?: number) => {
    // Default start time to the provided hour or current hour
    const now = new Date();
    const startHour = hour !== undefined ? hour : now.getHours();
    const startMinute = minute !== undefined ? minute : 0;
    
    // End time is one hour after start time by default
    const endHour = startHour + 1 > 23 ? 23 : startHour + 1;
    const endMinute = startMinute;
    
    // Format times as HH:MM:SS
    const startTime = formatTimeForInput(startHour, startMinute);
    const endTime = formatTimeForInput(endHour, endMinute);
    
    setEditingSlot({
      id: '',
      user_id: '',
      dayOfWeek: 0, // Placeholder, will be set when saving
      startTime,
      endTime,
      category: 'Session'
    });
    
    setIsDialogOpen(true);
  }, []);

  const handleCloseDialog = useCallback(() => {
    setIsDialogOpen(false);
    setTimeout(() => setEditingSlot(null), 300); // Clear after animation
  }, []);

  const handleSaveSlot = useCallback(async (dayOfWeek: number, startTime: string, endTime: string, category: string): Promise<boolean> => {
    try {
      if (editingSlot?.id) {
        // Update existing slot
        return await onUpdateSlot(editingSlot.id, startTime, endTime, category);
      } else {
        // Create new slot
        return await onAddSlot(startTime, endTime, category);
      }
    } catch (error) {
      console.error('Error saving availability slot:', error);
      return false;
    } finally {
      handleCloseDialog();
    }
  }, [editingSlot?.id, onAddSlot, onUpdateSlot, handleCloseDialog]);

  return {
    isDialogOpen,
    editingSlot,
    setIsDialogOpen,
    handleOpenEditDialog,
    handleOpenNewDialog,
    handleCloseDialog,
    handleSaveSlot
  };
}
