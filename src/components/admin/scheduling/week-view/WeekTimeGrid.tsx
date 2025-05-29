
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
  console.log('WeekTimeGrid: Processing events for display:', events.length);
  console.log('WeekTimeGrid: Week range:', {
    start: weekDays[0]?.toISOString(),
    end: weekDays[6]?.toISOString()
  });
  
  // Filter events that fall within the current week with improved date checking
  const weekEvents = events.filter(event => {
    if (!event.start || !(event.start instanceof Date) || isNaN(event.start.getTime())) {
      console.warn('WeekTimeGrid: Invalid event start date:', event);
      return false;
    }
    
    const eventDate = new Date(event.start);
    const weekStart = new Date(weekDays[0]);
    const weekEnd = new Date(weekDays[6]);
    
    // Set time boundaries more inclusively - entire day coverage
    weekStart.setHours(0, 0, 0, 0);
    weekEnd.setHours(23, 59, 59, 999);
    
    // More lenient date comparison - check if event falls within the week
    const eventDay = new Date(eventDate);
    eventDay.setHours(0, 0, 0, 0);
    
    const isInWeek = eventDay >= weekStart && eventDay <= weekEnd;
    
    console.log('WeekTimeGrid: Event date check:', {
      eventTitle: event.title,
      eventDate: eventDate.toISOString(),
      eventDay: eventDay.toISOString(),
      weekStart: weekStart.toISOString(),
      weekEnd: weekEnd.toISOString(),
      isInWeek
    });
    
    return isInWeek;
  });
  
  console.log('WeekTimeGrid: Filtered week events:', weekEvents.length);
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
          {hours.map(hour => (
            <div
              key={hour}
              className="h-16 border-b cursor-pointer hover:bg-gray-50 relative"
              onClick={() => handleCellClick(dayIndex, hour)}
            />
          ))}
          
          {/* Availability slots - rendered first so they appear behind events */}
          <WeekAvailabilitySlots
            dayIndex={dayIndex}
            availabilitySlots={availabilitySlots.filter(slot => slot.dayOfWeek === dayIndex)}
            onAvailabilityClick={handleAvailabilityClick}
          />
          
          {/* Events - rendered last so they appear on top */}
          {weekEvents
            .filter(event => {
              if (!(event.start instanceof Date)) return false;
              
              const eventDate = new Date(event.start);
              const currentDay = new Date(day);
              
              // Compare dates more reliably - check year, month, and day
              const eventYear = eventDate.getFullYear();
              const eventMonth = eventDate.getMonth();
              const eventDay = eventDate.getDate();
              
              const currentYear = currentDay.getFullYear();
              const currentMonth = currentDay.getMonth();
              const currentDayOfMonth = currentDay.getDate();
              
              const isSameDay = eventYear === currentYear && 
                              eventMonth === currentMonth && 
                              eventDay === currentDayOfMonth;
              
              console.log(`WeekTimeGrid: Day ${dayIndex} event check:`, {
                eventTitle: event.title,
                eventDate: `${eventYear}-${eventMonth + 1}-${eventDay}`,
                currentDate: `${currentYear}-${currentMonth + 1}-${currentDayOfMonth}`,
                isSameDay
              });
              
              return isSameDay;
            })
            .map(event => {
              const eventDate = new Date(event.start);
              const eventEndDate = event.end instanceof Date ? event.end : eventDate;
              
              // Calculate position
              const startHour = eventDate.getHours();
              const startMinute = eventDate.getMinutes();
              const endHour = eventEndDate.getHours();
              const endMinute = eventEndDate.getMinutes();
              
              // Calculate minutes from 7 AM (grid start)
              const gridStartHour = 7;
              const hourCellHeight = 64; // h-16 = 64px
              
              const startMinutesFromGridStart = ((startHour - gridStartHour) * 60) + startMinute;
              const endMinutesFromGridStart = ((endHour - gridStartHour) * 60) + endMinute;
              const durationMinutes = endMinutesFromGridStart - startMinutesFromGridStart;
              
              // Convert to pixels
              const pixelsPerMinute = hourCellHeight / 60;
              const topOffset = Math.max(0, startMinutesFromGridStart * pixelsPerMinute);
              const height = Math.max(durationMinutes * pixelsPerMinute, 20);
              
              // Show all events regardless of hour range for debugging
              console.log(`WeekTimeGrid: Rendering event ${event.title} at hour ${startHour}:${startMinute}`);
              
              return (
                <WeekViewEvent
                  key={event.id}
                  event={event}
                  isSelected={selectedEvent?.id === event.id}
                  onSelect={() => openEventActions(event)}
                  onEdit={() => handleEdit(event)}
                  onDelete={() => confirmDelete(event)}
                  style={{
                    position: 'absolute',
                    top: `${topOffset}px`,
                    height: `${height}px`,
                    left: '4px',
                    right: '4px',
                    zIndex: 30, // Higher z-index than availability slots
                  }}
                />
              );
            })}
        </div>
      ))}
    </div>
  );
};

export default WeekTimeGrid;
