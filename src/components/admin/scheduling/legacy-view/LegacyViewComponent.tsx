import React, { useMemo } from 'react';
import { useFilteredEvents } from '../hooks/useFilteredEvents';
import { useCalendar } from '../context/CalendarContext';
import { Loader2, ChevronDown } from 'lucide-react';
import { UserAvailability } from '../context/calendarTypes';

const LegacyViewComponent: React.FC = () => {
  // Directly use the calendar context for events and availabilities
  const { currentDate, events, availabilities } = useCalendar();
  
  // We'll still call useFilteredEvents to apply any filters, but we get data from context
  const { isLoading } = useFilteredEvents({
    filterType: null
  });
  
  // Get all time slots from events and availabilities
  const timeSlots = useMemo(() => {
    const slots = new Set<string>();
    
    // Add times from events
    events.forEach(event => {
      const hours = event.start.getHours();
      const minutes = event.start.getMinutes();
      const formattedTime = `${hours}:${minutes === 0 ? '00' : minutes}`;
      slots.add(formattedTime);
    });
    
    // Add times from availabilities
    Object.values(availabilities).forEach(userData => {
      userData.slots.forEach(slot => {
        const [hours, minutes] = slot.startTime.split(':');
        slots.add(`${parseInt(hours)}:${minutes}`);
      });
    });
    
    // If no slots found, add default time slots
    if (slots.size === 0) {
      ['9:00', '10:00', '11:00', '14:00', '15:00', '16:00'].forEach(time => slots.add(time));
    }
    
    // Sort time slots
    return Array.from(slots).sort((a, b) => {
      const [aHours, aMinutes] = a.split(':').map(Number);
      const [bHours, bMinutes] = b.split(':').map(Number);
      
      if (aHours !== bHours) return aHours - bHours;
      return aMinutes - bMinutes;
    });
  }, [events, availabilities]);
  
  // Get days of the week starting from current date
  const daysOfWeek = useMemo(() => {
    const days = [];
    const startDate = new Date(currentDate);
    
    // Start from Monday of current week
    const day = startDate.getDay();
    const diff = startDate.getDate() - day + (day === 0 ? -6 : 1);
    startDate.setDate(diff);
    
    for (let i = 0; i < 7; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      
      days.push({
        name: new Intl.DateTimeFormat('en-US', { weekday: 'long' }).format(date),
        date,
        dayOfWeek: i + 1 // 1-7 (Monday-Sunday)
      });
    }
    
    return days;
  }, [currentDate]);
  
  // Function to format time for display
  const formatTimeDisplay = (timeStr: string) => {
    const [hours, minutes] = timeStr.split(':').map(Number);
    const period = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours % 12 || 12;
    return `${displayHours}:${minutes === 0 ? '00' : minutes.toString().padStart(2, '0')} ${period}`;
  };

  // Function to get status and name for a cell
  const getCellInfo = (day: { name: string, date: Date, dayOfWeek: number }, timeSlot: string) => {
    // Check availabilities first
    const availabilityEntries = Object.entries(availabilities);
    for (const [userId, userData] of availabilityEntries) {
      const slot = userData.slots.find(s => 
        s.dayOfWeek === day.dayOfWeek && 
        s.startTime.startsWith(timeSlot)
      );
      
      if (slot) {
        return {
          name: userData.name,
          status: 'available',
          category: slot.category || 'Regular slot'
        };
      }
    }
    
    // Then check events
    const dayDate = new Date(day.date);
    const [hours, minutes] = timeSlot.split(':').map(Number);
    dayDate.setHours(hours, minutes, 0, 0);
    
    // Find events that overlap with this time slot
    const matchingEvents = events.filter(event => {
      const eventStartDate = new Date(event.start);
      const eventEndDate = new Date(event.end);
      
      // Check if day is the same
      const isSameDay = 
        eventStartDate.getDate() === dayDate.getDate() &&
        eventStartDate.getMonth() === dayDate.getMonth() &&
        eventStartDate.getFullYear() === dayDate.getFullYear();
        
      if (!isSameDay) return false;
      
      // Check if time overlaps
      const slotStart = new Date(dayDate);
      const slotEnd = new Date(slotStart);
      slotEnd.setHours(slotStart.getHours() + 1); // Assuming 1 hour slots
      
      return (
        (eventStartDate <= slotEnd && eventEndDate >= slotStart)
      );
    });
    
    if (matchingEvents.length > 0) {
      const event = matchingEvents[0]; // Take first matching event if multiple
      return {
        name: event.title,
        status: 'booked',
        description: event.description
      };
    }
    
    return null;
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="w-full overflow-auto">
      <table className="w-full min-w-[800px] border-collapse">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2 border text-left min-w-[100px]">Time slot</th>
            {timeSlots.map((slot, index) => (
              <th key={index} className="p-2 border text-center min-w-[120px]">
                <div className="flex items-center justify-center gap-2">
                  <ChevronDown className="h-4 w-4" />
                  {formatTimeDisplay(slot)}
                </div>
                <div className="text-xs text-gray-500">
                  Calendar view details
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {daysOfWeek.map((day, dayIndex) => (
            <tr key={dayIndex} className="border-b">
              <td className="p-2 border bg-gray-100">
                <div className="flex items-center gap-2">
                  <ChevronDown className="h-4 w-4" />
                  {day.name}
                </div>
                <div className="text-xs text-gray-500">
                  {/* Placeholder for number of events/slots */}
                  9
                </div>
              </td>
              
              {timeSlots.map((timeSlot, slotIndex) => {
                const cellInfo = getCellInfo(day, timeSlot);
                const isExpired = false; // Logic to determine if slot is expired
                
                const cellColorClass = cellInfo 
                  ? (isExpired ? 'bg-red-800' : 'bg-green-800')
                  : 'bg-gray-100';
                
                return (
                  <td 
                    key={`${dayIndex}-${slotIndex}`} 
                    className={`p-2 border ${cellColorClass} text-white`}
                  >
                    {cellInfo && (
                      <div className="p-2">
                        <div className="font-medium">{cellInfo.name}</div>
                        {isExpired && <div className="text-red-300">Expired</div>}
                        <div>{cellInfo.category || 'Regular slot'}</div>
                        <div className="mt-2">{formatTimeDisplay(timeSlot)}</div>
                      </div>
                    )}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default LegacyViewComponent;
