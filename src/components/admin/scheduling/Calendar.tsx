
import React, { useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { CalendarProvider, useCalendar } from './CalendarContext';
import { formatCalendarTitle, initializeSampleEvents } from './calendarUtils';
import CalendarHeader from './CalendarHeader';
import CalendarSidebar from './CalendarSidebar';
import WeekView from './WeekView';
import CreateEventDialog from './CreateEventDialog';

const CalendarContent: React.FC = () => {
  const { 
    currentDate, 
    viewMode, 
    events, 
    isCreateEventOpen,
    setEvents,
    setIsCreateEventOpen,
    handleCreateEvent
  } = useCalendar();
  
  const { toast } = useToast();
  
  // Initialize sample events
  useEffect(() => {
    setEvents(initializeSampleEvents());
  }, [setEvents]);
  
  // Format the calendar title based on current view and date
  const calendarTitle = formatCalendarTitle(currentDate, viewMode);

  return (
    <div className="flex flex-col h-full">
      {/* Main calendar header */}
      <CalendarHeader title={calendarTitle} />
      
      {/* Calendar body */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left sidebar */}
        <CalendarSidebar />
        
        {/* Calendar view */}
        <div className="flex-1 overflow-auto">
          <WeekView onCreateEvent={() => setIsCreateEventOpen(true)} />
        </div>
      </div>

      {/* Create event dialog */}
      <CreateEventDialog 
        open={isCreateEventOpen} 
        onOpenChange={setIsCreateEventOpen} 
        onSave={eventData => {
          handleCreateEvent(eventData);
          toast({
            title: "Event created",
            description: `"${eventData.title}" has been added to your schedule.`,
          });
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
