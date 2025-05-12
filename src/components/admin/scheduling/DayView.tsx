
import React, { useEffect, useState } from 'react';
import { useCalendar } from './context/CalendarContext';
import { getHourCells } from './calendarUtils';
import { CalendarEvent } from './context/calendarTypes';
import TimeColumn from './day-view/TimeColumn';
import HourCell from './day-view/HourCell';
import DayHeader from './day-view/DayHeader';
import CalendarEventComponent from './day-view/CalendarEvent';
import AvailabilitySlot from './day-view/AvailabilitySlot';
import { processAvailabilities, filterTodayEvents, isTimeAvailable } from './day-view/dayViewUtils';

interface DayViewProps {
  onCreateEvent?: () => void;
  onEditEvent?: (event: CalendarEvent) => void;
  onDeleteEvent?: (event: CalendarEvent) => void;
}

interface AvailabilitySlotType {
  startHour: number;
  startMinute: number;
  endHour: number;
  endMinute: number;
  userId: string;
  userName?: string;
  category: string;
}

const DayView: React.FC<DayViewProps> = ({ onCreateEvent, onEditEvent, onDeleteEvent }) => {
  const { currentDate, events, availabilities } = useCalendar();
  const hours = getHourCells();
  const [availabilitySlots, setAvailabilitySlots] = useState<AvailabilitySlotType[]>([]);
  
  // Process availability data for the current day
  useEffect(() => {
    const slots = processAvailabilities(currentDate, availabilities);
    setAvailabilitySlots(slots);
  }, [currentDate, availabilities]);
  
  // Filter events for the current day
  const todayEvents = filterTodayEvents(events, currentDate);
  
  const handleCellClick = (hour: number) => {
    if (onCreateEvent && isTimeAvailable(availabilitySlots, hour)) {
      onCreateEvent();
    }
  };
  
  const handleAvailabilityClick = (slot: AvailabilitySlotType) => {
    if (onCreateEvent) {
      // Store slot data in session storage for the create event dialog to use
      sessionStorage.setItem('availabilitySlot', JSON.stringify(slot));
      onCreateEvent();
    }
  };
  
  const handleEditClick = (event: CalendarEvent) => {
    if (onEditEvent) {
      onEditEvent(event);
    }
  };
  
  const handleDeleteClick = (event: CalendarEvent) => {
    if (onDeleteEvent) {
      onDeleteEvent(event);
    }
  };

  return (
    <div className="flex h-full">
      {/* Time column */}
      <TimeColumn hours={hours} />
      
      {/* Day column */}
      <div className="flex-1 relative">
        {/* Date header */}
        <DayHeader currentDate={currentDate} />

        {/* Hour cells */}
        <div className="relative">
          {hours.map(hour => (
            <HourCell 
              key={hour} 
              hour={hour} 
              isAvailable={isTimeAvailable(availabilitySlots, hour)}
              onClick={() => handleCellClick(hour)} 
            />
          ))}
          
          {/* Availability slots */}
          <div className="absolute top-0 left-0 right-0">
            {availabilitySlots.map((slot, index) => (
              <AvailabilitySlot
                key={`availability-${index}`}
                top={((slot.startHour - 7) * 60) + slot.startMinute}
                height={((slot.endHour - slot.startHour) * 60) - slot.startMinute + slot.endMinute}
                userName={slot.userName || ''}
                category={slot.category}
                startHour={slot.startHour}
                startMinute={slot.startMinute}
                endHour={slot.endHour}
                endMinute={slot.endMinute}
              />
            ))}
          </div>
          
          {/* Events */}
          <div className="absolute top-0 left-0 right-0">
            {todayEvents.map((event, eventIndex) => (
              <CalendarEventComponent 
                key={eventIndex}
                event={event}
                onEditClick={() => handleEditClick(event)}
                onDeleteClick={() => handleDeleteClick(event)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DayView;
