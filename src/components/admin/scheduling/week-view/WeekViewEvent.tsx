
import React from 'react';
import { format } from 'date-fns';
import { CalendarEvent } from '../context/calendarTypes';
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from 'lucide-react';

interface WeekViewEventProps {
  event: CalendarEvent;
  isSelected: boolean;
  onSelect: (event: CalendarEvent) => void;
  onEdit: () => void;
  onDelete: () => void;
  style: React.CSSProperties;
}

const WeekViewEvent: React.FC<WeekViewEventProps> = ({
  event,
  isSelected,
  onSelect,
  onEdit,
  onDelete,
  style
}) => {
  // Uniform color coding across all views
  const getEventColor = (): string => {
    // Check if it's a trial class
    const isTrialClass = event.title?.toLowerCase().includes('trial') || 
                        event.description?.toLowerCase().includes('trial') ||
                        event.eventType?.toLowerCase().includes('trial');
    
    if (isTrialClass) {
      return '#F97316'; // Orange for trial classes
    }
    
    // Default to green for regular sessions/classes
    return '#10B981'; // Green for regular sessions
  };
  
  const eventColor = event.color || getEventColor();
  
  return (
    <div
      className={`absolute rounded px-2 py-1 text-white text-xs overflow-hidden cursor-pointer group opacity-100 ${isSelected ? 'ring-2 ring-white' : ''}`}
      style={{
        ...style,
        backgroundColor: eventColor,
      }}
      onClick={() => onSelect(event)}
    >
      <div className="font-semibold truncate group-hover:underline">{event.title}</div>
      <div className="opacity-90 truncate">
        {format(event.start, 'h:mm a')} - {format(event.end, 'h:mm a')}
      </div>
      <div className="absolute top-1 right-1 hidden group-hover:flex gap-1">
        <Button 
          size="icon" 
          variant="ghost" 
          className="h-5 w-5 bg-white/20 hover:bg-white/40"
          onClick={(e) => { 
            e.stopPropagation();
            onEdit();
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
            onDelete();
          }}
        >
          <Trash2 className="h-3 w-3" />
        </Button>
      </div>
    </div>
  );
};

export default WeekViewEvent;
