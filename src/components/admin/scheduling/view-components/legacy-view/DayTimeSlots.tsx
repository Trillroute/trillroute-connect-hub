
import React from 'react';
import { TimeSlot } from './types';
import { CalendarEvent } from '../../types';
import TimeSlotItem from './TimeSlotItem';

interface DayTimeSlotsProps {
  timeSlots: TimeSlot[];
  events: CalendarEvent[];
  onEditEvent?: (event: CalendarEvent) => void;
  onCreateEvent?: () => void;
}

const DayTimeSlots: React.FC<DayTimeSlotsProps> = ({ 
  timeSlots, 
  events, 
  onEditEvent,
  onCreateEvent 
}) => {
  if (timeSlots.length === 0) {
    return (
      <div className="text-center text-gray-500 py-4">
        No time slots available
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {timeSlots.map((slot, slotIndex) => (
        <div key={slotIndex} className="mb-3">
          <div className="text-sm font-medium text-gray-600 mb-2">
            {slot.time}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
            {slot.items.map((item, itemIndex) => (
              <TimeSlotItem
                key={`${slotIndex}-${itemIndex}`}
                item={item}
                slotTime={slot.time}
                events={events}
                onEditEvent={onEditEvent}
                onCreateEvent={onCreateEvent}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default DayTimeSlots;
