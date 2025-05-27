
import React from 'react';
import { Button } from '@/components/ui/button';
import { UserAvailability } from '@/services/availability/types';

interface TimeSlotCardProps {
  slot: UserAvailability;
  onChangeSlot: () => void;
}

export const TimeSlotCard: React.FC<TimeSlotCardProps> = ({ slot, onChangeSlot }) => {
  const getDayName = (dayOfWeek: number) => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return days[dayOfWeek];
  };
  
  const formatTime = (timeString: string) => {
    const [hours, minutes] = timeString.split(':').map(Number);
    const period = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = hours % 12 || 12;
    return `${formattedHours}:${minutes.toString().padStart(2, '0')} ${period}`;
  };

  return (
    <div className="p-3 bg-slate-50 rounded-md border">
      <p className="text-sm font-medium">Selected Time Slot</p>
      <p className="text-xs text-gray-600 mt-1">
        {getDayName(slot.dayOfWeek)}, {formatTime(slot.startTime)} - {formatTime(slot.endTime)}
      </p>
      <Button 
        variant="ghost" 
        size="sm" 
        className="text-xs mt-1 h-7 px-2" 
        onClick={onChangeSlot}
      >
        Change Slot
      </Button>
    </div>
  );
};
