
import React from 'react';
import { useCalendar } from '../context/CalendarContext';
import { CalendarEvent } from '../types';
import { EventListViewComponent } from './EventListViewComponent';

interface LegacyViewComponentProps {
  onCreateEvent?: () => void;
  onEditEvent?: (event: CalendarEvent) => void;
  onDeleteEvent?: (event: CalendarEvent) => void;
}

export const LegacyViewComponent: React.FC<LegacyViewComponentProps> = ({
  onCreateEvent,
  onEditEvent,
  onDeleteEvent
}) => {
  const { events } = useCalendar();
  
  return (
    <div className="h-full flex flex-col">
      <div className="p-4 bg-blue-50 border-b">
        <h3 className="font-medium text-blue-800">Legacy Calendar View</h3>
        <p className="text-sm text-muted-foreground">
          This is the legacy calendar view showing all events in list format. We recommend switching to the newer views for a better experience.
        </p>
      </div>
      
      <div className="flex-grow overflow-auto">
        <EventListViewComponent 
          onEditEvent={onEditEvent || (() => {})} 
          onDeleteEvent={onDeleteEvent || (() => {})} 
        />
      </div>
    </div>
  );
};
