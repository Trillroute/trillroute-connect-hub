
import React, { ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { List, Plus, LayoutGrid } from 'lucide-react';

interface CalendarHeaderProps {
  title: ReactNode;
  showEventListToggle?: boolean;
  onToggleEventList?: () => void;
  isEventListShown?: boolean;
  hasAdminAccess?: boolean;
  onCreateEvent?: () => void;
}

const CalendarHeader: React.FC<CalendarHeaderProps> = ({
  title,
  showEventListToggle = false,
  onToggleEventList,
  isEventListShown = false,
  hasAdminAccess = false,
  onCreateEvent
}) => {
  return (
    <div className="flex items-center justify-between py-4 px-6 border-b">
      <div className="flex items-center space-x-2">
        {typeof title === 'string' ? <h2 className="text-xl font-semibold">{title}</h2> : title}
      </div>
      <div className="flex items-center gap-2">
        {showEventListToggle && onToggleEventList && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onToggleEventList}
            title={isEventListShown ? "Show Calendar" : "Show Event List"}
          >
            {isEventListShown ? <LayoutGrid className="h-4 w-4" /> : <List className="h-4 w-4" />}
            <span className="sr-only">
              {isEventListShown ? "Show Calendar" : "Show Event List"}
            </span>
          </Button>
        )}
        
        {hasAdminAccess && onCreateEvent && (
          <Button 
            size="sm" 
            onClick={onCreateEvent}
            className="gap-1 bg-primary text-white"
          >
            <Plus className="h-4 w-4" />
            Create Event
          </Button>
        )}
      </div>
    </div>
  );
};

export default CalendarHeader;
