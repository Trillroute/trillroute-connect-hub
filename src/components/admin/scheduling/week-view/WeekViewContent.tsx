
import React from 'react';
import { isSameDay } from 'date-fns';
import { CalendarEvent } from '../context/calendarTypes';
import WeekTimeGrid from './WeekTimeGrid';
import WeekViewEvent from './WeekViewEvent';
import WeekAvailabilitySlots from './WeekAvailabilitySlots';
import { AvailabilitySlot, calculateEventPosition, isTimeAvailable } from './weekViewUtils';

interface WeekViewContentProps {
  hours: number[];
  weekDays: Date[];
  events: CalendarEvent[];
  availabilitySlots: AvailabilitySlot[];
  selectedEvent: CalendarEvent | null;
  openEventActions: (event: CalendarEvent) => void;
  handleCellClick: (dayIndex: number, hour: number) => void;
  handleAvailabilityClick: (slot: AvailabilitySlot) => void;
  handleEdit: () => void;
  confirmDelete: () => void;
}

const WeekViewContent: React.FC<WeekViewContentProps> = ({
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
  // Getting events for each day
  const getEventsForDay = (date: Date) => {
    return events.filter(event => isSameDay(event.start, date));
  };

  // Get availability class for a cell
  const getAvailabilityClass = (dayIndex: number, hour: number) => {
    const isAvailable = isTimeAvailable(hour, dayIndex, availabilitySlots);
    const isToday = isSameDay(weekDays[dayIndex], new Date());
    
    if (isAvailable) {
      return `cursor-pointer hover:bg-blue-50 ${isToday ? 'bg-blue-50/50' : ''}`;
    } else {
      return 'bg-gray-100 cursor-not-allowed';
    }
  };

  return (
    <>
      {/* Time grid with events */}
      <WeekTimeGrid
        hours={hours}
        weekDays={weekDays}
        onCellClick={handleCellClick}
        getAvailabilityClass={getAvailabilityClass}
      />
      
      {/* Day columns with events and availability slots */}
      <div className="absolute top-0 left-16 right-0 bottom-0">
        {weekDays.map((day, dayIndex) => (
          <div 
            key={dayIndex} 
            className="absolute top-0 bottom-0"
            style={{
              left: `${(dayIndex * 100) / weekDays.length}%`,
              width: `${100 / weekDays.length}%`
            }}
          >
            {/* Availability slots */}
            <WeekAvailabilitySlots
              availabilitySlots={availabilitySlots}
              dayIndex={dayIndex}
              onAvailabilityClick={handleAvailabilityClick}
            />
            
            {/* Events */}
            {getEventsForDay(day).map((event, eventIndex) => (
              <WeekViewEvent
                key={`${eventIndex}-${event.id}`}
                event={event}
                isSelected={selectedEvent?.id === event.id}
                onSelect={openEventActions}
                onEdit={handleEdit}
                onDelete={confirmDelete}
                style={calculateEventPosition(event)}
              />
            ))}
          </div>
        ))}
      </div>
    </>
  );
};

export default WeekViewContent;
