
import React, { useState, useEffect, useMemo } from 'react';
import { useCalendar } from '../context/CalendarContext';
import { CalendarEvent } from '../types';
import { format } from 'date-fns';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

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
  
  // Initialize with all days expanded
  useEffect(() => {
    setExpandedDays([0, 1, 2, 3, 4, 5, 6]);
  }, []);
  
  // Toggle day expansion
  const toggleDay = (dayIndex: number) => {
    setExpandedDays(prev => 
      prev.includes(dayIndex) 
        ? prev.filter(d => d !== dayIndex) 
        : [...prev, dayIndex]
    );
  };
  
  // Get time slots from availability and events
  const timeSlotsByDay = useMemo(() => {
    const slotsByDay: Record<number, {
      time: string;
      items: Array<{
        userId: string;
        userName: string;
        status: 'available' | 'expired' | 'booked';
        type: string;
        color: string;
      }>;
    }[]> = {
      0: [], 1: [], 2: [], 3: [], 4: [], 5: [], 6: []
    };
    
    // Process availabilities
    if (availabilities && displayMode !== 'events') {
      Object.entries(availabilities).forEach(([userId, userData]) => {
        if (!userData || !userData.slots) return;
        
        userData.slots.forEach(slot => {
          if (typeof slot.dayOfWeek !== 'number' || 
              !slot.startTime || !slot.endTime) return;
          
          try {
            const [startHour, startMinute] = slot.startTime.split(':').map(Number);
            
            if (isNaN(startHour) || isNaN(startMinute)) return;
            
            // Format for display
            const formattedTime = formatTime(startHour, startMinute);
            
            // Find if time slot already exists
            let timeSlot = slotsByDay[slot.dayOfWeek].find(s => s.time === formattedTime);
            
            if (!timeSlot) {
              timeSlot = {
                time: formattedTime,
                items: []
              };
              slotsByDay[slot.dayOfWeek].push(timeSlot);
            }
            
            timeSlot.items.push({
              userId: userId,
              userName: userData.name || 'Unknown',
              status: 'available',
              type: slot.category || 'Regular slot',
              color: getCategoryColor(slot.category || 'default')
            });
          } catch (error) {
            console.error('Error processing availability slot:', error);
          }
        });
      });
    }
    
    // Process events
    if (events && displayMode !== 'slots') {
      events.forEach(event => {
        const dayOfWeek = event.start.getDay();
        const hour = event.start.getHours();
        const minute = event.start.getMinutes();
        const formattedTime = formatTime(hour, minute);
        
        // Find if time slot already exists
        let timeSlot = slotsByDay[dayOfWeek].find(s => s.time === formattedTime);
        
        if (!timeSlot) {
          timeSlot = {
            time: formattedTime,
            items: []
          };
          slotsByDay[dayOfWeek].push(timeSlot);
        }
        
        timeSlot.items.push({
          userId: event.userId || '',
          userName: event.title,
          status: 'booked',
          type: event.description || 'Event',
          color: event.color || '#4285F4'
        });
      });
    }
    
    // Sort slots by time for each day
    Object.keys(slotsByDay).forEach(key => {
      const dayIndex = Number(key);
      slotsByDay[dayIndex].sort((a, b) => {
        return a.time.localeCompare(b.time);
      });
    });
    
    return slotsByDay;
  }, [availabilities, events, displayMode]);
  
  // Helper function to format time
  const formatTime = (hour: number, minute: number): string => {
    const period = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minute.toString().padStart(2, '0')} ${period}`;
  };
  
  // Get category color
  const getCategoryColor = (category: string): string => {
    switch(category.toLowerCase()) {
      case 'teaching':
        return '#10B981';
      case 'meeting':
        return '#3B82F6';
      case 'practice':
        return '#F59E0B';
      case 'performance':
        return '#8B5CF6';
      case 'session':
        return '#6366F1';
      case 'expired':
        return '#9B2C2C';
      default:
        return '#10B981';
    }
  };
  
  // Get item background style based on status/category
  const getItemStyle = (item: { status: string; color: string }) => {
    if (item.status === 'expired') {
      return 'bg-red-700/90 text-white';
    }
    
    if (item.status === 'booked') {
      return `bg-blue-600 text-white`;
    }
    
    return 'bg-green-700 text-white';
  };
  
  // Get day counts for collapsed view
  const getDayCounts = (dayIndex: number) => {
    const slots = timeSlotsByDay[dayIndex];
    let availableCount = 0;
    let bookedCount = 0;
    let expiredCount = 0;
    
    slots.forEach(slot => {
      slot.items.forEach(item => {
        if (item.status === 'available') availableCount++;
        else if (item.status === 'booked') bookedCount++;
        else if (item.status === 'expired') expiredCount++;
      });
    });
    
    return { availableCount, bookedCount, expiredCount };
  };
  
  return (
    <div className="h-full flex flex-col">
      <div className="p-4 bg-card border-b">
        <h3 className="font-medium text-primary">Schedule View</h3>
        <p className="text-sm text-muted-foreground">
          Shows consolidated availability and events in a day-based view
        </p>
        
        <div className="flex items-center space-x-2 mt-2">
          <button 
            onClick={() => setDisplayMode('both')}
            className={cn(
              "px-2 py-1 text-xs rounded",
              displayMode === 'both' 
                ? "bg-primary text-primary-foreground" 
                : "bg-secondary text-secondary-foreground"
            )}
          >
            Both
          </button>
          <button 
            onClick={() => setDisplayMode('events')}
            className={cn(
              "px-2 py-1 text-xs rounded", 
              displayMode === 'events' 
                ? "bg-primary text-primary-foreground" 
                : "bg-secondary text-secondary-foreground"
            )}
          >
            Events Only
          </button>
          <button 
            onClick={() => setDisplayMode('slots')}
            className={cn(
              "px-2 py-1 text-xs rounded", 
              displayMode === 'slots' 
                ? "bg-primary text-primary-foreground" 
                : "bg-secondary text-secondary-foreground"
            )}
          >
            Slots Only
          </button>
        </div>
      </div>
      
      <ScrollArea className="flex-grow">
        <div className="min-w-[800px]">
          <div className="grid grid-cols-[120px_1fr] border-b bg-muted/30">
            <div className="p-3 font-medium">Day</div>
            <div className="p-3 font-medium text-center">Time Slots</div>
          </div>
          
          {daysOfWeek.map(day => (
            <div key={day.index} className="border-b">
              <div className="grid grid-cols-[120px_1fr]">
                <div 
                  className="p-3 flex items-center justify-between cursor-pointer hover:bg-muted/30"
                  onClick={() => toggleDay(day.index)}
                >
                  <div className="flex items-center space-x-2">
                    {expandedDays.includes(day.index) 
                      ? <ChevronUp className="h-4 w-4" /> 
                      : <ChevronDown className="h-4 w-4" />}
                    <span className="font-medium">{day.name}</span>
                  </div>
                  <span className="text-sm bg-muted rounded-full w-6 h-6 flex items-center justify-center">
                    {timeSlotsByDay[day.index].reduce((count, slot) => count + slot.items.length, 0)}
                  </span>
                </div>
                
                {!expandedDays.includes(day.index) && (
                  <div className="p-3 text-center text-muted-foreground flex items-center justify-center">
                    {(() => {
                      const { availableCount, bookedCount, expiredCount } = getDayCounts(day.index);
                      return (
                        <div className="flex space-x-4">
                          {availableCount > 0 && (
                            <span className="text-sm">
                              <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">
                                {availableCount} available
                              </Badge>
                            </span>
                          )}
                          {bookedCount > 0 && (
                            <span className="text-sm">
                              <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-200">
                                {bookedCount} booked
                              </Badge>
                            </span>
                          )}
                          {expiredCount > 0 && (
                            <span className="text-sm">
                              <Badge variant="outline" className="bg-red-100 text-red-800 border-red-200">
                                {expiredCount} expired
                              </Badge>
                            </span>
                          )}
                          {availableCount === 0 && bookedCount === 0 && expiredCount === 0 && (
                            <span className="text-sm">No slots</span>
                          )}
                        </div>
                      );
                    })()}
                  </div>
                )}
              </div>
              
              {expandedDays.includes(day.index) && (
                <div className="grid grid-cols-[120px_1fr]">
                  <div className="bg-muted/10"></div>
                  <div className="divide-y">
                    {timeSlotsByDay[day.index].length > 0 ? (
                      timeSlotsByDay[day.index].map((slot, slotIdx) => (
                        <div key={`${day.index}-${slotIdx}`} className="grid grid-cols-[120px_1fr]">
                          <div className="p-3 border-r font-medium text-muted-foreground">
                            {slot.time}
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 p-2">
                            {slot.items.map((item, idx) => (
                              <div 
                                key={`${day.index}-${slotIdx}-${idx}`}
                                className={cn(
                                  "p-3 rounded shadow-sm cursor-pointer",
                                  getItemStyle(item)
                                )}
                                onClick={() => {
                                  if (item.status === 'booked' && onEditEvent) {
                                    // Find the event to edit
                                    const eventToEdit = events.find(e => 
                                      e.title === item.userName && 
                                      format(e.start, 'h:mm a') === slot.time
                                    );
                                    if (eventToEdit) {
                                      onEditEvent(eventToEdit);
                                    }
                                  }
                                }}
                              >
                                <div className="font-medium">{item.userName}</div>
                                <div className="text-sm">
                                  {item.status === 'expired' ? 'Expired' : item.type}
                                </div>
                                {item.status === 'available' && (
                                  <Badge className="mt-1 text-xs bg-white/20 hover:bg-white/30">
                                    {item.type}
                                  </Badge>
                                )}
                              </div>
                            ))}
                            
                            {slot.items.length === 0 && (
                              <div className="p-3 border border-dashed rounded text-center text-muted-foreground">
                                Open slot
                              </div>
                            )}
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="p-4 text-center text-muted-foreground">
                        No slots available for this day
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};
