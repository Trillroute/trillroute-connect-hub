
import React from 'react';
import { Button } from '@/components/ui/button';

interface EventListEmptyStateProps {
  onCreateEvent?: () => void;
}

const EventListEmptyState: React.FC<EventListEmptyStateProps> = ({ onCreateEvent }) => {
  return (
    <div className="text-center py-8 text-gray-500">
      <p>No events to display</p>
      {onCreateEvent && (
        <Button 
          onClick={onCreateEvent} 
          className="mt-4"
          variant="outline"
        >
          Create New Event
        </Button>
      )}
    </div>
  );
};

export default EventListEmptyState;
