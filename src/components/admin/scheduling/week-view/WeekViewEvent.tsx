
import React from 'react';
import { format } from 'date-fns';
import { CalendarEvent } from '../context/calendarTypes';
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from 'lucide-react';
import { getEventColor } from './weekViewUtils';

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
  // Determine color based on event category if available in description
  const getCategoryFromDescription = (): string | null => {
    if (!event.description) return null;
    
    const categoryMatch = event.description.match(/category:([\w\s]+)/i);
    return categoryMatch ? categoryMatch[1].trim() : null;
  };
  
  const category = getCategoryFromDescription();
  const eventColor = event.color || (category ? getEventColor(category) : '#4285F4');
  
  return (
    <div
      className={`absolute rounded px-2 py-1 text-white text-xs overflow-hidden z-20 cursor-pointer group ${isSelected ? 'ring-2 ring-white' : ''}`}
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
