
import React, { useState, useCallback, memo } from 'react';
import { DayAvailability } from '@/hooks/useUserAvailability';
import DayAvailabilityList from './DayAvailabilityList';
import TimeSlotDialog from '../TimeSlotDialog';
import { UserAvailability } from '@/services/userAvailabilityService';

interface AvailabilityListViewProps {
  dailyAvailability: DayAvailability[];
  onAddSlot: (dayOfWeek: number, startTime: string, endTime: string) => Promise<boolean>;
  onUpdateSlot: (id: string, startTime: string, endTime: string) => Promise<boolean>;
  onDeleteSlot: (id: string) => Promise<boolean>;
}

const AvailabilityListView: React.FC<AvailabilityListViewProps> = ({
  dailyAvailability,
  onAddSlot,
  onUpdateSlot,
  onDeleteSlot
}) => {
  const [expandedDays, setExpandedDays] = useState<number[]>([0]); // Default expand Sunday
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [activeDayOfWeek, setActiveDayOfWeek] = useState<number | null>(null);
  const [editingSlot, setEditingSlot] = useState<UserAvailability | null>(null);

  // Memoize these functions to prevent unnecessary re-renders
  const toggleDayExpansion = useCallback((dayOfWeek: number) => {
    setExpandedDays(prevDays => 
      prevDays.includes(dayOfWeek) 
        ? prevDays.filter(day => day !== dayOfWeek)
        : [...prevDays, dayOfWeek]
    );
  }, []);

  const handleOpenAddDialog = useCallback((dayOfWeek: number) => {
    setActiveDayOfWeek(dayOfWeek);
    setEditingSlot(null);
    setIsDialogOpen(true);
  }, []);

  const handleOpenEditDialog = useCallback((slot: UserAvailability) => {
    setEditingSlot(slot);
    setActiveDayOfWeek(slot.dayOfWeek);
    setIsDialogOpen(true);
  }, []);

  const handleSaveSlot = useCallback(async (startTime: string, endTime: string): Promise<boolean> => {
    let success = false;
    
    if (editingSlot) {
      success = await onUpdateSlot(editingSlot.id, startTime, endTime);
    } else if (activeDayOfWeek !== null) {
      success = await onAddSlot(activeDayOfWeek, startTime, endTime);
    }
    
    if (success) {
      setIsDialogOpen(false);
    }
    
    return success;
  }, [editingSlot, activeDayOfWeek, onUpdateSlot, onAddSlot]);

  // Get the active day's name for the dialog
  const activeDayName = activeDayOfWeek !== null && dailyAvailability[activeDayOfWeek] 
    ? dailyAvailability[activeDayOfWeek].dayName 
    : '';

  // Memoize the MemoizedDayAvailabilityList component to prevent unnecessary re-renders
  const MemoizedDayAvailabilityList = memo(DayAvailabilityList);

  return (
    <div className="space-y-4">
      {dailyAvailability.map(day => (
        <MemoizedDayAvailabilityList
          key={day.dayOfWeek}
          day={day}
          onAddSlot={() => handleOpenAddDialog(day.dayOfWeek)}
          onEditSlot={handleOpenEditDialog}
          onDeleteSlot={onDeleteSlot}
          isExpanded={expandedDays.includes(day.dayOfWeek)}
          onToggleExpand={() => toggleDayExpansion(day.dayOfWeek)}
        />
      ))}

      <TimeSlotDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onSave={handleSaveSlot}
        initialStartTime={editingSlot?.startTime}
        initialEndTime={editingSlot?.endTime}
        isEditing={!!editingSlot}
        day={activeDayName}
      />
    </div>
  );
};

export default React.memo(AvailabilityListView);
