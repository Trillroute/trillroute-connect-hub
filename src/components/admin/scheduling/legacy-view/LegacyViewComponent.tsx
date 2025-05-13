
import React, { useEffect, useState, useMemo } from 'react';
import { useCalendar } from '../context/CalendarContext';
import { Loader2, ChevronDown, ChevronUp } from 'lucide-react';
import { useStaffAvailability } from '@/hooks/useStaffAvailability';
import { format, addDays } from 'date-fns';

const LegacyViewComponent: React.FC = () => {
  const { events, availabilities, currentDate, setIsCreateEventOpen, handleDateSelect } = useCalendar();
  const { availabilityByUser, loading: staffLoading, refetch } = useStaffAvailability();
  const [isLoading, setIsLoading] = useState(true);
  const [expandedRows, setExpandedRows] = useState<Record<string, boolean>>({});
  
  // Standard time slots that we'll display
  const standardTimeSlots = useMemo(() => [
    '09:00', '09:45', '10:30', '11:15', '12:00', '12:45',
    '13:30', '14:15', '15:00', '15:45', '16:30', '17:15', '18:00'
  ], []);
  
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

  // Check if a time slot is expired (in the past)
  const isTimeSlotExpired = (timeSlot: string, date: Date) => {
    const [hours, minutes] = timeSlot.split(':').map(Number);
    const slotDateTime = new Date(date);
    slotDateTime.setHours(hours, minutes || 0, 0, 0);
    return new Date() > slotDateTime;
  };
  
  const handleCellClick = (day: Date, timeSlot: string) => {
    const [hours, minutes] = timeSlot.split(':').map(Number);
    const selectedDate = new Date(day);
    selectedDate.setHours(hours, minutes, 0, 0);
    
    handleDateSelect(selectedDate);
    setIsCreateEventOpen(true);
  };
  
  // Loading state
  if (isLoading || staffLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="w-full overflow-auto bg-black text-white p-4">
      {/* Header Row */}
      <div className="grid grid-cols-[120px_1fr_1fr_1fr_1fr_1fr_1fr_1fr] gap-1 mb-1">
        <div className="bg-zinc-900 p-4 text-center">Time slot</div>
        {standardTimeSlots.map(time => (
          <div key={time} className="bg-zinc-900 p-4 text-center flex justify-between items-center">
            <ChevronDown className="h-5 w-5" />
            {format(new Date().setHours(parseInt(time.split(':')[0]), parseInt(time.split(':')[1])), 'h:mm a')}
            <div className="w-6 text-center">5</div>
          </div>
        ))}
      </div>
      
      {/* Day Rows */}
      <div className="space-y-1">
        {daysOfWeek.map((day) => (
          <div key={day.name}>
            {/* Day Header */}
            <div 
              className="grid grid-cols-[120px_1fr] gap-1 mb-1 cursor-pointer"
              onClick={() => toggleRow(day.name)}
            >
              <div className="bg-zinc-900 p-4 flex justify-between items-center">
                {expandedRows[day.name] ? 
                  <ChevronUp className="h-5 w-5" /> : 
                  <ChevronDown className="h-5 w-5" />
                }
                {day.name}
                <div className="w-6 text-center">9</div>
              </div>
              <div className="bg-zinc-900 p-4">Calender view details</div>
            </div>
            
            {/* Time Slots for this Day */}
            {expandedRows[day.name] && standardTimeSlots.map((timeSlot) => {
              const staff = getAvailabilityData(day.date.getDay(), timeSlot);
              const expired = isTimeSlotExpired(timeSlot, day.date);
              
              return (
                <div className="grid grid-cols-[120px_1fr] gap-1 mb-1" key={`${day.name}-${timeSlot}`}>
                  <div className="invisible">Spacer</div>
                  <div className="grid grid-cols-7 gap-1">
                    {staff.length > 0 ? (
                      staff.map((person, idx) => (
                        <div 
                          key={`${day.name}-${timeSlot}-${idx}`}
                          className={`p-4 ${expired ? 'bg-red-900/80' : 'bg-green-800'} rounded`}
                        >
                          <div className="font-medium">{person.name}</div>
                          <div>{person.category}</div>
                          <div>
                            {format(new Date().setHours(parseInt(timeSlot.split(':')[0]), parseInt(timeSlot.split(':')[1])), 'h:mm a')}
                          </div>
                          {expired && <div className="text-red-300 text-xs">Expired</div>}
                        </div>
                      ))
                    ) : (
                      <div 
                        className={`p-4 ${expired ? 'bg-gray-800' : 'bg-zinc-900 hover:bg-gray-700 cursor-pointer'} rounded flex justify-center items-center`}
                        onClick={() => !expired && handleCellClick(day.date, timeSlot)}
                      >
                        {!expired && <span className="text-gray-400 text-xl">+</span>}
                      </div>
                    )}
                  </div>
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
