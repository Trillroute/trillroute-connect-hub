
import React from 'react';
import { CalendarEvent } from './types';
import { Button } from '@/components/ui/button';
import EventCard from './event-list/EventCard';
import EventListEmptyState from './event-list/EventListEmptyState';

interface EventListViewProps {
  events: CalendarEvent[];
  onEditEvent: (event: CalendarEvent) => void;
  onDeleteEvent: (event: CalendarEvent) => void;
  onCreateEvent?: () => void;
  showAvailability?: boolean;
}

const EventListView: React.FC<EventListViewProps> = ({
  events,
  onEditEvent,
  onDeleteEvent,
  onCreateEvent,
  showAvailability = true
}) => {
  console.log('EventListView: Rendering with events:', events.length);

  if (events.length === 0) {
    return <EventListEmptyState onCreateEvent={onCreateEvent} />;
  }

  return (
    <div className="space-y-4">
      {onCreateEvent && (
        <div className="flex justify-end mb-4">
          <Button onClick={onCreateEvent}>
            Create New Event
          </Button>
        </div>
      )}
      
      {events.map((event) => (
        <EventCard
          key={event.id}
          event={event}
          onEditEvent={onEditEvent}
          onDeleteEvent={onDeleteEvent}
          onCreateEvent={onCreateEvent}
        />
      ))}
    </div>
  );
};

export default EventListView;
