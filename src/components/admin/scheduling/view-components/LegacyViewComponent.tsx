
import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { LegacyViewProps } from './legacy-view/types';
import { useLegacyViewData } from './legacy-view/useLegacyViewData';
import LegacyViewHeader from './legacy-view/LegacyViewHeader';
import DayRow from './legacy-view/DayRow';

export const LegacyViewComponent: React.FC<LegacyViewProps> = ({
  onCreateEvent,
  onEditEvent,
  onDeleteEvent
}) => {
  const {
    daysOfWeek,
    timeSlotsByDay,
    expandedDays,
    displayMode,
    events,
    toggleDay,
    setDisplayMode
  } = useLegacyViewData();
  
  return (
    <div className="h-full flex flex-col">
      {/* Header has been simplified */}
      <LegacyViewHeader 
        displayMode={displayMode} 
        setDisplayMode={setDisplayMode} 
      />
      
      <ScrollArea className="flex-grow">
        <div className="min-w-[800px]">
          <div className="grid grid-cols-[120px_1fr] border-b bg-muted/30">
            <div className="p-3 font-medium">Day</div>
            <div className="p-3 font-medium text-center">Time Slots</div>
          </div>
          
          {daysOfWeek.map(day => (
            <DayRow
              key={day.index}
              day={day}
              timeSlotsByDay={timeSlotsByDay}
              expandedDays={expandedDays}
              toggleDay={toggleDay}
              events={events}
              onEditEvent={onEditEvent}
              onCreateEvent={onCreateEvent}
            />
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};
