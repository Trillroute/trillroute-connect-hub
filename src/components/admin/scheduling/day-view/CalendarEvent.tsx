
import React from 'react';
import { format } from 'date-fns';
import { CalendarEvent } from '../context/calendarTypes';
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from 'lucide-react';

interface CalendarEventProps {
  event: CalendarEvent;
  onEditClick: (event: CalendarEvent) => void;
  onDeleteClick: (event: CalendarEvent) => void;
}

const CalendarEventComponent: React.FC<CalendarEventProps> = ({
  event,
  onEditClick,
  onDeleteClick
}) => {
  const calculateEventPosition = () => {
    // Hours in calendar view start from 7:00 AM (0 minutes) to 7:00 PM (720 minutes)
    // Total range is 12 hours = 720 minutes
    
    const startHour = event.start.getHours();
    const startMinute = event.start.getMinutes();
    const endHour = event.end.getHours();
    const endMinute = event.end.getMinutes();
    
    // Calculate minutes from 7:00 AM
    const startMinutesFromReference = ((startHour - 7) * 60) + startMinute;
    
    // Calculate event duration in minutes
    const durationMinutes = ((endHour - startHour) * 60) + (endMinute - startMinute);
    
    // Convert to pixel positions (60px = 1 hour = 60 minutes)
    const topPosition = startMinutesFromReference; // 1 minute = 1px
    const heightValue = Math.max(durationMinutes, 20); // Ensure minimum height
    
    return {
      top: `${topPosition}px`,
      height: `${heightValue}px`,
      backgroundColor: event.color || '#4285F4',
    };
  };

  return (
    <div
      className="absolute left-1 right-1 rounded px-2 py-1 text-white overflow-hidden text-sm group cursor-pointer"
      style={calculateEventPosition()}
      onClick={() => onEditClick(event)}
    >
      <div className="font-semibold group-hover:underline">{event.title}</div>
      <div className="text-xs opacity-90">
        {format(event.start, 'h:mm a')} - {format(event.end, 'h:mm a')}
      </div>
      <div className="absolute top-1 right-1 hidden group-hover:flex gap-1">
        <Button 
          size="icon" 
          variant="ghost" 
          className="h-5 w-5 bg-white/20 hover:bg-white/40"
          onClick={(e) => { 
            e.stopPropagation();
            onEditClick(event);
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
            onDeleteClick(event);
          }}
        >
          <Trash2 className="h-3 w-3" />
        </Button>
      </div>
    </div>
  );
};

export default CalendarEventComponent;
