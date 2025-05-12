
import React, { useState } from 'react';
import { getHourLabels } from '../utils/dateUtils';
import WeekDayHeader from './WeekDayHeader';
import WeekViewEvent from './WeekViewEvent';
import { CalendarEvent } from '../context/calendarTypes';
import { calculateEventPosition } from './weekViewUtils';
import WeekAvailabilitySlots from './WeekAvailabilitySlots';
import { useStaffAvailability } from '@/hooks/useStaffAvailability';
import { AvailabilitySlot } from './weekViewUtils';

interface WeekTimeGridProps {
  days: Date[];
  events: CalendarEvent[];
  onEventEdit?: (event: CalendarEvent) => void;
  onEventDelete?: (event: CalendarEvent) => void;
}

const WeekTimeGrid: React.FC<WeekTimeGridProps> = ({
  days,
  events,
  onEventEdit,
  onEventDelete
}) => {
  const hourLabels = getHourLabels(7, 21); // 7am to 9pm
  const [selectedEvent, setSelectedEvent] = useState<string | null>(null);
  
  // Fetch availability data for all staff members
  const { availabilityByUser, loading } = useStaffAvailability();
  
  // Prepare availability slots for display
  const preparedAvailabilitySlots = React.useMemo(() => {
    const slots: AvailabilitySlot[] = [];
    
    if (!loading) {
      // Process each user's availability
      Object.entries(availabilityByUser).forEach(([userId, userData]) => {
        if (userData.slots && Array.isArray(userData.slots)) {
          userData.slots.forEach(slot => {
            if (typeof slot.dayOfWeek === 'number' && slot.startTime && slot.endTime) {
              // Convert time string to hours and minutes
              const [startHour, startMinute] = slot.startTime.split(':').map(Number);
              const [endHour, endMinute] = slot.endTime.split(':').map(Number);
              
              slots.push({
                userId,
                userName: userData.name || 'Staff',
                dayOfWeek: slot.dayOfWeek,
                startHour,
                startMinute,
                endHour,
                endMinute,
                category: slot.category || 'Session'
              });
            }
          });
        }
      });
    }
    
    return slots;
  }, [availabilityByUser, loading]);

  const handleSelectEvent = (event: CalendarEvent) => {
    setSelectedEvent(event.id ? event.id : null);
  };

  const handleEditEvent = () => {
    if (selectedEvent && onEventEdit) {
      const event = events.find(e => e.id === selectedEvent);
      if (event) {
        onEventEdit(event);
      }
    }
  };

  const handleDeleteEvent = () => {
    if (selectedEvent && onEventDelete) {
      const event = events.find(e => e.id === selectedEvent);
      if (event) {
        onDeleteEvent(event);
      }
    }
  };

  const handleAvailabilityClick = (slot: AvailabilitySlot) => {
    console.log('Availability slot clicked:', slot);
    // Future enhancement: Show slot details or allow editing
  };

  return (
    <div className="flex-1 overflow-auto">
      <div className="flex border-b">
        <div className="w-16 shrink-0"></div>
        <div className="flex-1 grid grid-cols-7">
          {days.map((day, index) => (
            <WeekDayHeader key={index} date={day} />
          ))}
        </div>
      </div>
      
      <div className="flex">
        <div className="w-16 shrink-0">
          {hourLabels.map((hour, index) => (
            <div key={index} className="h-15 border-b text-sm text-gray-500 text-center pt-2">
              {hour}
            </div>
          ))}
        </div>
        
        <div className="flex-1 grid grid-cols-7">
          {days.map((day, dayIndex) => (
            <div key={dayIndex} className="relative border-l min-h-[800px]">
              {hourLabels.map((_, hourIndex) => (
                <div key={hourIndex} className="h-15 border-b"></div>
              ))}
              
              {/* Show user availability slots first as a background layer */}
              <WeekAvailabilitySlots
                availabilitySlots={preparedAvailabilitySlots}
                dayIndex={day.getDay()}
                onAvailabilityClick={handleAvailabilityClick}
              />
              
              {/* Show events on top */}
              {events
                .filter(event => {
                  const eventDate = new Date(event.start);
                  return eventDate.toDateString() === day.toDateString();
                })
                .map((event) => {
                  const style = calculateEventPosition(event);
                  
                  return (
                    <WeekViewEvent
                      key={event.id}
                      event={event}
                      isSelected={selectedEvent === event.id}
                      onSelect={handleSelectEvent}
                      onEdit={handleEditEvent}
                      onDelete={handleDeleteEvent}
                      style={style}
                    />
                  );
                })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WeekTimeGrid;
