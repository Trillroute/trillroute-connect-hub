
import { useMemo, useState, useEffect } from 'react';
import { useCalendar } from '../../context/CalendarContext';
import { formatTime } from './utils';
import { TimeSlot, DayInfo } from './types';

export const useLegacyViewData = () => {
  const { events, availabilities, currentDate } = useCalendar();
  const [expandedDays, setExpandedDays] = useState<number[]>([]);
  const [displayMode, setDisplayMode] = useState<'both' | 'events' | 'slots'>('both');
  
  // Days of week
  const daysOfWeek: DayInfo[] = useMemo(() => {
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
    const slotsByDay: Record<number, TimeSlot[]> = {
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

  return {
    daysOfWeek,
    timeSlotsByDay,
    expandedDays,
    displayMode,
    events,
    toggleDay,
    setDisplayMode
  };
};

export const getCategoryColor = (category: string): string => {
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
