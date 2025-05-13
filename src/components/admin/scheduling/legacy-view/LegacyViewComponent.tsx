
import React, { useEffect, useState, useMemo, useRef } from 'react';
import { useCalendar } from '../context/CalendarContext';
import { Loader2, ChevronDown, ChevronUp } from 'lucide-react';
import { useStaffAvailability } from '@/hooks/useStaffAvailability';
import { format, addDays } from 'date-fns';
import { getTimeSlots, formatTimeDisplay, isTimeSlotExpired } from './legacyViewUtils';

const LegacyViewComponent: React.FC = () => {
  const { events, availabilities, currentDate, setIsCreateEventOpen, handleDateSelect } = useCalendar();
  const { availabilityByUser, loading: staffLoading, refetch } = useStaffAvailability();
  const [isLoading, setIsLoading] = useState(true);
  const [expandedRows, setExpandedRows] = useState<Record<string, boolean>>({});
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Standard time slots that we'll display
  const standardTimeSlots = useMemo(() => 
    getTimeSlots(events, { ...availabilities, ...availabilityByUser }),
  [events, availabilities, availabilityByUser]);
  
  // Days of the week starting from the current date
  const daysOfWeek = useMemo(() => {
    const today = currentDate || new Date();
    const days = [];
    for (let i = 0; i < 7; i++) {
      days.push({
        date: addDays(today, i),
        name: format(addDays(today, i), 'EEEE'),
        expanded: true
      });
    }
    return days;
  }, [currentDate]);
  
  // Initialize with all rows expanded
  useEffect(() => {
    const initialExpandedState: Record<string, boolean> = {};
    daysOfWeek.forEach(day => {
      initialExpandedState[day.name] = true;
    });
    setExpandedRows(initialExpandedState);
  }, [daysOfWeek]);
  
  // Load staff availability data
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      await refetch();
      setIsLoading(false);
    };
    
    loadData();
  }, [refetch]);
  
  // Toggle row expansion
  const toggleRow = (day: string) => {
    setExpandedRows(prev => ({
      ...prev,
      [day]: !prev[day]
    }));
  };
  
  // Check if a slot has availability
  const getAvailabilityData = (day: number, timeSlot: string) => {
    // Combine context availabilities and staff availabilities
    const allAvailabilities = { ...availabilities, ...availabilityByUser };
    const availableStaff = [];
    
    // Check each user's availability for this day and time
    for (const userId in allAvailabilities) {
      const userData = allAvailabilities[userId];
      if (!userData || !userData.slots) continue;
      
      const hasSlotAvailable = userData.slots.some(slot => {
        if (slot.dayOfWeek === day) {
          const [hour, minute] = timeSlot.split(':').map(Number);
          const [startHour, startMinute] = slot.startTime.split(':').map(Number);
          const [endHour, endMinute] = slot.endTime.split(':').map(Number);
          
          const slotTime = hour * 60 + minute;
          const startTime = startHour * 60 + startMinute;
          const endTime = endHour * 60 + endMinute;
          
          return slotTime >= startTime && slotTime < endTime;
        }
        return false;
      });
      
      if (hasSlotAvailable) {
        availableStaff.push({
          name: userData.name || 'Staff',
          category: 'Regular slot',
          userId
        });
      }
    }
    
    return availableStaff;
  };

  const handleCellClick = (day: Date, timeSlot: string) => {
    const [hours, minutes] = timeSlot.split(':').map(Number);
    const selectedDate = new Date(day);
    selectedDate.setHours(hours, minutes, 0, 0);
    
    handleDateSelect(selectedDate);
    setIsCreateEventOpen(true);
  };
  
  if (isLoading || staffLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="w-full overflow-auto bg-card text-card-foreground p-4" ref={containerRef}>
      {/* Day Headers */}
      <div className="grid grid-cols-[120px_repeat(7,1fr)] gap-1 mb-2 sticky top-0 z-10">
        <div className="bg-muted p-3 text-center rounded font-medium">Time</div>
        {daysOfWeek.map((day, i) => (
          <div key={i} className="bg-muted p-3 text-center rounded font-medium">
            <div>{day.name}</div>
            <div className="text-sm text-muted-foreground">
              {format(day.date, 'MMM d')}
            </div>
          </div>
        ))}
      </div>

      {/* Time Slots and Days Grid */}
      <div className="space-y-1">
        {standardTimeSlots.map((timeSlot) => (
          <div key={timeSlot} className="grid grid-cols-[120px_repeat(7,1fr)] gap-1 mb-1">
            <div className="bg-muted/50 p-3 text-center rounded flex items-center justify-center">
              <span className="font-medium">{formatTimeDisplay(timeSlot)}</span>
            </div>
            
            {daysOfWeek.map((day, dayIndex) => {
              const staff = getAvailabilityData(day.date.getDay(), timeSlot);
              const expired = isTimeSlotExpired(timeSlot, day.date);
              
              return (
                <div 
                  key={`${day.name}-${timeSlot}`}
                  className="relative min-h-[80px] rounded overflow-hidden"
                >
                  {staff.length > 0 ? (
                    <div 
                      className={`absolute inset-0 p-3 transition-all rounded ${
                        expired 
                          ? 'bg-red-500/10 text-red-600' 
                          : 'bg-primary/20 text-primary hover:bg-primary/30'
                      }`}
                    >
                      <div className="font-medium">{staff[0].name}</div>
                      <div className="text-sm">{staff[0].category}</div>
                      {staff.length > 1 && (
                        <div className="text-xs mt-1 font-medium">
                          +{staff.length - 1} more
                        </div>
                      )}
                      {expired && <div className="text-xs mt-1 opacity-75">Expired</div>}
                    </div>
                  ) : (
                    <div 
                      onClick={() => !expired && handleCellClick(day.date, timeSlot)}
                      className={`absolute inset-0 p-3 flex flex-col justify-center items-center rounded transition-all ${
                        expired 
                          ? 'bg-muted/30 text-muted-foreground cursor-default' 
                          : 'bg-accent/50 hover:bg-accent text-accent-foreground cursor-pointer'
                      }`}
                    >
                      {!expired && (
                        <span className="font-medium text-2xl opacity-50">+</span>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};

export default LegacyViewComponent;
