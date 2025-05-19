
import React from 'react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { getItemStyle, getCategoryColor } from './utils';
import { CalendarEvent } from '../../types';
import { format } from 'date-fns';

interface TimeSlotItemProps {
  item: {
    userId: string;
    userName: string;
    status: 'available' | 'expired' | 'booked';
    type: string;
    color: string;
  };
  slotTime: string;
  events: CalendarEvent[];
  onEditEvent?: (event: CalendarEvent) => void;
}

const TimeSlotItem: React.FC<TimeSlotItemProps> = ({ 
  item, 
  slotTime, 
  events,
  onEditEvent
}) => {
  const handleClick = () => {
    if (item.status === 'booked' && onEditEvent) {
      // Find the event to edit
      const eventToEdit = events.find(e => 
        e.title === item.userName && 
        format(e.start, 'h:mm a') === slotTime
      );
      if (eventToEdit) {
        onEditEvent(eventToEdit);
      }
    }
  };
  
  return (
    <div 
      className={cn(
        "p-3 rounded shadow-sm cursor-pointer",
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
  );
};

export default TimeSlotItem;
