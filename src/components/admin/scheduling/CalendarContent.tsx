
import React, { useState } from 'react';
import CalendarHeader from './CalendarHeader';
import { ViewSelector } from './view-components/ViewSelector';
import CreateEventDialog from './CreateEventDialog';
import EventFormDialog from './EventFormDialog';
import DeleteEventDialog from './dialogs/DeleteEventDialog';
import { CalendarEvent } from './context/calendarTypes';
import { useCalendar } from './context/CalendarContext';

interface CalendarContentProps {
  filterType?: 'course' | 'skill' | 'teacher' | 'student' | 'admin' | 'staff' | null;
  filterId?: string | null;
  filterIds?: string[];
  filters?: { users: string[]; courses: string[]; skills: string[] };
}

export const CalendarContent: React.FC<CalendarContentProps> = ({
  filterType,
  filterId,
  filterIds,
  filters
}) => {
  const { viewMode, handleCreateEvent, handleUpdateEvent, handleDeleteEvent } = useCalendar();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<CalendarEvent | null>(null);
  const [deletingEvent, setDeletingEvent] = useState<CalendarEvent | null>(null);

  const handleEditEvent = (event: CalendarEvent) => {
    setEditingEvent(event);
  };

  const handleDeleteEventClick = (event: CalendarEvent) => {
    setDeletingEvent(event);
  };

  const handleCreateEventClick = () => {
    setIsCreateDialogOpen(true);
  };

  const handleDateClick = (date: Date) => {
    // Handle date click for month view
    console.log('Date clicked:', date);
  };

  const handleSaveEvent = async (eventData: Omit<CalendarEvent, 'id'>) => {
    try {
      await handleCreateEvent(eventData);
      setIsCreateDialogOpen(false);
    } catch (error) {
      console.error('Error creating event:', error);
    }
  };

  const handleUpdateEventSave = async (eventData: Omit<CalendarEvent, 'id'>) => {
    if (editingEvent) {
      try {
        // Fix: Pass event ID and data separately
        await handleUpdateEvent(editingEvent.id, eventData);
        setEditingEvent(null);
      } catch (error) {
        console.error('Error updating event:', error);
      }
    }
  };

  const handleConfirmDelete = async () => {
    if (deletingEvent) {
      try {
        // Fix: Pass event ID instead of entire event object
        await handleDeleteEvent(deletingEvent.id);
        setDeletingEvent(null);
      } catch (error) {
        console.error('Error deleting event:', error);
      }
    }
  };

  return (
    <div className="flex flex-col h-full">
      <CalendarHeader onCreateEvent={handleCreateEventClick} />
      
      <div className="flex-1 overflow-hidden">
        <ViewSelector
          currentView={viewMode}
          onEditEvent={handleEditEvent}
          onDeleteEvent={handleDeleteEventClick}
          onCreateEvent={handleCreateEventClick}
          onDateClick={handleDateClick}
          showAvailability={true}
          filterType={filterType}
          filterId={filterId}
          filterIds={filterIds}
          filters={filters}
        />
      </div>

      <CreateEventDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        onSave={handleSaveEvent}
      />

      <EventFormDialog
        open={!!editingEvent}
        onOpenChange={(open) => {
          if (!open) setEditingEvent(null);
        }}
        onSave={handleUpdateEventSave}
        initialEvent={editingEvent ? { ...editingEvent } : undefined}
        mode="edit"
      />

      <DeleteEventDialog
        isOpen={!!deletingEvent}
        onOpenChange={(open) => {
          if (!open) setDeletingEvent(null);
        }}
        selectedEvent={deletingEvent}
        onConfirmDelete={handleConfirmDelete}
      />
    </div>
  );
};
