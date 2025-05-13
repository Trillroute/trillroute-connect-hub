
import React, { useMemo } from 'react';
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
  const hours = getHourCells();
  
  // Improved logging for debugging
  console.log("WeekTimeGrid rendering with:", {
    eventCount: events?.length || 0,
    availabilitiesCount: Object.keys(availabilities || {}).length,
    daysCount: days?.length || 0
  });
  
  // Processing availability slots for the week with improved error handling
  const weekAvailabilitySlots = useMemo(() => {
    if (!availabilities || Object.keys(availabilities).length === 0) {
      console.log("No availability data to process");
      return [];
    }
    
    const slots: AvailabilitySlot[] = [];
    
    try {
      // Process all staff availabilities
      Object.entries(availabilities).forEach(([userId, userData]) => {
        if (!userData) {
          console.warn(`Invalid userData for userId ${userId}`);
          return;
        }
        
        if (!userData.slots || !Array.isArray(userData.slots) || userData.slots.length === 0) {
          console.log(`No slots for user ${userId} (${userData.name || 'unknown'})`);
          return;
        }
        
        userData.slots.forEach(slot => {
          if (slot.dayOfWeek === undefined || !slot.startTime || !slot.endTime) {
            console.warn("Invalid slot data", slot);
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
            console.error("Error processing time slot:", err, slot);
          }
        });
      });
      
      console.log(`Processed ${slots.length} availability slots`);
    } catch (err) {
      console.error("Error processing availability data:", err);
    }
    
    return slots;
  }, [availabilities]);
  
  // Handle availability slot click
  const handleAvailabilityClick = (slot: AvailabilitySlot) => {
    if (onCreateEvent) {
      console.log("Availability slot clicked:", slot);
      sessionStorage.setItem('selectedAvailability', JSON.stringify(slot));
      onCreateEvent();
    }
  };

  return (
    <div className="flex flex-col h-full overflow-auto">
      {/* Day headers */}
      <div className="flex">
        <div className="w-16 flex-shrink-0 border-b border-gray-200 h-12 bg-white"></div>
        {days.map((day, index) => (
          <WeekDayHeader 
            key={index} 
            day={day} 
            currentDate={currentDate} 
          />
        ))}
      </div>
      
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
                  key={`slot-${dayIndex}-${slotIndex}`}
                  slot={slot}
                  slotIndex={slotIndex}
                  dayIndex={dayIndex}
                  onClick={handleAvailabilityClick}
                />
              ))}
            
            {/* Events */}
            {events
              .filter(event => {
                if (!event || !event.start) return false;
                
                const eventStart = event.start instanceof Date ? 
                  event.start : 
                  new Date(event.start);
                  
                return isSameDay(eventStart, day);
              })
              .map((event, eventIndex) => (
                <CalendarEventComponent
                  key={`event-${dayIndex}-${eventIndex}`}
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
