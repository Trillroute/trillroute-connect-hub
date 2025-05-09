import React from 'react';
import { CalendarEvent } from '../context/calendarTypes';
import { useCalendar } from '../context/CalendarContext';
import { useFilteredEvents } from './FilteredEventsProvider';
import { format, startOfWeek, endOfWeek, eachDayOfInterval, addDays, isSameDay } from 'date-fns';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { WeeklyTimeGrid } from './WeeklyTimeGrid';
import { WeeklyHeader } from './WeeklyHeader';
import { EventPopover } from './EventPopover';
import { useEventActions } from '../hooks/useEventActions';
import FilterSelector from '../components/FilterSelector';

interface WeekViewComponentProps {
  onCreateEvent: () => void;
  onEditEvent: (event: CalendarEvent) => void;
  onDeleteEvent: (event: CalendarEvent) => void;
  onDateClick: (date: Date) => void;
  showFilterTabs?: boolean;
}

export const WeekViewComponent: React.FC<WeekViewComponentProps> = ({ 
  onCreateEvent, 
  onEditEvent, 
  onDeleteEvent, 
  onDateClick,
  showFilterTabs = true
}) => {
  const { currentDate, setCurrentDate, viewMode } = useCalendar();
  const { filteredEvents, filterType, setFilterType, selectedFilter, setSelectedFilter } = useFilteredEvents();
  const { handleEventClick } = useEventActions({ onEditEvent, onDeleteEvent });
  
  // Get the start and end of the week for the current date
  const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 }); // Start on Monday
  const weekEnd = endOfWeek(currentDate, { weekStartsOn: 1 }); // End on Sunday
  
  // Get all days in the week
  const daysInWeek = eachDayOfInterval({ start: weekStart, end: weekEnd });
  
  // Navigate to previous week
  const goToPreviousWeek = () => {
    setCurrentDate(addDays(currentDate, -7));
  };
  
  // Navigate to next week
  const goToNextWeek = () => {
    setCurrentDate(addDays(currentDate, 7));
  };
  
  // Navigate to today
  const goToToday = () => {
    setCurrentDate(new Date());
  };
  
  return (
    <div className="flex flex-col h-full">
      {showFilterTabs && (
        <div className="p-2 border-b">
          <FilterSelector
            filterType={filterType}
            setFilterType={setFilterType}
            selectedFilter={selectedFilter}
            setSelectedFilter={setSelectedFilter}
          />
        </div>
      )}
      
      <div className="flex justify-between items-center p-2 border-b">
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" onClick={goToToday}>
            Today
          </Button>
          <Button variant="outline" size="sm" onClick={goToPreviousWeek}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={goToNextWeek}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
        <h3 className="text-lg font-semibold">
          {format(weekStart, 'MMM d')} - {format(weekEnd, 'MMM d, yyyy')}
        </h3>
      </div>
      
      <div className="flex-grow overflow-auto">
        <div className="flex flex-col h-full">
          <WeeklyHeader 
            daysInWeek={daysInWeek} 
            currentDate={currentDate} 
          />
          <WeeklyTimeGrid 
            daysInWeek={daysInWeek}
            events={filteredEvents}
            onEventClick={handleEventClick}
            onCreateEvent={onCreateEvent}
            onDateClick={onDateClick}
          />
        </div>
      </div>
      
      <EventPopover />
    </div>
  );
};
