
import React, { useEffect } from 'react';
import EventListView from '../EventListView';
import { CalendarEvent } from '../context/calendarTypes';
import { useCalendar } from '../context/CalendarContext';
import { useUserAvailability } from '@/hooks/useUserAvailability';
import { useAuth } from '@/hooks/useAuth';

interface EventListViewComponentProps {
  onEditEvent: (event: CalendarEvent) => void;
  onDeleteEvent: (event: CalendarEvent) => void;
}

export const EventListViewComponent: React.FC<EventListViewComponentProps> = ({
  onEditEvent,
  onDeleteEvent
}) => {
  const { events, refreshEvents } = useCalendar();
  const { user } = useAuth();
  const { 
    dailyAvailability, 
    refreshAvailability 
  } = useUserAvailability(user?.id);
  
  // Force refresh events and availability when the component mounts
  useEffect(() => {
    console.log(`EventListViewComponent mounting, refreshing events and slots`);
    refreshEvents();
    refreshAvailability();
  }, [refreshEvents, refreshAvailability]);
  
  console.log(`EventListViewComponent rendering with ${events.length} events`);
  
  return (
    <div className="h-full overflow-auto px-6">
      <h2 className="text-xl font-semibold my-4">Upcoming Events & Availability</h2>
      <EventListView 
        events={events}
        dailyAvailability={dailyAvailability || []}
        onEditEvent={onEditEvent} 
        onDeleteEvent={onDeleteEvent} 
      />
    </div>
  );
};
