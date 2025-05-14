
import React, { useState, useMemo } from 'react';
import { format, isSameDay, isAfter } from 'date-fns';
import { useCalendar } from './context/CalendarContext';
import { CalendarEvent } from './context/calendarTypes';
import { Button } from '@/components/ui/button';
import { Clock, MapPin, Pencil, Trash2, Calendar, Users, Tag } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';

interface EventListViewProps {
  events: CalendarEvent[];
  onEditEvent: (event: CalendarEvent) => void;
  onDeleteEvent: (event: CalendarEvent) => void;
}

// Define a type for list items that can be either events or availability slots
interface AvailabilityItem {
  id: string;
  type: 'availability';
  title: string;
  start: Date;
  end: Date;
  userId?: string;
  userName?: string;
  category?: string;
  color?: string;
  location?: string; // Add location to match EventItem
  description?: string; // Add description to match EventItem
}

interface EventItem {
  id: string;
  type: 'event';
  title: string;
  start: Date;
  end: Date;
  location?: string;
  description?: string;
  color?: string;
}

type ListItem = AvailabilityItem | EventItem;

const EventListView: React.FC<EventListViewProps> = ({ events, onEditEvent, onDeleteEvent }) => {
  const { currentDate, availabilities } = useCalendar();
  const [displayCount, setDisplayCount] = useState<number>(20);
  
  // Convert availability slots to list items format
  const availabilityItems = useMemo(() => {
    if (!availabilities) return [];
    
    const items: AvailabilityItem[] = [];
    const now = new Date();
    const dayOfWeek = currentDate.getDay(); // 0 for Sunday, 1 for Monday, etc.
    
    // Process all user availabilities
    Object.entries(availabilities).forEach(([userId, userData]) => {
      if (!userData || !userData.slots) return;
      
      userData.slots.forEach(slot => {
        if (slot.dayOfWeek !== dayOfWeek) return;
        
        try {
          // Parse time strings to extract hours and minutes
          const [startHour, startMinute] = slot.startTime.split(':').map(Number);
          const [endHour, endMinute] = slot.endTime.split(':').map(Number);
          
          // Create date objects for today with the slot's hours and minutes
          const startDate = new Date(currentDate);
          startDate.setHours(startHour, startMinute, 0);
          
          const endDate = new Date(currentDate);
          endDate.setHours(endHour, endMinute, 0);
          
          // Only include availability slots that haven't ended yet
          if (isAfter(endDate, now)) {
            items.push({
              id: slot.id,
              type: 'availability',
              title: `Available: ${userData.name || 'User'}`,
              start: startDate,
              end: endDate,
              userId,
              userName: userData.name,
              category: slot.category || 'Default',
              color: '#4ade80' // light green for availability
            });
          }
        } catch (error) {
          console.error('Error processing availability slot:', error);
        }
      });
    });
    
    return items;
  }, [availabilities, currentDate]);
  
  // Convert calendar events to list items format
  const eventItems = useMemo(() => {
    return events.map(event => ({
      ...event,
      type: 'event' as const,
      title: event.title
    }));
  }, [events]);
  
  // Combine and sort both types of items
  const combinedItems = useMemo(() => {
    const allItems = [...eventItems, ...availabilityItems];
    
    // Get current time for filtering
    const now = new Date();
    
    // Filter and sort items
    return allItems
      .filter(item => {
        // Keep items that are either on the current selected date or in the future
        return (isSameDay(item.start, currentDate) && isAfter(item.end, now)) || 
               (isAfter(item.start, now));
      })
      .sort((a, b) => a.start.getTime() - b.start.getTime());
  }, [eventItems, availabilityItems, currentDate]);
  
  // Get the limited set of items to display based on the displayCount
  const displayedItems = combinedItems.slice(0, displayCount);
  
  // Function to load more items
  const handleShowMore = () => {
    setDisplayCount(prevCount => prevCount + 20);
  };
  
  // Get an appropriate title based on current date
  const getViewTitle = () => {
    return `Events & Availability for ${format(currentDate, 'EEEE, MMMM d, yyyy')}`;
  };

  return (
    <div className="h-full flex flex-col">
      <h2 className="text-lg font-semibold px-6 py-4">
        {getViewTitle()}
      </h2>
      
      <ScrollArea className="flex-1 px-6 pb-6">
        {combinedItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full bg-gray-50 rounded-lg p-8 border border-dashed border-gray-300">
            <div className="text-gray-500 text-center mb-6">
              <div className="text-lg mb-2">No events or availability scheduled</div>
              <div className="text-sm">Click on the calendar to add a new event</div>
            </div>
          </div>
        ) : (
          <div className="space-y-4 pb-4">
            {displayedItems.map((item, index) => (
              <div 
                key={`${item.type}-${item.id}-${index}`} 
                className="border rounded-md p-4 bg-white shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center">
                      {item.type === 'availability' ? (
                        <Badge className="mr-2 bg-green-100 text-green-800 border-green-300">
                          Available
                        </Badge>
                      ) : (
                        <Badge className="mr-2 bg-blue-100 text-blue-800 border-blue-300">
                          Event
                        </Badge>
                      )}
                      <h3 className="text-lg font-medium">{item.title}</h3>
                    </div>
                    <div className="flex items-center text-gray-500 mt-2">
                      <Clock className="w-4 h-4 mr-1" />
                      <span className="text-sm">
                        {format(item.start, 'h:mm a')} - {format(item.end, 'h:mm a')}
                      </span>
                    </div>
                    
                    {/* Only display location if the item type is event and has location */}
                    {item.type === 'event' && item.location && (
                      <div className="flex items-center text-gray-500 mt-1">
                        <MapPin className="w-4 h-4 mr-1" />
                        <span className="text-sm">{item.location}</span>
                      </div>
                    )}
                    
                    {/* Display user name for availability items */}
                    {item.type === 'availability' && item.userName && (
                      <div className="flex items-center text-gray-500 mt-1">
                        <Users className="w-4 h-4 mr-1" />
                        <span className="text-sm">{item.userName}</span>
                      </div>
                    )}
                    
                    {/* Display category for availability items */}
                    {item.type === 'availability' && item.category && (
                      <div className="flex items-center text-gray-500 mt-1">
                        <Tag className="w-4 h-4 mr-1" />
                        <span className="text-sm">{item.category}</span>
                      </div>
                    )}
                    
                    {/* Only display description if the item type is event and has description */}
                    {item.type === 'event' && item.description && (
                      <p className="mt-2 text-sm text-gray-600">{item.description}</p>
                    )}
                  </div>
                  {item.type === 'event' && (
                    <div className="flex space-x-1">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-8 w-8" 
                        onClick={() => onEditEvent(item as CalendarEvent)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-8 w-8 text-red-500 hover:text-red-600" 
                        onClick={() => onDeleteEvent(item as CalendarEvent)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>
                
                <div
                  className="w-full h-1 mt-4"
                  style={{ backgroundColor: item.color || '#4285F4' }}
                ></div>
              </div>
            ))}
            
            {/* Show more button - only visible if there are more items to show */}
            {displayedItems.length < combinedItems.length && (
              <div className="flex justify-center mt-4">
                <Button 
                  variant="outline" 
                  onClick={handleShowMore}
                  className="w-full max-w-sm"
                >
                  Show More ({combinedItems.length - displayedItems.length} items remaining)
                </Button>
              </div>
            )}
          </div>
        )}
      </ScrollArea>
    </div>
  );
};

export default EventListView;
