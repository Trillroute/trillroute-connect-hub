
import React, { useEffect } from 'react';
import { DayAvailability } from '@/hooks/useUserAvailability';
import { UserAvailability } from '@/services/userAvailabilityService';
import TimeSlotDialog from './TimeSlotDialog';
import { useTimeSlotDialog } from './day-panel/useTimeSlotDialog';
import AvailabilitySlotsGrid from './day-panel/AvailabilitySlotsGrid';

interface DayAvailabilityPanelProps {
  day: DayAvailability;
  onAddSlot: (startTime: string, endTime: string, category: string) => Promise<boolean>;
  onUpdateSlot: (id: string, startTime: string, endTime: string, category: string) => Promise<boolean>;
  onDeleteSlot: (id: string) => Promise<boolean>;
}

const DayAvailabilityPanel: React.FC<DayAvailabilityPanelProps> = ({
  day,
  onAddSlot,
  onUpdateSlot,
  onDeleteSlot
}) => {
  // onAddSlot here is already wrapped to include the day information
  const { 
    isDialogOpen, 
    editingSlot, 
    setIsDialogOpen, 
    handleOpenEditDialog,
    handleOpenNewDialog, 
    handleCloseDialog, 
    handleSaveSlot 
  } = useTimeSlotDialog({ 
    onAddSlot, 
    onUpdateSlot 
  });
  
  // Debug log when component renders or day changes
  useEffect(() => {
    console.log(`DayAvailabilityPanel for ${day.dayName}:`, {
      dayOfWeek: day.dayOfWeek,
      slots: day.slots,
      slotsCount: day.slots.length
    });
  }, [day]);

  // Modified to correctly handle the slot editing
  const onSaveSlot = (startTime: string, endTime: string, category: string) => {
    return handleSaveSlot(day.dayOfWeek, startTime, endTime, category);
  };

  return (
    <div className="py-2">
      <AvailabilitySlotsGrid
        slots={day.slots}
        dayName={day.dayName}
        onEditSlot={handleOpenEditDialog}
        onDeleteSlot={onDeleteSlot}
        onAddSlot={(hour?: number, minute?: number) => handleOpenNewDialog(hour, minute)}
      />
      
      <TimeSlotDialog 
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onSave={onSaveSlot}
        initialStartTime={editingSlot?.startTime}
        initialEndTime={editingSlot?.endTime}
        initialCategory={editingSlot?.category}
        isEditing={!!editingSlot?.id}
        day={day.dayName}
      />
    </div>
  );
};

export default DayAvailabilityPanel;
