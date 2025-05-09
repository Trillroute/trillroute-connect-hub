
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import ViewModeSelector from './components/ViewModeSelector';
import { CalendarViewMode } from './context/calendarTypes';
import { useCalendar } from './context/CalendarContext';
import FilterSelector from './components/FilterSelector';
import { PlusIcon } from 'lucide-react';

interface CalendarHeaderProps {
  onCreateEvent?: () => void;
}

const CalendarHeader: React.FC<CalendarHeaderProps> = ({ onCreateEvent }) => {
  const { viewMode, setViewMode, goToToday, goToPrevious, goToNext } = useCalendar();
  const [filterType, setFilterType] = useState<string | null>('unit');
  const [selectedFilter, setSelectedFilter] = useState<string | null>(null);
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);

  const handleViewModeChange = (mode: CalendarViewMode) => {
    setViewMode(mode);
  };

  return (
    <div className="flex flex-col space-y-4">
      <div className="flex justify-between items-center flex-wrap gap-2">
        <div className="flex space-x-2">
          <Button variant="outline" onClick={goToPrevious}>Previous</Button>
          <Button variant="outline" onClick={goToToday}>Today</Button>
          <Button variant="outline" onClick={goToNext}>Next</Button>
        </div>
        
        <ViewModeSelector viewMode={viewMode} onChange={handleViewModeChange} />
        
        {onCreateEvent && (
          <Button onClick={onCreateEvent}>
            <PlusIcon className="h-4 w-4 mr-2" />
            Create Event
          </Button>
        )}
      </div>
      
      <div className="flex flex-wrap gap-2 items-center">
        <div className="w-full md:w-64">
          <FilterSelector
            filterType={filterType}
            setFilterType={setFilterType}
            selectedFilter={selectedFilter}
            setSelectedFilter={setSelectedFilter}
            selectedFilters={selectedFilters}
            setSelectedFilters={setSelectedFilters}
            showFilterTypeTabs={false}
            showFilterDropdown={true}
          />
        </div>
      </div>
    </div>
  );
};

export default CalendarHeader;
