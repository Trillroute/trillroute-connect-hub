
import React from 'react';
import { DayAvailability } from '@/hooks/useUserAvailability';
import DayAvailabilityList from './DayAvailabilityList';

interface AvailabilityListViewProps {
  dailyAvailability: DayAvailability[];
  onAddSlot: (dayOfWeek: number, startTime: string, endTime: string, category: string) => Promise<boolean>;
  onUpdateSlot: (id: string, startTime: string, endTime: string, category: string) => Promise<boolean>;
  onDeleteSlot: (id: string) => Promise<boolean>;
}

const AvailabilityListView: React.FC<AvailabilityListViewProps> = ({
  dailyAvailability,
  onAddSlot,
  onUpdateSlot,
  onDeleteSlot
}) => {
  return (
    <div className="space-y-6">
      {dailyAvailability.map((day) => (
        <DayAvailabilityList
          key={day.dayOfWeek}
          day={day}
          onAddSlot={onAddSlot}
          onUpdateSlot={onUpdateSlot}
          onDeleteSlot={onDeleteSlot}
        />
      ))}
    </div>
  );
};

export default AvailabilityListView;
