
import React, { useMemo } from 'react';
import EventListView from '../EventListView';
import { CalendarEvent } from '../context/calendarTypes';
import { useCalendar } from '../context/CalendarContext';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useFilteredEvents } from '../hooks/useFilteredEvents';

interface EventListViewComponentProps {
  onEditEvent: (event: CalendarEvent) => void;
  onDeleteEvent: (event: CalendarEvent) => void;
  onCreateEvent?: () => void;
  showAvailability?: boolean;
}

export const EventListViewComponent: React.FC<EventListViewComponentProps> = ({
  onEditEvent,
  onDeleteEvent,
  onCreateEvent,
  showAvailability = true
}) => {
  const { events, availabilities } = useCalendar();
  const { filteredAvailability } = useFilteredEvents({
    events,
    availabilities
  });
  
  // Convert availability slots to a format compatible with the list view
  const availabilityEvents = useMemo(() => {
    if (!showAvailability || !filteredAvailability) return [];
    
    return filteredAvailability.map(slot => {
      // Create a date object for the current week's slot
      const today = new Date();
      const currentWeekStart = new Date(today.setDate(today.getDate() - today.getDay()));
      const slotDate = new Date(currentWeekStart);
      slotDate.setDate(slotDate.getDate() + slot.dayOfWeek);
      slotDate.setHours(slot.startHour, slot.startMinute, 0, 0);
      
      const endDate = new Date(slotDate);
      endDate.setHours(slot.endHour, slot.endMinute, 0, 0);
      
      return {
        id: `availability-${slot.id}`,
        title: `Available: ${slot.userName}`,
        description: `${slot.category} availability slot`,
        start: slotDate,
        end: endDate,
        eventType: 'availability',
        userId: slot.userId,
        metadata: {
          userName: slot.userName,
          category: slot.category,
          isAvailability: true
        }
      } as CalendarEvent;
    });
  }, [filteredAvailability, showAvailability]);
  
  // Combine events and availability slots
  const displayEvents = useMemo(() => {
    console.log(`EventListViewComponent: Processing ${events.length} events and ${availabilityEvents.length} availability slots`);
    
    const combined = [...events, ...availabilityEvents];
    
    // Sort all items by start date
    const sortedEvents = combined.sort((a, b) => {
      if (!a.start || !b.start) return 0;
      return new Date(a.start).getTime() - new Date(b.start).getTime();
    });
    
    console.log('EventListViewComponent: Sorted combined events:', sortedEvents.map(e => ({
      title: e.title,
      start: e.start,
      eventType: e.eventType
    })));
    
    return sortedEvents;
  }, [events, availabilityEvents]);
  
  console.log(`EventListViewComponent: Rendering with ${displayEvents.length} total items`);
  
  return (
    <ScrollArea className="h-full">
      <div className="p-4">
        {displayEvents.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            <p>No events or availability slots found</p>
            <p className="text-sm mt-2">Try adjusting your filters or create a new event</p>
          </div>
        ) : (
          <div className="space-y-2 mb-4">
            <div className="text-sm text-muted-foreground">
              Showing {events.length} events and {availabilityEvents.length} availability slots
            </div>
            <EventListView 
              events={displayEvents}
              onEditEvent={onEditEvent} 
              onDeleteEvent={onDeleteEvent}
              onCreateEvent={onCreateEvent}
              showAvailability={showAvailability}
            />
          </div>
        )}
      </div>
    </ScrollArea>
  );
};
