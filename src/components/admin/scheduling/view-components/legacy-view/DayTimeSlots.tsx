
import React from 'react';
import TimeSlotItem from './TimeSlotItem';
import { TimeSlot } from './types';
import { CalendarEvent } from '../../types';

interface DayTimeSlotsProps {
  slots: TimeSlot[];
  dayIndex: number;
  events: CalendarEvent[];
  onEditEvent?: (event: CalendarEvent) => void;
}

const DayTimeSlots: React.FC<DayTimeSlotsProps> = ({ slots, dayIndex, events, onEditEvent }) => {
  return (
    <div className="divide-y">
      {slots.length > 0 ? (
        slots.map((slot, slotIdx) => (
          <div key={`${dayIndex}-${slotIdx}`} className="grid grid-cols-[120px_1fr]">
            <div className="p-3 border-r font-medium text-muted-foreground">
              {slot.time}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 p-2">
              {slot.items.map((item, idx) => (
                <TimeSlotItem 
                  key={`${dayIndex}-${slotIdx}-${idx}`}
                  item={item}
                  slotTime={slot.time}
                  events={events}
                  onEditEvent={onEditEvent}
                />
              ))}
              
              {slot.items.length === 0 && (
                <div className="p-3 border border-dashed rounded text-center text-muted-foreground">
                  Open slot
                </div>
              )}
            </div>
          </div>
        ))
      ) : (
        <div className="p-4 text-center text-muted-foreground">
          No slots available for this day
        </div>
      )}
    </div>
  );
};

export default DayTimeSlots;
