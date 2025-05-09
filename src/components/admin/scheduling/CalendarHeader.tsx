
import React from 'react';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import CalendarTitle from './components/CalendarTitle';
import ViewModeSelector from './components/ViewModeSelector';
import FilterDropdown from './components/FilterDropdown';
import { useCalendar } from './context/CalendarContext';

interface CalendarHeaderProps {
  onCreateEvent: () => void;
}

const CalendarHeader: React.FC<CalendarHeaderProps> = ({ onCreateEvent }) => {
  const { viewMode, setViewMode, currentDate } = useCalendar();

  return (
    <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0 py-2">
      <CalendarTitle viewMode={viewMode} currentDate={currentDate} />
      
      <div className="flex items-center gap-2">
        <FilterDropdown 
          filterOptions={[]} 
          selectedFilters={[]} 
          isLoading={false} 
          onChange={() => {}} 
          filterType="all"
        />
        <ViewModeSelector 
          viewMode={viewMode} 
          setViewMode={setViewMode} 
          viewOptions={['day', 'week', 'month', 'list']}
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
