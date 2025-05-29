
import React from 'react';
import { CalendarEvent } from '../context/calendarTypes';
import { AvailabilitySlot } from './weekViewUtils';
import WeekViewEvent from './WeekViewEvent';
import WeekAvailabilitySlots from './WeekAvailabilitySlots';

interface WeekTimeGridProps {
  hours: number[];
  weekDays: Date[];
  events: CalendarEvent[];
  availabilitySlots: AvailabilitySlot[];
  selectedEvent: CalendarEvent | null;
  openEventActions: (event: CalendarEvent) => void;
  handleCellClick: (dayIndex: number, hour: number) => void;
  handleAvailabilityClick: (slot: AvailabilitySlot) => void;
  handleEdit: (event: CalendarEvent) => void;
  confirmDelete: (event: CalendarEvent) => void;
}

const WeekTimeGrid: React.FC<WeekTimeGridProps> = ({
  hours,
  weekDays,
  events,
  availabilitySlots,
  selectedEvent,
  openEventActions,
  handleCellClick,
  handleAvailabilityClick,
  handleEdit,
  confirmDelete
}) => {
  console.log('WeekTimeGrid: Processing filtered events for display:', events.length);
  console.log('WeekTimeGrid: Week range:', {
    start: weekDays[0]?.toISOString(),
    end: weekDays[6]?.toISOString()
  });
  
  // Filter events that fall within the current week with more lenient date checking
  const weekEvents = events.filter(event => {
    if (!event.start || !(event.start instanceof Date) || isNaN(event.start.getTime())) {
      console.warn('WeekTimeGrid: Invalid event start date:', event);
      return false;
    }
    
    const eventDate = new Date(event.start);
    const weekStart = new Date(weekDays[0]);
    const weekEnd = new Date(weekDays[6]);
    
    // Set time boundaries more inclusively
    weekStart.setHours(0, 0, 0, 0);
    weekEnd.setHours(23, 59, 59, 999);
    
    const isInWeek = eventDate >= weekStart && eventDate <= weekEnd;
    
    console.log('WeekTimeGrid: Event date check:', {
      eventTitle: event.title,
      eventDate: eventDate.toISOString(),
      eventDateOnly: eventDate.toDateString(),
      weekStart: weekStart.toISOString(),
      weekEnd: weekEnd.toISOString(),
      isInWeek
    });
    
    return isInWeek;
  });
  
  console.log('WeekTimeGrid: Filtered week events after date filtering:', weekEvents.length);
  weekEvents.forEach((event, index) => {
    console.log(`WeekTimeGrid: Week event ${index + 1}:`, {
      title: event.title,
      start: event.start,
      dayOfWeek: event.start instanceof Date ? event.start.getDay() : 'invalid'
    });
  });

  return (
    <div className="grid grid-cols-8 h-full">
      {/* Time column */}
      <div className="border-r">
        {hours.map(hour => (
          <div key={hour} className="h-16 border-b text-xs p-1 text-gray-500">
            {hour === 0 ? '12:00 AM' : hour < 12 ? `${hour}:00 AM` : hour === 12 ? '12:00 PM' : `${hour - 12}:00 PM`}
          </div>
        ))}
      </div>
      
      {/* Day columns */}
      {weekDays.map((day, dayIndex) => (
        <div key={dayIndex} className="border-r relative">
          {/* Hour cells */}
          {hours.map(hour => {
            // Find events for this specific day and hour
            const eventsForThisSlot = weekEvents.filter(event => {
              if (!(event.start instanceof Date)) return false;
              
              const eventDate = new Date(event.start);
              const currentDay = new Date(day);
              
              // Check if it's the same day (more robust comparison)
              const eventDateStr = eventDate.toDateString();
              const currentDayStr = currentDay.toDateString();
              const isSameDay = eventDateStr === currentDayStr;
              
              // Check if the event hour overlaps with the current hour slot
              const eventHour = eventDate.getHours();
              const eventMinute = eventDate.getMinutes();
              
              // Event overlaps with this hour slot if it starts during this hour
              // or if it's a multi-hour event that spans this hour
              const eventStartsInThisHour = eventHour === hour;
              
              // For longer events, check if this hour falls within the event duration
              const eventEnd = event.end instanceof Date ? event.end : eventDate;
              const eventEndHour = eventEnd.getHours();
              const eventSpansThisHour = eventHour <= hour && hour < eventEndHour;
              
              const hourMatches = eventStartsInThisHour || eventSpansThisHour;
              
              const matches = isSameDay && hourMatches;
              
              if (matches) {
                console.log(`WeekTimeGrid: Found matching filtered event "${event.title}" for day ${dayIndex} (${currentDayStr}) hour ${hour}`);
              }
              
              return matches;
            });

            return (
              <div
                key={hour}
                className="h-16 border-b cursor-pointer hover:bg-gray-50 relative"
                onClick={() => handleCellClick(dayIndex, hour)}
              >
                {/* Events for this time slot */}
                {eventsForThisSlot.map(event => (
                  <WeekViewEvent
                    key={event.id}
                    event={event}
                    isSelected={selectedEvent?.id === event.id}
                    onSelect={() => openEventActions(event)}
                    onEdit={() => handleEdit(event)}
                    onDelete={() => confirmDelete(event)}
                    style={{
                      position: 'absolute',
                      top: '2px',
                      left: '2px',
                      right: '2px',
                      bottom: '2px'
                    }}
                  />
                ))}
              </div>
            );
          })}
          
          {/* Availability slots */}
          <WeekAvailabilitySlots
            dayIndex={dayIndex}
            availabilitySlots={availabilitySlots.filter(slot => slot.dayOfWeek === dayIndex)}
            onAvailabilityClick={handleAvailabilityClick}
          />
        </div>
      ))}
    </div>
  );
};

export default WeekTimeGrid;
