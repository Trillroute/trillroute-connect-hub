
import React from 'react';
import { Clock, MapPin, Pencil, Trash2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CalendarEvent } from '../context/calendarTypes';
import { ListItem, EventItem, SlotItem, formatTimeDisplay, formatDateDisplay, getItemColor } from '../utils/listViewUtils';

interface ListViewItemProps {
  item: ListItem;
  onEditEvent?: (event: CalendarEvent) => void;
  onDeleteEvent?: (event: CalendarEvent) => void;
}

const ListViewItem: React.FC<ListViewItemProps> = ({ item, onEditEvent, onDeleteEvent }) => {
  return (
    <div className="border rounded-md p-4 bg-white shadow-sm hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-lg font-medium">{item.title}</h3>
        <Badge variant={item.isSlot ? "outline" : "default"} className="font-normal">
          {formatDateDisplay(item.start, item.isSlot ? (item as SlotItem).dayName : undefined)}
        </Badge>
      </div>
      
      <div className="flex items-center text-gray-500 mb-2">
        <Clock className="w-4 h-4 mr-2" />
        <span className="text-sm">
          {formatTimeDisplay(item.start)} - {formatTimeDisplay(item.end)}
        </span>
      </div>
      
      {/* Only show location for events, not for slots */}
      {!item.isSlot && (item as EventItem).location && (
        <div className="flex items-center text-gray-500 mb-2">
          <MapPin className="w-4 h-4 mr-2" />
          <span className="text-sm">{(item as EventItem).location}</span>
        </div>
      )}
      
      {/* Show category badge for slots only */}
      {item.isSlot && (
        <div className="text-sm text-gray-600 mb-4">
          <Badge variant="secondary" className="font-normal">
            {(item as SlotItem).category}
          </Badge>
        </div>
      )}
      
      {/* Only show description for events, not for slots */}
      {!item.isSlot && (item as EventItem).description && (
        <p className="mt-2 text-sm text-gray-600 mb-4">{(item as EventItem).description}</p>
      )}
      
      <div className="flex justify-between items-center mt-4">
        <div
          className="w-1/3 h-2 rounded"
          style={{ backgroundColor: getItemColor(item) }}
        ></div>
        
        {/* Only show edit/delete buttons for events, not for slots */}
        {!item.isSlot && onEditEvent && onDeleteEvent && (
          <div className="flex space-x-2">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => onEditEvent(item as CalendarEvent)}
            >
              <Pencil className="h-4 w-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-red-500 hover:text-red-600" 
              onClick={() => onDeleteEvent(item as CalendarEvent)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ListViewItem;
