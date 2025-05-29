
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
  // Add filter props to match other views
  filterType?: 'course' | 'skill' | 'teacher' | 'student' | 'admin' | 'staff' | null;
  filterId?: string | null;
  filterIds?: string[];
  filters?: { users: string[]; courses: string[]; skills: string[] };
}

export const EventListViewComponent: React.FC<EventListViewComponentProps> = ({
  onEditEvent,
  onDeleteEvent,
  onCreateEvent,
  showAvailability = true,
  filterType,
  filterId,
  filterIds = [],
  filters = { users: [], courses: [], skills: [] }
}) => {
  const { events, availabilities } = useCalendar();
  
  console.log('=== EventListViewComponent Debug ===');
  console.log('Raw events from context:', events?.length || 0);
  console.log('Raw availabilities from context:', availabilities ? Object.keys(availabilities).length : 0);
  console.log('showAvailability prop:', showAvailability);
  console.log('Filter props:', { filterType, filterId, filterIds, filters });
  console.log('Full availabilities object:', availabilities);
  
  // Log individual availability entries
  if (availabilities) {
    Object.entries(availabilities).forEach(([userId, userData]) => {
      console.log(`User ${userId} (${userData.name}):`, userData.slots?.length || 0, 'slots');
      if (userData.slots) {
        userData.slots.forEach(slot => {
          console.log(`  - Slot ${slot.id}: Day ${slot.dayOfWeek}, ${slot.startTime}-${slot.endTime}, Category: ${slot.category}`);
        });
      }
    });
  }
  
  // Use the same filtering logic as other views
  const { filteredEvents, filteredAvailability } = useFilteredEvents({
    events,
    availabilities,
    filters,
    filterType,
    filterId,
    filterIds
  });
  
  console.log('After useFilteredEvents:');
  console.log('- filteredEvents:', filteredEvents?.length || 0);
  console.log('- filteredAvailability:', filteredAvailability?.length || 0);
  console.log('- filteredAvailability details:', filteredAvailability);
  
  // Convert availability slots to a format compatible with the list view
  const availabilityEvents = useMemo(() => {
    if (!showAvailability) {
      console.log('showAvailability is false, returning empty array');
      return [];
    }
    
    if (!filteredAvailability || filteredAvailability.length === 0) {
      console.log('No filteredAvailability data, returning empty array');
      return [];
    }
    
    console.log(`Converting ${filteredAvailability.length} availability slots to events`);
    
    const converted = filteredAvailability.map(slot => {
      // Create a date object for the current week's slot
      const today = new Date();
      const currentWeekStart = new Date(today.setDate(today.getDate() - today.getDay()));
      const slotDate = new Date(currentWeekStart);
      slotDate.setDate(slotDate.getDate() + slot.dayOfWeek);
      slotDate.setHours(slot.startHour, slot.startMinute, 0, 0);
      
      const endDate = new Date(slotDate);
      endDate.setHours(slot.endHour, slot.endMinute, 0, 0);
      
      const event = {
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
      
      console.log('Converted availability slot to event:', {
        id: event.id,
        title: event.title,
        start: event.start,
        eventType: event.eventType
      });
      
      return event;
    });
    
    console.log(`Successfully converted ${converted.length} availability events`);
    return converted;
  }, [filteredAvailability, showAvailability]);
  
  // Combine events and availability slots
  const displayEvents = useMemo(() => {
    console.log(`Combining ${filteredEvents?.length || 0} events and ${availabilityEvents.length} availability events`);
    
    const combined = [...(filteredEvents || []), ...availabilityEvents];
    
    // Sort all items by start date
    const sortedEvents = combined.sort((a, b) => {
      if (!a.start || !b.start) return 0;
      return new Date(a.start).getTime() - new Date(b.start).getTime();
    });
    
    console.log('Final sorted combined events:', sortedEvents.map(e => ({
      id: e.id,
      title: e.title,
      start: e.start,
      eventType: e.eventType
    })));
    
    return sortedEvents;
  }, [filteredEvents, availabilityEvents]);
  
  console.log(`=== Final Result: Rendering ${displayEvents.length} total items ===`);
  console.log(`- Regular events: ${filteredEvents?.length || 0}`);
  console.log(`- Availability events: ${availabilityEvents.length}`);
  
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
              Showing {filteredEvents?.length || 0} events and {availabilityEvents.length} availability slots
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
