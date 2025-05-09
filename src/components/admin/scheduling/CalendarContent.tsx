
import React from 'react';
import { CalendarProvider } from './context/CalendarContext';
import { FilteredEventsProvider } from './view-components/FilteredEventsProvider';
import CalendarMainContent from './components/CalendarMainContent';

const CalendarContent: React.FC = () => {
  return (
    <CalendarProvider>
      <FilteredEventsProvider>
        <div className="flex flex-col h-full">
          <CalendarMainContent />
        </div>
      </FilteredEventsProvider>
    </CalendarProvider>
  );
};

export default CalendarContent;
