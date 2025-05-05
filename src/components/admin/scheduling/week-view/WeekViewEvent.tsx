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
  return (
    <div
      className="absolute left-1 right-1 rounded px-2 py-1 text-white overflow-hidden text-sm group cursor-pointer"
      style={style}
      onClick={() => onSelect(event)}
    >
      <div className="font-semibold group-hover:underline">{event.title}</div>
      <div className="text-xs opacity-90">
        {format(event.start, 'h:mm a')} - {format(event.end, 'h:mm a')}
      </div>
      {isSelected && (
        <div className="absolute top-1 right-1 flex gap-1">
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
      )}
    </div>
  );
};

export default WeekViewEvent;
