
import React, { useState, useEffect } from 'react';
import { CalendarEvent } from '../context/calendarTypes';
import { useCalendar } from '../context/CalendarContext';
import { startOfDay, endOfDay, format, addDays, subDays } from 'date-fns';
import DayHeader from '../day-view/DayHeader';
import TimeColumn from '../day-view/TimeColumn';
import HourCell from '../day-view/HourCell';
import CalendarEventComponent from '../day-view/CalendarEvent';
import AvailabilitySlot from '../day-view/AvailabilitySlot';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useStaffAvailability } from '@/hooks/useStaffAvailability';

interface DayViewComponentProps {
  onCreateEvent?: () => void;
  onEditEvent?: (event: CalendarEvent) => void;
  onDeleteEvent?: (event: CalendarEvent) => void;
}

export const DayViewComponent: React.FC<DayViewComponentProps> = ({
  onCreateEvent,
  onEditEvent,
  onDeleteEvent,
}) => {
  const { currentDate, events, setCurrentDate } = useCalendar();
  const [filteredEvents, setFilteredEvents] = useState<CalendarEvent[]>([]);
  const { availabilityByUser, loading } = useStaffAvailability();
  
  // For day-specific navigation
  const goToPreviousDay = () => {
    setCurrentDate(subDays(currentDate, 1));
  };
  
  const goToNextDay = () => {
    setCurrentDate(addDays(currentDate, 1));
  };
  
  useEffect(() => {
    // Filter events for current day
    const start = startOfDay(currentDate);
    const end = endOfDay(currentDate);
    
    const filtered = events.filter(event => {
      const eventStart = new Date(event.start);
      return eventStart >= start && eventStart <= end;
    });
    
    setFilteredEvents(filtered);
  }, [events, currentDate]);

  // Get availability slots for the current day
  const dayAvailabilitySlots = React.useMemo(() => {
    const dayOfWeek = currentDate.getDay(); // 0-6, 0 is Sunday
    const slots: { userId: string; userName: string; startHour: number; startMinute: number; endHour: number; endMinute: number; category?: string }[] = [];
    
    if (!loading) {
      Object.entries(availabilityByUser).forEach(([userId, userData]) => {
        if (userData.slots && Array.isArray(userData.slots)) {
          userData.slots
            .filter(slot => slot.dayOfWeek === dayOfWeek)
            .forEach(slot => {
              if (slot.startTime && slot.endTime) {
                const [startHour, startMinute] = slot.startTime.split(':').map(Number);
                const [endHour, endMinute] = slot.endTime.split(':').map(Number);
                
                slots.push({
                  userId,
                  userName: userData.name || 'Staff',
                  startHour,
                  startMinute,
                  endHour, 
                  endMinute,
                  category: slot.category
                });
              }
            });
        }
      });
    }
    
    return slots;
  }, [availabilityByUser, loading, currentDate]);

  // Generate hour cells for the day view
  const hours = Array.from({ length: 14 }, (_, i) => i + 7); // 7am to 8pm
  
  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between py-4 px-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={goToPreviousDay}>
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <h2 className="text-xl font-semibold">
            {format(currentDate, 'EEEE, MMMM d, yyyy')}
          </h2>
          <Button variant="ghost" size="icon" onClick={goToNextDay}>
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>
        {onCreateEvent && (
          <Button onClick={onCreateEvent}>
            Create Event
          </Button>
        )}
      </div>
      
      <div className="flex-1 overflow-y-auto">
        <div className="flex">
          <TimeColumn hours={hours} />
          
          <div className="flex-1">
            <DayHeader currentDate={currentDate} />
            
            <div className="relative">
              {hours.map(hour => (
                <HourCell 
                  key={hour} 
                  hour={hour} 
                  isAvailable={true}
                  onClick={() => onCreateEvent && onCreateEvent()}
                />
              ))}
              
              {/* Display availability slots */}
              {dayAvailabilitySlots.map((slot, index) => {
                const top = ((slot.startHour - 7) * 60) + slot.startMinute;
                const height = ((slot.endHour - slot.startHour) * 60) - slot.startMinute + slot.endMinute;
                
                return (
                  <AvailabilitySlot
                    key={`avail-${index}`}
                    top={top}
                    height={height}
                    userName={slot.userName}
                    category={slot.category}
                    startHour={slot.startHour}
                    startMinute={slot.startMinute}
                    endHour={slot.endHour}
                    endMinute={slot.endMinute}
                  />
                );
              })}
              
              {/* Display events */}
              {filteredEvents.map((event, index) => (
                <CalendarEventComponent
                  key={`event-${index}`}
                  event={event}
                  onEditClick={onEditEvent ? () => onEditEvent(event) : undefined}
                  onDeleteClick={onDeleteEvent ? () => onDeleteEvent(event) : undefined}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
