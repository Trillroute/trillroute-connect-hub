
import React, { ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { ViewList, Plus, LayoutGrid } from 'lucide-react';

interface CalendarHeaderProps {
  title: ReactNode; // Changed from string to ReactNode to accept elements
  showEventListToggle?: boolean;
  onToggleEventList?: () => void;
  isEventListShown?: boolean;
  hasAdminAccess?: boolean;
}

const CalendarHeader: React.FC<CalendarHeaderProps> = ({
  title,
  showEventListToggle = false,
  onToggleEventList,
  isEventListShown = false,
  hasAdminAccess = false
}) => {
  return (
    <div className="flex items-center justify-between py-2 px-4 border-b">
      <div className="flex items-center space-x-2">
        {typeof title === 'string' ? <h2 className="text-lg font-semibold">{title}</h2> : title}
      </div>
      <div className="flex items-center space-x-2">
        {showEventListToggle && onToggleEventList && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onToggleEventList}
            title={isEventListShown ? "Show Calendar" : "Show Event List"}
          >
            {isEventListShown ? <LayoutGrid className="h-4 w-4" /> : <ViewList className="h-4 w-4" />}
            <span className="sr-only">
              {isEventListShown ? "Show Calendar" : "Show Event List"}
            </span>
          </Button>
        )}
        
        {hasAdminAccess && (
          <Button 
            size="sm" 
            onClick={() => {}} 
            variant="outline"
            className="ml-2"
          >
            <Plus className="h-4 w-4 mr-1" />
            Create Event
          </Button>
        )}
      </div>
    </div>
  );
};

export default CalendarHeader;
