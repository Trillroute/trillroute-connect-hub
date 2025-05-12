
import React, { useEffect, useState } from 'react';
import { format, isSameDay } from 'date-fns';
import { useCalendar } from './context/CalendarContext';
import { getHourCells } from './calendarUtils';
import { CalendarEvent } from './context/calendarTypes';
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from 'lucide-react';
import { UserAvailability } from '@/services/availability/types';

interface DayViewProps {
  onCreateEvent?: () => void;
  onEditEvent?: (event: CalendarEvent) => void;
  onDeleteEvent?: (event: CalendarEvent) => void;
}

interface AvailabilitySlot {
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
  const [availabilitySlots, setAvailabilitySlots] = useState<AvailabilitySlot[]>([]);
  
  // Process availability data for the current day
  useEffect(() => {
    const processAvailabilities = () => {
      // Get day of week (0 = Sunday, 1 = Monday, etc.)
      const dayOfWeek = currentDate.getDay();
      const processedSlots: AvailabilitySlot[] = [];
      
      // Process all user availabilities
      Object.entries(availabilities).forEach(([userId, userData]) => {
        // Filter slots for current day of week
        const userSlots = userData.slots.filter(slot => slot.dayOfWeek === dayOfWeek);
        
        userSlots.forEach(slot => {
          const [startHour, startMinute] = slot.startTime.split(':').map(Number);
          const [endHour, endMinute] = slot.endTime.split(':').map(Number);
          
          processedSlots.push({
            startHour,
            startMinute,
            endHour,
            endMinute,
            userId: slot.userId,
            userName: userData.name,
            category: slot.category
          });
        });
      });
      
      setAvailabilitySlots(processedSlots);
    };
    
    processAvailabilities();
  }, [currentDate, availabilities]);
  
  // Filter events for the current day
  const todayEvents = events.filter(event => 
    isSameDay(event.start, currentDate)
  );
  
  // Position calculation for events
  const calculateEventPosition = (event: CalendarEvent) => {
    const startHour = event.start.getHours();
    const startMinute = event.start.getMinutes();
    const endHour = event.end.getHours();
    const endMinute = event.end.getMinutes();
    
    const startPercentage = ((startHour - 7) + startMinute / 60) * 60; // 60px per hour
    const duration = (endHour - startHour) + (endMinute - startMinute) / 60;
    const height = duration * 60; // 60px per hour
    
    return {
      top: `${startPercentage}px`,
      height: `${height}px`,
      backgroundColor: event.color || '#4285F4',
    };
  };
  
  const calculateAvailabilityPosition = (slot: AvailabilitySlot) => {
    const startPercentage = ((slot.startHour - 7) + slot.startMinute / 60) * 60; // 60px per hour
    const duration = (slot.endHour - slot.startHour) + (slot.endMinute - slot.startMinute) / 60;
    const height = duration * 60; // 60px per hour
    
    return {
      top: `${startPercentage}px`,
      height: `${height}px`,
    };
  };
  
  const handleCellClick = (hour: number) => {
    if (onCreateEvent && isTimeAvailable(hour)) {
      onCreateEvent();
    }
  };
  
  const handleAvailabilityClick = (slot: AvailabilitySlot) => {
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
  
  // Check if a time slot has availability
  const isTimeAvailable = (hour: number) => {
    return availabilitySlots.some(slot => 
      (slot.startHour <= hour && slot.endHour > hour)
    );
  };

  // Get color based on category
  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case 'session':
        return 'bg-green-100 border-green-300 text-green-800';
      case 'break':
        return 'bg-blue-100 border-blue-300 text-blue-800';
      case 'office':
        return 'bg-purple-100 border-purple-300 text-purple-800';
      case 'meeting':
        return 'bg-yellow-100 border-yellow-300 text-yellow-800';
      case 'class setup':
        return 'bg-orange-100 border-orange-300 text-orange-800';
      case 'qc':
        return 'bg-pink-100 border-pink-300 text-pink-800';
      default:
        return 'bg-gray-100 border-gray-300 text-gray-800';
    }
  };

  return (
    <div className="flex h-full">
      {/* Time column */}
      <div className="w-16 flex-shrink-0">
        {hours.map(hour => (
          <div 
            key={hour} 
            className="relative h-[60px] border-b border-r border-gray-200"
          >
            <div className="absolute -top-3 right-2 text-xs text-gray-500">
              {hour === 12 ? '12 PM' : hour < 12 ? `${hour} AM` : `${hour-12} PM`}
            </div>
          </div>
        ))}
      </div>
      
      {/* Day column */}
      <div className="flex-1 relative">
        {/* Date header */}
        <div className="h-12 border-b border-r border-gray-200 bg-white flex items-center justify-center">
          <div className="text-lg font-semibold">
            {format(currentDate, 'EEEE, MMMM d')}
          </div>
        </div>

        {/* Hour cells */}
        <div className="relative">
          {hours.map(hour => {
            const available = isTimeAvailable(hour);
            
            return (
              <div
                key={hour}
                className={`h-[60px] border-b border-r border-gray-200 
                  ${available ? 'cursor-pointer hover:bg-blue-50' : 'bg-gray-300 cursor-not-allowed'}`}
                onClick={() => handleCellClick(hour)}
                aria-disabled={!available}
              ></div>
            );
          })}
          
          {/* Availability slots */}
          <div className="absolute top-0 left-0 right-0">
            {availabilitySlots.map((slot, index) => (
              <div
                key={`availability-${index}`}
                className={`absolute left-1 right-1 rounded px-2 py-1 border overflow-hidden text-sm group cursor-pointer hover:opacity-90 ${getCategoryColor(slot.category)}`}
                style={calculateAvailabilityPosition(slot)}
                onClick={() => handleAvailabilityClick(slot)}
              >
                <div className="flex justify-between">
                  <span className="font-semibold group-hover:underline">
                    {slot.userName ? `${slot.userName}` : 'Available'}
                  </span>
                  <span className="text-xs px-1.5 py-0.5 rounded-full bg-white/50">
                    {slot.category}
                  </span>
                </div>
                <div className="text-xs opacity-90">
                  {`${slot.startHour}:${slot.startMinute.toString().padStart(2, '0')} - ${slot.endHour}:${slot.endMinute.toString().padStart(2, '0')}`}
                </div>
              </div>
            ))}
          </div>
          
          {/* Events */}
          <div className="absolute top-0 left-0 right-0">
            {todayEvents.map((event, eventIndex) => (
              <div
                key={eventIndex}
                className="absolute left-1 right-1 rounded px-2 py-1 text-white overflow-hidden text-sm group cursor-pointer"
                style={calculateEventPosition(event)}
                onClick={() => handleEditClick(event)}
              >
                <div className="font-semibold group-hover:underline">{event.title}</div>
                <div className="text-xs opacity-90">
                  {format(event.start, 'h:mm a')} - {format(event.end, 'h:mm a')}
                </div>
                {onEditEvent && onDeleteEvent && (
                  <div className="absolute top-1 right-1 hidden group-hover:flex gap-1">
                    <Button 
                      size="icon" 
                      variant="ghost" 
                      className="h-5 w-5 bg-white/20 hover:bg-white/40"
                      onClick={(e) => { 
                        e.stopPropagation();
                        handleEditClick(event);
                      }}
                    >
                      <Pencil className="h-3 w-3" />
                    </Button>
                    <Button 
                      size="icon" 
                      variant="ghost" 
                      className="h-5 w-5 bg-white/20 hover:bg-white/40"
                      onClick={(e) => { 
                        e.stopPropagation();
                        handleDeleteClick(event);
                      }}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DayView;
