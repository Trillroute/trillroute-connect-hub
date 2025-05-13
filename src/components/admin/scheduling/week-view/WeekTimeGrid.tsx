
import React, { useMemo, useCallback } from 'react';
import { format, isSameDay } from 'date-fns';
import { getHourCells } from '../calendarUtils';
import { CalendarEvent } from '../context/calendarTypes';
import WeekDayHeader from './WeekDayHeader';
import { useCalendar } from '../context/CalendarContext';
import HourCell from '../day-view/HourCell';
import CalendarEventComponent from '../day-view/CalendarEvent';
import AvailabilitySlotItem from './AvailabilitySlot';
import { AvailabilitySlot, isTimeAvailable, getCategoryColor } from './weekViewUtils';

interface WeekTimeGridProps {
  days: Date[];
  onCreateEvent?: () => void;
  onEditEvent?: (event: CalendarEvent) => void;
  onDeleteEvent?: (event: CalendarEvent) => void;
}

const WeekTimeGrid: React.FC<WeekTimeGridProps> = ({ 
  days, 
  onCreateEvent, 
  onEditEvent,
  onDeleteEvent 
}) => {
  const { currentDate, events, availabilities } = useCalendar();
  const hours = useMemo(() => getHourCells(), []);
  
  // Process availability slots for the week - memoized for performance
  const weekAvailabilitySlots = useMemo(() => {
    if (!availabilities || Object.keys(availabilities).length === 0) {
      return [];
    }
    
    const slots: AvailabilitySlot[] = [];
    
    try {
      // Process all staff availabilities
      Object.entries(availabilities).forEach(([userId, userData]) => {
        if (!userData || !userData.slots || !Array.isArray(userData.slots)) {
          return;
        }
        
        userData.slots.forEach(slot => {
          if (slot.dayOfWeek === undefined || !slot.startTime || !slot.endTime) {
            return;
          }
          
          try {
            const [startHour, startMinute] = slot.startTime.split(':').map(Number);
            const [endHour, endMinute] = slot.endTime.split(':').map(Number);
            
            slots.push({
              dayOfWeek: slot.dayOfWeek,
              startHour,
              startMinute: startMinute || 0,
              endHour,
              endMinute: endMinute || 0,
              userId,
              userName: userData.name || 'Staff',
              category: slot.category || 'Session'
            });
          } catch (err) {
            console.error("Error processing time slot:", err);
          }
        });
      });
    } catch (err) {
      console.error("Error processing availability data:", err);
    }
    
    return slots;
  }, [availabilities]);
  
  // Handle availability slot click - memoized
  const handleAvailabilityClick = useCallback((slot: AvailabilitySlot) => {
    if (onCreateEvent) {
      sessionStorage.setItem('selectedAvailability', JSON.stringify(slot));
      onCreateEvent();
    }
  }, [onCreateEvent]);

  // Filter events to only show those that are valid - memoized
  const validEvents = useMemo(() => {
    return events.filter(event => {
      if (!event || !event.start || !event.end) {
        return false;
      }
      return true;
    });
  }, [events]);

  // Optimize event filtering per day
  const eventsByDay = useMemo(() => {
    const eventMap = new Map<string, CalendarEvent[]>();
    
    days.forEach(day => {
      const dayEvents = validEvents.filter(event => {
        const eventStart = new Date(event.start);
        return isSameDay(eventStart, day);
      });
      
      eventMap.set(day.toISOString(), dayEvents);
    });
    
    return eventMap;
  }, [validEvents, days]);

  return (
    <div className="flex flex-col h-full overflow-auto">
      {/* Day headers - already in parent component */}
      
      {/* Time grid */}
      <div className="flex flex-1 overflow-y-auto">
        {/* Hour labels */}
        <div className="w-16 flex-shrink-0">
          {hours.map(hour => (
            <div 
              key={hour} 
              className="h-15 border-b border-gray-200 flex items-center justify-center text-sm text-gray-500"
              style={{ height: '60px' }}
            >
              {hour}:00
            </div>
          ))}
        </div>
        
        {/* Day columns */}
        {days.map((day, dayIndex) => (
          <div key={dayIndex} className="flex-1 border-r border-gray-200 relative">
            {/* Hour cells */}
            {hours.map((hour) => (
              <div 
                key={hour}
                className={`border-b border-gray-200 ${
                  isTimeAvailable(hour, day.getDay(), weekAvailabilitySlots) 
                    ? 'bg-green-50/20' 
                    : ''
                }`}
                style={{ height: '60px' }}
                onClick={() => {
                  if (onCreateEvent && isTimeAvailable(hour, day.getDay(), weekAvailabilitySlots)) {
                    onCreateEvent();
                  }
                }}
              ></div>
            ))}
            
            {/* Availability slots */}
            {weekAvailabilitySlots
              .filter(slot => slot.dayOfWeek === day.getDay())
              .map((slot, slotIndex) => (
                <AvailabilitySlotItem
                  key={`slot-${dayIndex}-${slotIndex}-${slot.userId}`}
                  slot={slot}
                  slotIndex={slotIndex}
                  dayIndex={dayIndex}
                  onClick={handleAvailabilityClick}
                />
              ))}
            
            {/* Events */}
            {eventsByDay.get(day.toISOString())?.map((event, eventIndex) => (
              <CalendarEventComponent
                key={`event-${event.id}-${eventIndex}`}
                event={event}
                onEditClick={() => onEditEvent && onEditEvent(event)}
                onDeleteClick={() => onDeleteEvent && onDeleteEvent(event)}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default WeekTimeGrid;
