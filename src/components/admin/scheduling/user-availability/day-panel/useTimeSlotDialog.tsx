
import React, { useState } from 'react';
import { UserAvailability } from '@/services/userAvailabilityService';

interface TimeSlotDialogProps {
  onAddSlot: (dayOfWeek: number, startTime: string, endTime: string, category: string) => Promise<boolean>;
  onUpdateSlot: (id: string, startTime: string, endTime: string, category: string) => Promise<boolean>;
}

export const useTimeSlotDialog = ({ onAddSlot, onUpdateSlot }: TimeSlotDialogProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingSlot, setEditingSlot] = useState<{
    id?: string;
    startTime?: string;
    endTime?: string;
    category?: string;
  } | null>(null);

  const handleOpenNewDialog = (hour?: number, minute?: number) => {
    // Default to current hour if not provided
    const now = new Date();
    const startHour = hour !== undefined ? hour : now.getHours();
    const startMinute = minute !== undefined ? minute : 0;
    
    // Format time as HH:MM
    const startTime = `${String(startHour).padStart(2, '0')}:${String(startMinute).padStart(2, '0')}`;
    
    // Default end time is one hour later
    const endHour = (startHour + 1) % 24;
    const endTime = `${String(endHour).padStart(2, '0')}:${String(startMinute).padStart(2, '0')}`;
    
    setEditingSlot({
      startTime,
      endTime,
      category: 'Session'
    });
    setIsDialogOpen(true);
  };

  const handleOpenEditDialog = (slot: UserAvailability) => {
    setEditingSlot({
      id: slot.id,
      startTime: slot.startTime,
      endTime: slot.endTime,
      category: slot.category
    });
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingSlot(null);
  };

  const handleSaveSlot = async (dayOfWeek: number, startTime: string, endTime: string, category: string): Promise<boolean> => {
    try {
      if (editingSlot?.id) {
        // Update existing slot
        return await onUpdateSlot(editingSlot.id, startTime, endTime, category);
      } else {
        // Add new slot
        return await onAddSlot(dayOfWeek, startTime, endTime, category);
      }
    } finally {
      handleCloseDialog();
    }
  };

  return {
    isDialogOpen,
    editingSlot,
    setIsDialogOpen,
    handleOpenEditDialog,
    handleOpenNewDialog,
    handleCloseDialog,
    handleSaveSlot
  };
};
