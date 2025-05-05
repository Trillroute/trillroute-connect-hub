
import React, { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { CalendarProvider, useCalendar } from './CalendarContext';
import { formatCalendarTitle } from './calendarUtils';
import CalendarHeader from './CalendarHeader';
import CalendarSidebar from './CalendarSidebar';
import WeekView from './WeekView';
import DayView from './DayView';
import MonthView from './MonthView';
import EventListView from './EventListView';
import CreateEventDialog from './CreateEventDialog';
import { CalendarEvent } from './types';
import { Loader2 } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import EventFormDialog from './EventFormDialog';

const CalendarContent: React.FC = () => {
  const { 
    currentDate, 
    viewMode, 
    isCreateEventOpen,
    isLoading,
    setIsCreateEventOpen,
    handleCreateEvent,
    setCurrentDate,
    setViewMode,
    handleUpdateEvent,
    handleDeleteEvent
  } = useCalendar();
  
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [showEventList, setShowEventList] = useState(false);
  
  // Format the calendar title based on current view and date
  const calendarTitle = formatCalendarTitle(currentDate, viewMode);

  const handleEditEvent = (event: CalendarEvent) => {
    setSelectedEvent(event);
    setIsEditDialogOpen(true);
  };

  const handleDeleteEventClick = (event: CalendarEvent) => {
    setSelectedEvent(event);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (selectedEvent) {
      handleDeleteEvent(selectedEvent.id);
    }
    setIsDeleteDialogOpen(false);
    setSelectedEvent(null);
  };

  const handleSaveEdit = (eventData: Omit<CalendarEvent, 'id'>) => {
    if (selectedEvent) {
      handleUpdateEvent(selectedEvent.id, eventData);
    }
    setIsEditDialogOpen(false);
  };

  const handleDateClick = (date: Date) => {
    setCurrentDate(date);
    if (viewMode === 'month') {
      // Switch to day view when clicking on a date in month view
      setViewMode('day');
      setShowEventList(true); // Use list view by default
    }
  };

  const toggleEventList = () => {
    setShowEventList(!showEventList);
  };

  return (
    <div className="flex flex-col h-full relative">
      {/* Main calendar header */}
      <CalendarHeader 
        title={calendarTitle} 
        showEventListToggle={viewMode === 'day'}
        onToggleEventList={toggleEventList}
        isEventListShown={showEventList}
      />
      
      {/* Calendar body */}
      <div className="flex flex-1">
        {/* Left sidebar */}
        <CalendarSidebar />
        
        {/* Calendar view */}
        <div className="flex-1">
          {isLoading && (
            <div className="absolute inset-0 bg-white/50 flex items-center justify-center z-10">
              <Loader2 className="h-8 w-8 text-primary animate-spin" />
            </div>
          )}
          
          {/* Render appropriate view based on viewMode */}
          {viewMode === 'week' && (
            <WeekView onCreateEvent={() => setIsCreateEventOpen(true)} />
          )}
          
          {viewMode === 'day' && (
            showEventList ? (
              <EventListView 
                onEditEvent={handleEditEvent}
                onDeleteEvent={handleDeleteEventClick}
              />
            ) : (
              <DayView 
                onCreateEvent={() => setIsCreateEventOpen(true)}
                onEditEvent={handleEditEvent}
                onDeleteEvent={handleDeleteEventClick}
              />
            )
          )}
          
          {viewMode === 'month' && (
            <MonthView onDateClick={handleDateClick} />
          )}
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

      {/* Edit Event Dialog */}
      {selectedEvent && (
        <EventFormDialog
          open={isEditDialogOpen}
          onOpenChange={setIsEditDialogOpen}
          onSave={handleSaveEdit}
          initialEvent={{
            title: selectedEvent.title,
            description: selectedEvent.description,
            location: selectedEvent.location,
            start: selectedEvent.start,
            end: selectedEvent.end,
            color: selectedEvent.color || '#4285F4'
          }}
          mode="edit"
        />
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Event</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{selectedEvent?.title}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              className="bg-red-600 hover:bg-red-700"
              onClick={confirmDelete}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
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
