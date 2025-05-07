
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
  
  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingSlot(null);
  };
  
  const handleSaveSlot = async (startTime: string, endTime: string, category: string) => {
    let success = false;
    
    if (editingSlot) {
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
    handleCloseDialog,
    handleSaveSlot
  };
}
