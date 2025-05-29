
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
  availabilitySlots?: Array<{
    startHour: number;
    startMinute: number;
    endHour: number;
    endMinute: number;
    userId: string;
    userName?: string;
    category: string;
  }>;
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

const DayView: React.FC<DayViewProps> = ({ 
  onCreateEvent, 
  onEditEvent, 
  onDeleteEvent,
  availabilitySlots: propAvailabilitySlots 
}) => {
  const { currentDate, events, availabilities } = useCalendar();
  const hours = getHourCells();
  const [availabilitySlots, setAvailabilitySlots] = useState<AvailabilitySlotType[]>([]);
  
  // Process availability data for the current day
  useEffect(() => {
    console.log("DayView: Processing availabilities for day view, data:", 
      { date: currentDate.toDateString(), availabilitiesCount: Object.keys(availabilities || {}).length });
    
    // Use prop availability slots if provided, otherwise process them from context
    if (propAvailabilitySlots) {
      setAvailabilitySlots(propAvailabilitySlots);
    } else {
      const slots = processAvailabilities(currentDate, availabilities);
      console.log(`DayView: Processed ${slots.length} availability slots for day ${currentDate.toDateString()}`);
      setAvailabilitySlots(slots);
    }
  }, [currentDate, availabilities, propAvailabilitySlots]);
  
  // Filter events for the current day with improved date comparison
  const todayEvents = events.filter(event => {
    if (!event.start || !(event.start instanceof Date) || isNaN(event.start.getTime())) {
      console.warn('DayView: Invalid event start date:', event);
      return false;
    }
    
    const eventDate = new Date(event.start);
    const currentDay = new Date(currentDate);
    
    // Compare dates using year, month, and day
    const isSameDay = eventDate.getFullYear() === currentDay.getFullYear() &&
                     eventDate.getMonth() === currentDay.getMonth() &&
                     eventDate.getDate() === currentDay.getDate();
    
    console.log('DayView: Event date check:', {
      eventTitle: event.title,
      eventDate: eventDate.toDateString(),
      currentDay: currentDay.toDateString(),
      isSameDay
    });
    
    return isSameDay;
  });
  
  console.log(`DayView: Displaying ${todayEvents.length} events for day ${currentDate.toDateString()}`);
  console.log('DayView: Today events titles:', todayEvents.map(e => e.title));
  
  const handleCellClick = (hour: number) => {
    if (onCreateEvent) {
      // Store hour in session storage for event creation dialog
      const newEventDate = new Date(currentDate);
      newEventDate.setHours(hour, 0, 0, 0);
      sessionStorage.setItem('newEventStartTime', newEventDate.toISOString());
      
      onCreateEvent();
    }
  };
  
  const handleAvailabilityClick = (slot: AvailabilitySlotType) => {
    if (onCreateEvent) {
      // Store slot data in session storage for the create event dialog to use
      const newEventDate = new Date(currentDate);
      newEventDate.setHours(slot.startHour, slot.startMinute, 0, 0);
      
      const endDate = new Date(currentDate);
      endDate.setHours(slot.endHour, slot.endMinute, 0, 0);
      
      sessionStorage.setItem('newEventStartTime', newEventDate.toISOString());
      sessionStorage.setItem('newEventEndTime', endDate.toISOString());
      sessionStorage.setItem('newEventTitle', `Session with ${slot.userName || 'Instructor'}`);
      
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
              onClick={handleCellClick} 
            />
          ))}
          
          {/* Availability slots */}
          <div className="absolute top-0 left-0 right-0">
            {availabilitySlots.map((slot, index) => (
              <AvailabilitySlot 
                key={`availability-${index}`} 
                slot={slot} 
                onClick={handleAvailabilityClick} 
              />
            ))}
          </div>
          
          {/* Events */}
          <div className="absolute top-0 left-0 right-0">
            {todayEvents.map((event, eventIndex) => (
              <CalendarEventComponent 
                key={`event-${eventIndex}-${event.id}`}
                event={event}
                onEditClick={handleEditClick}
                onDeleteClick={handleDeleteClick}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DayView;
