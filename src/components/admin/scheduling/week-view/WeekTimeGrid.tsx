
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
  
  // Filter events that fall within the current week
  const weekEvents = events.filter(event => {
    if (!event.start || !(event.start instanceof Date) || isNaN(event.start.getTime())) {
      console.warn('WeekTimeGrid: Invalid event start date:', event);
      return false;
    }
    
    const eventDate = new Date(event.start);
    const weekStart = new Date(weekDays[0]);
    const weekEnd = new Date(weekDays[6]);
    weekEnd.setHours(23, 59, 59, 999);
    
    const isInWeek = eventDate >= weekStart && eventDate <= weekEnd;
    console.log('WeekTimeGrid: Event', event.title, 'is in week:', isInWeek, {
      eventDate: eventDate.toISOString(),
      weekStart: weekStart.toISOString(),
      weekEnd: weekEnd.toISOString()
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
            >
              {/* Events for this time slot */}
              {weekEvents
                .filter(event => {
                  if (!(event.start instanceof Date)) return false;
                  const eventDay = event.start.getDay();
                  const eventHour = event.start.getHours();
                  const matches = eventDay === day.getDay() && eventHour === hour;
                  if (matches) {
                    console.log(`WeekTimeGrid: Event "${event.title}" matches day ${eventDay} hour ${eventHour}`);
                  }
                  return matches;
                })
                .map(event => (
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
                ))
              }
            </div>
          ))}
          
          {/* Availability slots */}
          <WeekAvailabilitySlots
            dayIndex={dayIndex}
            availabilitySlots={availabilitySlots.filter(slot => slot.dayOfWeek === day.getDay())}
            onAvailabilityClick={handleAvailabilityClick}
          />
        </div>
      ))}
    </div>
  );
};

export default WeekTimeGrid;
