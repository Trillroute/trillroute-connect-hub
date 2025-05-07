
import React, { useState } from 'react';
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

  const toggleDayExpansion = (dayOfWeek: number) => {
    if (expandedDays.includes(dayOfWeek)) {
      setExpandedDays(expandedDays.filter(day => day !== dayOfWeek));
    } else {
      setExpandedDays([...expandedDays, dayOfWeek]);
    }
  };

  const handleOpenAddDialog = (dayOfWeek: number) => {
    setActiveDayOfWeek(dayOfWeek);
    setEditingSlot(null);
    setIsDialogOpen(true);
  };

  const handleOpenEditDialog = (slot: UserAvailability) => {
    setEditingSlot(slot);
    setActiveDayOfWeek(slot.dayOfWeek);
    setIsDialogOpen(true);
  };

  const handleSaveSlot = async (startTime: string, endTime: string): Promise<boolean> => {
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
  };

  return (
    <div className="space-y-4">
      {dailyAvailability.map(day => (
        <DayAvailabilityList
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
        day={activeDayOfWeek !== null ? dailyAvailability[activeDayOfWeek]?.dayName : ''}
      />
    </div>
  );
};

export default AvailabilityListView;
