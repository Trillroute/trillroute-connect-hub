
import React from 'react';
import { useToast } from '@/hooks/use-toast';
import { CalendarProvider, useCalendar } from './CalendarContext';
import { formatCalendarTitle } from './calendarUtils';
import CalendarHeader from './CalendarHeader';
import CalendarSidebar from './CalendarSidebar';
import WeekView from './WeekView';
import CreateEventDialog from './CreateEventDialog';
import { Loader2 } from 'lucide-react';

const CalendarContent: React.FC = () => {
  const { 
    currentDate, 
    viewMode, 
    isCreateEventOpen,
    isLoading,
    setIsCreateEventOpen,
    handleCreateEvent
  } = useCalendar();
  
  const { toast } = useToast();
  
  // Format the calendar title based on current view and date
  const calendarTitle = formatCalendarTitle(currentDate, viewMode);

  return (
    <div className="flex flex-col h-full relative">
      {/* Main calendar header */}
      <CalendarHeader title={calendarTitle} />
      
      {/* Calendar body */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left sidebar */}
        <CalendarSidebar />
        
        {/* Calendar view */}
        <div className="flex-1 overflow-auto">
          {isLoading && (
            <div className="absolute inset-0 bg-white/50 flex items-center justify-center z-10">
              <Loader2 className="h-8 w-8 text-primary animate-spin" />
            </div>
          )}
          <WeekView onCreateEvent={() => setIsCreateEventOpen(true)} />
        </div>
      </div>

      {/* Create event dialog */}
      <CreateEventDialog 
        open={isCreateEventOpen} 
        onOpenChange={setIsCreateEventOpen} 
        onSave={eventData => {
          handleCreateEvent(eventData);
        }}
        startDate={currentDate}
      />
    </div>
  );
};

const SchedulingCalendar: React.FC = () => {
  return (
    <CalendarProvider>
      <CalendarContent />
    </CalendarProvider>
  );
};

export default SchedulingCalendar;
