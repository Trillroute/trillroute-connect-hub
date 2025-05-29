
import React from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DayInfo, TimeSlot } from './types';
import { CalendarEvent } from '../../types';
import DayTimeSlots from './DayTimeSlots';
import DayStatusBadges from './DayStatusBadges';

interface DayRowProps {
  day: DayInfo;
  timeSlotsByDay: Record<number, TimeSlot[]>;
  expandedDays: number[];
  toggleDay: (dayIndex: number) => void;
  events: CalendarEvent[];
  onEditEvent?: (event: CalendarEvent) => void;
  onCreateEvent?: () => void;
}

const DayRow: React.FC<DayRowProps> = ({
  day,
  timeSlotsByDay,
  expandedDays,
  toggleDay,
  events,
  onEditEvent,
  onCreateEvent
}) => {
  const isExpanded = expandedDays.includes(day.index);
  const daySlots = timeSlotsByDay[day.index] || [];

  return (
    <div className="border-b">
      <div className="grid grid-cols-[120px_1fr] min-h-[60px]">
        <div className="border-r p-3 flex items-center justify-between bg-gray-50/50">
          <span className="font-medium">{day.name}</span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => toggleDay(day.index)}
            className="p-1 h-auto"
          >
            {isExpanded ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </Button>
        </div>
        
        <div className="p-3">
          {isExpanded ? (
            <DayTimeSlots 
              timeSlots={daySlots} 
              events={events}
              onEditEvent={onEditEvent}
              onCreateEvent={onCreateEvent}
            />
          ) : (
            <DayStatusBadges timeSlots={daySlots} />
          )}
        </div>
      </div>
    </div>
  );
};

export default DayRow;
