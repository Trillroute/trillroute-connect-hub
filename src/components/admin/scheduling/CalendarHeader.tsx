
import React from 'react';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import CalendarTitle from './components/CalendarTitle';
import ViewModeSelector from './components/ViewModeSelector';
import { useCalendar } from './context/CalendarContext';
import { CalendarViewMode } from './context/calendarTypes';

interface CalendarHeaderProps {
  onCreateEvent: () => void;
}

const CalendarHeader: React.FC<CalendarHeaderProps> = ({ onCreateEvent }) => {
  const { viewMode, setViewMode, currentDate } = useCalendar();
  
  const handleViewModeChange = (mode: CalendarViewMode) => {
    console.log('Setting view mode from header:', mode);
    setViewMode(mode);
  };

  return (
    <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0 py-2">
      <CalendarTitle viewMode={viewMode} currentDate={currentDate} />
      
      <div className="flex items-center gap-2">
        <ViewModeSelector 
          viewMode={viewMode} 
          onViewModeChange={handleViewModeChange}
        />
        <Button 
          onClick={onCreateEvent}
          className="bg-primary text-white hover:bg-primary-darker"
        >
          <PlusCircle className="h-4 w-4 mr-1" />
          Add Event
        </Button>
      </div>
    </div>
  );
};

export default CalendarHeader;
