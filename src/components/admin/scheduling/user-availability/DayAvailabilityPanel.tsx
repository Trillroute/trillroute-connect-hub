
import React, { useEffect } from 'react';
import { DayAvailability } from '@/hooks/useUserAvailability';
import { UserAvailability } from '@/services/userAvailabilityService';
import TimeSlotDialog from './TimeSlotDialog';
import { useTimeSlotDialog } from './day-panel/useTimeSlotDialog';
import AvailabilitySlotsGrid from './day-panel/AvailabilitySlotsGrid';

interface DayAvailabilityPanelProps {
  day: DayAvailability;
  onAddSlot: (startTime: string, endTime: string) => Promise<boolean>;
  onUpdateSlot: (id: string, startTime: string, endTime: string) => Promise<boolean>;
  onDeleteSlot: (id: string) => Promise<boolean>;
}

const DayAvailabilityPanel: React.FC<DayAvailabilityPanelProps> = ({
  day,
  onAddSlot,
  onUpdateSlot,
  onDeleteSlot
}) => {
  const { 
    isDialogOpen, 
    editingSlot, 
    setIsDialogOpen, 
    handleOpenEditDialog, 
    handleCloseDialog, 
    handleSaveSlot 
  } = useTimeSlotDialog({ onAddSlot, onUpdateSlot });
  
  // Debug log when component renders or day changes
  useEffect(() => {
    console.log(`DayAvailabilityPanel for ${day.dayName}:`, {
      dayOfWeek: day.dayOfWeek,
      slots: day.slots,
      slotsCount: day.slots.length
    });
  }, [day]);

  return (
    <div className="py-2">
      <AvailabilitySlotsGrid
        slots={day.slots}
        dayName={day.dayName}
        onEditSlot={handleOpenEditDialog}
        onDeleteSlot={onDeleteSlot}
      />
      
      <TimeSlotDialog 
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onSave={handleSaveSlot}
        initialStartTime={editingSlot?.startTime}
        initialEndTime={editingSlot?.endTime}
        isEditing={!!editingSlot}
        day={day.dayName}
      />
    </div>
  );
};

export default DayAvailabilityPanel;
