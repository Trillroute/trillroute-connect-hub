
import React from 'react';
import { Button } from '@/components/ui/button';
import { CalendarViewMode } from '../types';
import { Calendar, CalendarDays, Columns, ListFilter, CalendarClock } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ViewSelectorProps {
  activeView: CalendarViewMode;
  onViewChange: (view: CalendarViewMode) => void;
  className?: string;
}

const ViewSelector: React.FC<ViewSelectorProps> = ({
  activeView,
  onViewChange,
  className
}) => {
  return (
    <div className={cn("flex items-center space-x-1 bg-muted rounded-md p-1", className)}>
      <Button
        variant={activeView === 'day' ? "secondary" : "ghost"}
        size="sm"
        onClick={() => onViewChange('day')}
        className="px-2.5"
      >
        <Calendar className="h-4 w-4 mr-1" />
        Day
      </Button>
      <Button
        variant={activeView === 'week' ? "secondary" : "ghost"}
        size="sm"
        onClick={() => onViewChange('week')}
        className="px-2.5"
      >
        <Columns className="h-4 w-4 mr-1" />
        Week
      </Button>
      <Button
        variant={activeView === 'month' ? "secondary" : "ghost"}
        size="sm"
        onClick={() => onViewChange('month')}
        className="px-2.5"
      >
        <CalendarDays className="h-4 w-4 mr-1" />
        Month
      </Button>
      <Button
        variant={activeView === 'list' ? "secondary" : "ghost"}
        size="sm"
        onClick={() => onViewChange('list')}
        className="px-2.5"
      >
        <ListFilter className="h-4 w-4 mr-1" />
        List
      </Button>
      <Button
        variant={activeView === 'legacy' ? "secondary" : "ghost"}
        size="sm"
        onClick={() => onViewChange('legacy')}
        className="px-2.5"
      >
        <CalendarClock className="h-4 w-4 mr-1" />
        Legacy
      </Button>
    </div>
  );
};

export default ViewSelector;
