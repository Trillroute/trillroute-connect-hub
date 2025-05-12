
import React from 'react';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import CalendarTitle from './components/CalendarTitle';
import ViewModeSelector, { ViewOption } from './components/ViewModeSelector';
import { useCalendar } from './context/CalendarContext';

interface CalendarHeaderProps {
  onCreateEvent: () => void;
}

const CalendarHeader: React.FC<CalendarHeaderProps> = ({ onCreateEvent }) => {
  const { viewMode, setViewMode, currentDate } = useCalendar();

  const viewOptions: ViewOption[] = [
    { value: 'day', label: 'Day View' },
    { value: 'week', label: 'Week View' },
    { value: 'month', label: 'Month View' },
    { value: 'list', label: 'List View' },
    { value: 'legacy', label: 'Legacy View' }
  ];
  
  const handleViewModeChange = (mode: string) => {
    console.log('Setting view mode from header:', mode);
    setViewMode(mode as 'day' | 'week' | 'month' | 'list' | 'legacy');
  };

  return (
    <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0 py-2">
      <CalendarTitle viewMode={viewMode} currentDate={currentDate} />
      
      <div className="flex items-center gap-2">
        <ViewModeSelector 
          viewMode={viewMode} 
          setViewMode={handleViewModeChange} 
          viewOptions={viewOptions}
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
