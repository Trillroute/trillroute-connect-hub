
import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import ViewModeSelector from './components/ViewModeSelector';
import { useCalendar } from './context/CalendarContext';
import CalendarTitle from './components/CalendarTitle';

interface CalendarHeaderProps {
  onCreateEvent?: () => void;
}

const CalendarHeader: React.FC<CalendarHeaderProps> = ({ onCreateEvent }) => {
  const { 
    viewMode,
    currentDate,
    goToToday,
    goToPrevious,
    goToNext,
    setViewMode
  } = useCalendar();

  return (
    <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0 py-2">
      {/* Use the CalendarTitle component correctly */}
      <CalendarTitle />
      
      <div className="flex items-center gap-2">
        <ViewModeSelector 
          value={viewMode} 
          onChange={setViewMode} 
        />
        
        <div className="flex items-center gap-1 ml-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={goToPrevious}
          >
            Previous
          </Button>
          
          <Button 
            variant="outline" 
            size="sm" 
            onClick={goToToday}
          >
            Today
          </Button>
          
          <Button 
            variant="outline" 
            size="sm"
            onClick={goToNext}
          >
            Next
          </Button>
        </div>
        
        {onCreateEvent && (
          <Button 
            onClick={onCreateEvent}
            size="sm"
            className="ml-2"
          >
            <Plus className="h-4 w-4 mr-1" />
            Add Event
          </Button>
        )}
      </div>
    </div>
  );
};

export default CalendarHeader;
