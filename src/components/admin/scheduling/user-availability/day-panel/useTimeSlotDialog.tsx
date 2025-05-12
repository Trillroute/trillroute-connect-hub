
import { useState } from 'react';
import { UserAvailability } from '@/services/userAvailabilityService';
import { useToast } from '@/hooks/use-toast';

interface UseTimeSlotDialogProps {
  onAddSlot: (startTime: string, endTime: string, category: string) => Promise<boolean>;
  onUpdateSlot: (id: string, startTime: string, endTime: string, category: string) => Promise<boolean>;
}

export function useTimeSlotDialog({ onAddSlot, onUpdateSlot }: UseTimeSlotDialogProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingSlot, setEditingSlot] = useState<UserAvailability | null>(null);
  const { toast } = useToast();
  
  const handleOpenEditDialog = (slot: UserAvailability) => {
    setEditingSlot(slot);
    setIsDialogOpen(true);
  };
  
  const handleOpenNewDialog = (clickedHour?: number, clickedMinute?: number) => {
    // Set default values for a new slot based on clicked time if provided
    if (clickedHour !== undefined) {
      const startTime = `${String(clickedHour).padStart(2, '0')}:${String(clickedMinute || 0).padStart(2, '0')}:00`;
      const endTime = `${String(clickedHour + 1).padStart(2, '0')}:${String(clickedMinute || 0).padStart(2, '0')}:00`;
      
      // Create a new slot with proper type conversion
      const newSlot = {
        id: '', // Empty ID for new slots
        userId: '',
        dayOfWeek: 0, // Will be set elsewhere
        startTime, // String type for time fields
        endTime,   // String type for time fields
        category: 'Session',
        createdAt: new Date(), // Using Date object to match UserAvailability type
        updatedAt: new Date()  // Using Date object to match UserAvailability type
      } as UserAvailability;
      
      setEditingSlot(newSlot);
    } else {
      setEditingSlot(null);
    }
    
    setIsDialogOpen(true);
  };
  
  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingSlot(null);
  };
  
  const handleSaveSlot = async (startTime: string, endTime: string, category: string) => {
    let success = false;
    
    if (editingSlot && editingSlot.id) {
      success = await onUpdateSlot(editingSlot.id, startTime, endTime, category);
    } else {
      success = await onAddSlot(startTime, endTime, category);
    }
    
    if (success) {
      handleCloseDialog();
    }
    
    return success;
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
}
