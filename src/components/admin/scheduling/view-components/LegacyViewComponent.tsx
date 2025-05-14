
import React, { useState, useEffect, useMemo } from 'react';
import { useCalendar } from '../context/CalendarContext';
import { CalendarEvent } from '../types';
import { format, isSameDay } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

interface LegacyViewComponentProps {
  onCreateEvent?: () => void;
  onEditEvent?: (event: CalendarEvent) => void;
  onDeleteEvent?: (event: CalendarEvent) => void;
}

export const LegacyViewComponent: React.FC<LegacyViewComponentProps> = ({
  onCreateEvent,
  onEditEvent,
  onDeleteEvent
}) => {
  const { events, availabilities, currentDate } = useCalendar();
  const [expandedDays, setExpandedDays] = useState<number[]>([]);
  const [displayMode, setDisplayMode] = useState<'both' | 'events' | 'slots'>('both');
  
  // Time slots to display
  const timeSlots = useMemo(() => {
    return ["8:00 AM", "9:00 AM", "10:00 AM", "11:00 AM", "12:00 PM", 
           "1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM", "5:00 PM", 
           "6:00 PM", "7:00 PM", "8:00 PM"];
  }, []);
  
  // Days of week
  const daysOfWeek = useMemo(() => {
    return [
      { name: "Monday", index: 1 },
      { name: "Tuesday", index: 2 },
      { name: "Wednesday", index: 3 },
      { name: "Thursday", index: 4 },
      { name: "Friday", index: 5 },
      { name: "Saturday", index: 6 },
      { name: "Sunday", index: 0 }
    ];
  }, []);
  
  // Initialize with Monday expanded
  useEffect(() => {
    setExpandedDays([1]); // Monday = 1
  }, []);
  
  // Toggle day expansion
  const toggleDay = (dayIndex: number) => {
    setExpandedDays(prev => 
      prev.includes(dayIndex) 
        ? prev.filter(d => d !== dayIndex) 
        : [...prev, dayIndex]
    );
  };
  
  // Process available slots
  const availabilitySlotsByDay = useMemo(() => {
    const slotsByDay: Record<number, any[]> = {
      0: [], 1: [], 2: [], 3: [], 4: [], 5: [], 6: []
    };
    
    if (!availabilities) return slotsByDay;
    
    Object.entries(availabilities).forEach(([userId, userData]) => {
      if (!userData || !userData.slots || !Array.isArray(userData.slots)) return;
      
      userData.slots.forEach(slot => {
        if (typeof slot.dayOfWeek !== 'number' || 
            !slot.startTime || !slot.endTime) return;
        
        try {
          const [startHour, startMinute] = slot.startTime.split(':').map(Number);
          const [endHour, endMinute] = slot.endTime.split(':').map(Number);
          
          if (isNaN(startHour) || isNaN(startMinute) || 
              isNaN(endHour) || isNaN(endMinute)) return;
          
          // Format for display
          const formattedStartTime = formatTime(startHour, startMinute);
          const formattedEndTime = formatTime(endHour, endMinute);
          
          slotsByDay[slot.dayOfWeek].push({
            userId: slot.user_id || userId,
            userName: userData.name || 'Unknown',
            startTime: formattedStartTime,
            endTime: formattedEndTime,
            category: slot.category || 'General',
            dayOfWeek: slot.dayOfWeek
          });
        } catch (error) {
          console.error('Error processing availability slot:', error);
        }
      });
    });
    
    // Sort slots by time
    Object.keys(slotsByDay).forEach(key => {
      const dayIndex = Number(key);
      slotsByDay[dayIndex].sort((a, b) => {
        return a.startTime.localeCompare(b.startTime);
      });
    });
    
    return slotsByDay;
  }, [availabilities]);
  
  // Helper function to format time
  const formatTime = (hour: number, minute: number): string => {
    const period = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minute.toString().padStart(2, '0')} ${period}`;
  };
  
  // Get category style
  const getCategoryStyle = (category: string) => {
    switch(category.toLowerCase()) {
      case 'teaching':
        return 'bg-green-600 text-white';
      case 'meeting':
        return 'bg-blue-600 text-white';
      case 'practice':
        return 'bg-amber-600 text-white';
      case 'performance':
        return 'bg-purple-600 text-white';
      case 'session':
        return 'bg-indigo-600 text-white';
      default:
        return 'bg-emerald-600 text-white';
    }
  };
  
  // Events filtered by day
  const eventsByDay = useMemo(() => {
    const byDay: Record<number, CalendarEvent[]> = {
      0: [], 1: [], 2: [], 3: [], 4: [], 5: [], 6: []
    };
    
    events.forEach(event => {
      const dayOfWeek = event.start.getDay();
      byDay[dayOfWeek].push(event);
    });
    
    // Sort events by time
    Object.keys(byDay).forEach(key => {
      const dayIndex = Number(key);
      byDay[dayIndex].sort((a, b) => a.start.getTime() - b.start.getTime());
    });
    
    return byDay;
  }, [events]);
  
  return (
    <div className="h-full flex flex-col">
      <div className="p-4 bg-blue-50 border-b">
        <h3 className="font-medium text-blue-800">Legacy Calendar View</h3>
        <p className="text-sm text-muted-foreground">
          This view shows both availability slots and events in a table format.
        </p>
        
        <div className="flex items-center space-x-2 mt-2">
          <button 
            onClick={() => setDisplayMode('both')}
            className={cn(
              "px-2 py-1 text-xs rounded", 
              displayMode === 'both' 
                ? "bg-blue-600 text-white" 
                : "bg-blue-100 text-blue-700"
            )}
          >
            Both
          </button>
          <button 
            onClick={() => setDisplayMode('events')}
            className={cn(
              "px-2 py-1 text-xs rounded", 
              displayMode === 'events' 
                ? "bg-blue-600 text-white" 
                : "bg-blue-100 text-blue-700"
            )}
          >
            Events Only
          </button>
          <button 
            onClick={() => setDisplayMode('slots')}
            className={cn(
              "px-2 py-1 text-xs rounded", 
              displayMode === 'slots' 
                ? "bg-blue-600 text-white" 
                : "bg-blue-100 text-blue-700"
            )}
          >
            Slots Only
          </button>
        </div>
      </div>
      
      <ScrollArea className="flex-grow">
        <div className="min-w-[800px]">
          <div className="grid grid-cols-[120px_1fr] border-b">
            <div className="p-3 font-medium bg-gray-100">Day</div>
            <div className="grid grid-cols-4 divide-x">
              {timeSlots.map((slot, index) => (
                <div key={index} className="p-3 font-medium text-center bg-gray-100">
                  {slot}
                </div>
              ))}
            </div>
          </div>
          
          {daysOfWeek.map(day => (
            <div key={day.index} className="grid grid-cols-[120px_1fr] border-b">
              <div 
                className="p-3 flex items-center justify-between cursor-pointer hover:bg-gray-50"
                onClick={() => toggleDay(day.index)}
              >
                <span className="font-medium">{day.name}</span>
                {expandedDays.includes(day.index) 
                  ? <ChevronUp className="h-4 w-4" /> 
                  : <ChevronDown className="h-4 w-4" />}
              </div>
              
              {expandedDays.includes(day.index) ? (
                <div className="divide-y">
                  {/* Show combined events and slots */}
                  {displayMode !== 'events' && availabilitySlotsByDay[day.index].map((slot, idx) => (
                    <div key={`slot-${day.index}-${idx}`} className="p-0">
                      <div className={cn("m-1 p-2 rounded", getCategoryStyle(slot.category))}>
                        <div className="font-medium">{slot.userName}</div>
                        <div className="text-sm">
                          {slot.startTime} - {slot.endTime}
                        </div>
                        <Badge className="mt-1 bg-white/20 hover:bg-white/30 text-white">
                          {slot.category}
                        </Badge>
                      </div>
                    </div>
                  ))}
                  
                  {/* Show events */}
                  {displayMode !== 'slots' && eventsByDay[day.index].map((event, idx) => (
                    <div key={`event-${day.index}-${idx}`} className="p-0">
                      <div 
                        className="m-1 p-2 rounded cursor-pointer"
                        style={{ backgroundColor: event.color || '#4285F4' }}
                        onClick={() => onEditEvent && onEditEvent(event)}
                      >
                        <div className="font-medium text-white">{event.title}</div>
                        <div className="text-sm text-white/90">
                          {format(event.start, 'h:mm a')} - {format(event.end, 'h:mm a')}
                        </div>
                        {event.location && (
                          <div className="text-xs text-white/80 mt-1">
                            Location: {event.location}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-4 divide-x">
                  <div className="p-3 text-center text-gray-500">
                    {displayMode !== 'events' && `${availabilitySlotsByDay[day.index].length} slots`}
                    {displayMode === 'both' && ', '}
                    {displayMode !== 'slots' && `${eventsByDay[day.index].length} events`}
                  </div>
                  <div className="p-3"></div>
                  <div className="p-3"></div>
                  <div className="p-3"></div>
                </div>
              )}
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};
