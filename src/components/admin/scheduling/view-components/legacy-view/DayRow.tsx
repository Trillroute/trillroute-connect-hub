
import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import DayTimeSlots from './DayTimeSlots';
import DayStatusBadges from './DayStatusBadges';
import { DayInfo, TimeSlot } from './types';
import { CalendarEvent } from '../../types';

interface DayRowProps {
  day: DayInfo;
  timeSlotsByDay: Record<number, TimeSlot[]>;
  expandedDays: number[];
  toggleDay: (dayIndex: number) => void;
  events: CalendarEvent[];
  onEditEvent?: (event: CalendarEvent) => void;
}

const DayRow: React.FC<DayRowProps> = ({ 
  day, 
  timeSlotsByDay, 
  expandedDays, 
  toggleDay,
  events,
  onEditEvent
}) => {
  // Get day counts for collapsed view
  const getDayCounts = () => {
    const slots = timeSlotsByDay[day.index];
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
  
  const isExpanded = expandedDays.includes(day.index);
  
  return (
    <div className="border-b">
      <div className="grid grid-cols-[120px_1fr]">
        <div 
          className="p-3 flex items-center justify-between cursor-pointer hover:bg-muted/30"
          onClick={() => toggleDay(day.index)}
        >
          <div className="flex items-center space-x-2">
            {isExpanded 
              ? <ChevronUp className="h-4 w-4" /> 
              : <ChevronDown className="h-4 w-4" />}
            <span className="font-medium">{day.name}</span>
          </div>
          <span className="text-sm bg-muted rounded-full w-6 h-6 flex items-center justify-center">
            {timeSlotsByDay[day.index].reduce((count, slot) => count + slot.items.length, 0)}
          </span>
        </div>
        
        {!isExpanded && (
          <div className="p-3 text-center text-muted-foreground flex items-center justify-center">
            <DayStatusBadges counts={getDayCounts()} />
          </div>
        )}
      </div>
      
      {isExpanded && (
        <div className="grid grid-cols-[120px_1fr]">
          <div className="bg-muted/10"></div>
          <DayTimeSlots 
            slots={timeSlotsByDay[day.index]} 
            dayIndex={day.index}
            events={events}
            onEditEvent={onEditEvent}
          />
        </div>
      )}
    </div>
  );
};

export default DayRow;
