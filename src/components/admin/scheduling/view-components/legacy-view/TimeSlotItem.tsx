
import React from 'react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { getItemStyle, getCategoryColor } from './utils';
import { CalendarEvent } from '../../context/calendarTypes';
import { format } from 'date-fns';
import { handleAvailabilitySlotClick } from '../../utils/availabilitySlotHandlers';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface TimeSlotItemProps {
  item: {
    userId: string;
    userName: string;
    status: 'available' | 'expired' | 'booked';
    type: string;
    color: string;
    dayOfWeek?: number;
    startHour?: number;
    startMinute?: number;
    endHour?: number;
    endMinute?: number;
  };
  slotTime: string;
  events: CalendarEvent[];
  onEditEvent?: (event: CalendarEvent) => void;
  onCreateEvent?: () => void;
}

const TimeSlotItem: React.FC<TimeSlotItemProps> = ({ 
  item, 
  slotTime, 
  events,
  onEditEvent,
  onCreateEvent
}) => {
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    console.log('TimeSlotItem clicked:', { 
      status: item.status, 
      userName: item.userName, 
      slotTime,
      onCreateEvent: !!onCreateEvent,
      onEditEvent: !!onEditEvent
    });
    
    if (item.status === 'booked' && onEditEvent) {
      // Find the event to edit
      const eventToEdit = events.find(e => 
        e.title === item.userName && 
        format(e.start, 'h:mm a') === slotTime
      );
      if (eventToEdit) {
        console.log('TimeSlotItem: Calling onEditEvent with event:', eventToEdit);
        onEditEvent(eventToEdit);
      }
    } else if (item.status === 'available' && 
              item.dayOfWeek !== undefined && 
              item.startHour !== undefined && 
              item.startMinute !== undefined && 
              item.endHour !== undefined && 
              item.endMinute !== undefined &&
              onCreateEvent) {
      // For available slots, prepare for event creation
      console.log('TimeSlotItem: Handling availability slot click for:', item);
      
      handleAvailabilitySlotClick({
        dayOfWeek: item.dayOfWeek,
        startHour: item.startHour,
        startMinute: item.startMinute,
        endHour: item.endHour,
        endMinute: item.endMinute,
        userId: item.userId,
        userName: item.userName,
        category: item.type
      });
      
      console.log('TimeSlotItem: About to call onCreateEvent');
      // Trigger the create event popup
      onCreateEvent();
      console.log('TimeSlotItem: onCreateEvent called');
    } else {
      console.log('TimeSlotItem: Click conditions not met', {
        status: item.status,
        hasTimeData: !!(item.dayOfWeek !== undefined && 
                       item.startHour !== undefined && 
                       item.startMinute !== undefined && 
                       item.endHour !== undefined && 
                       item.endMinute !== undefined),
        hasOnCreateEvent: !!onCreateEvent
      });
    }
  };
  
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div 
            className={cn(
              "p-3 rounded shadow-sm cursor-pointer hover:opacity-90 transition-opacity",
              getItemStyle(item)
            )}
            onClick={handleClick}
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
        </TooltipTrigger>
        <TooltipContent>
          {item.status === 'available' ? (
            <>
              <p><strong>{item.type}</strong> - {item.userName}</p>
              <p className="text-xs">Click to create an event</p>
            </>
          ) : item.status === 'booked' ? (
            <>
              <p><strong>{item.userName}</strong> - Booked</p>
              <p className="text-xs">Click to edit event</p>
            </>
          ) : (
            <p>This slot has expired</p>
          )}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default TimeSlotItem;
