
import React, { useState, useEffect } from 'react';
import { Calendar as CalendarIcon } from "lucide-react";

import { Calendar } from "@/components/ui/calendar"
import { cn } from "@/lib/utils"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { addDays, format } from 'date-fns';
import CalendarContext from './context/CalendarContext';
import { CalendarEvent } from './context/calendarTypes';
import { FilteredEventsProvider } from './view-components/FilteredEventsProvider';
import CalendarHeader from './CalendarHeader';
import DayView from './DayView';
import { EventListViewComponent } from './view-components/EventListViewComponent';
import { useToast } from '@/hooks/use-toast';

interface FilteredCalendarProps {
  filterType?: 'course' | 'skill' | 'teacher' | 'student' | 'admin' | 'staff' | null;
  filterValues?: string[];
  filterId?: string | null;
  title?: string;
  hasAdminAccess?: boolean;
  showAvailability?: boolean; // New prop to control availability display
}

const FilteredCalendar: React.FC<FilteredCalendarProps> = ({
  filterType,
  filterValues,
  filterId,
  title,
  hasAdminAccess = false,
  showAvailability = true, // Default to showing availability
}) => {
  const [date, setDate] = React.useState<Date>(new Date())
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [isDayView, setIsDayView] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [isEventDialogOpen, setIsEventDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const { toast } = useToast();

  const filterIds = filterValues || (filterId ? [filterId] : []);

  const handleAddEvent = (event: CalendarEvent) => {
    setEvents(prevEvents => [...prevEvents, event]);
    toast({
      title: 'Event Added',
      description: `${event.title} has been added to the calendar.`,
    });
  };

  const handleEditEvent = (event: CalendarEvent) => {
    setSelectedEvent(event);
    setIsEventDialogOpen(true);
  };

  const handleDeleteEvent = (event: CalendarEvent) => {
    setSelectedEvent(event);
    setIsDeleteDialogOpen(true);
  };

  const handleUpdateEvent = (updatedEvent: CalendarEvent) => {
    setEvents(prevEvents =>
      prevEvents.map(event =>
        event.id === updatedEvent.id ? updatedEvent : event
      )
    );
    toast({
      title: 'Event Updated',
      description: `${updatedEvent.title} has been updated.`,
    });
    setIsEventDialogOpen(false);
  };

  const handleConfirmDelete = () => {
    if (selectedEvent) {
      setEvents(prevEvents =>
        prevEvents.filter(event => event.id !== selectedEvent.id)
      );
      toast({
        title: 'Event Deleted',
        description: `${selectedEvent.title} has been deleted.`,
      });
      setIsDeleteDialogOpen(false);
    }
  };

  // Creating wrapper functions that match the expected Promise<void> return types
  const handleCreateEventPromise = async (id: string): Promise<void> => {
    // Implementation differs but ensures Promise<void> return type
    console.log("Creating event with ID:", id);
    return Promise.resolve();
  };
  
  const handleUpdateEventPromise = async (id: string, event: any): Promise<void> => {
    // Implementation differs but ensures Promise<void> return type
    console.log("Updating event with ID:", id, event);
    return Promise.resolve();
  };
  
  const handleDeleteEventPromise = async (id: string): Promise<void> => {
    // Implementation differs but ensures Promise<void> return type
    console.log("Deleting event with ID:", id);
    return Promise.resolve();
  };
  
  return (
    <CalendarContext.Provider 
      value={{
        currentDate: date,
        viewMode: isDayView ? 'day' : 'list',
        events,
        setEvents,
        isCreateEventOpen: isEventDialogOpen,
        setIsCreateEventOpen: setIsEventDialogOpen,
        isLoading: false,
        activeLayers: [],
        selectedUsers: [],
        availabilities: {},
        setCurrentDate: setDate,
        setViewMode: (mode) => setIsDayView(mode === 'day'),
        toggleLayer: () => {},
        toggleUser: () => {},
        goToToday: () => setDate(new Date()),
        goToPrevious: () => {},
        goToNext: () => {},
        handleCreateEvent: handleCreateEventPromise,
        handleUpdateEvent: handleUpdateEventPromise,
        handleDeleteEvent: handleDeleteEventPromise,
        handleDateSelect: () => {},
        refreshEvents: async () => {},
        filterEventsByRole: () => {},
        filterEventsByUser: () => {},
        setActiveLayers: () => {},
        setSelectedUsers: () => {},
        setAvailabilities: () => {},
        showAvailability
      }}
    >
      <FilteredEventsProvider
        filterType={filterType}
        filterId={filterId}
        filterIds={filterIds}
      >
        <div className="flex flex-col h-full">
          <CalendarHeader onCreateEvent={() => setIsEventDialogOpen(true)} />
          <div className="flex flex-1 overflow-hidden">
            {isDayView ? (
              <DayView />
            ) : (
              <EventListViewComponent
                onEditEvent={handleEditEvent}
                onDeleteEvent={handleDeleteEvent}
              />
            )}
          </div>
        </div>
      </FilteredEventsProvider>
    </CalendarContext.Provider>
  );
};

export default FilteredCalendar;
