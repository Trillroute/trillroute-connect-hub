
import React, { useState } from 'react';
import { CalendarHeader } from './CalendarHeader';
import { ViewSelector } from './view-components/ViewSelector';
import { CreateEventDialog } from './CreateEventDialog';
import { EventFormDialog } from './EventFormDialog';
import { DeleteEventDialog } from './dialogs/DeleteEventDialog';
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
  const { currentView } = useCalendar();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<CalendarEvent | null>(null);
  const [deletingEvent, setDeletingEvent] = useState<CalendarEvent | null>(null);

  const handleEditEvent = (event: CalendarEvent) => {
    setEditingEvent(event);
  };

  const handleDeleteEvent = (event: CalendarEvent) => {
    setDeletingEvent(event);
  };

  const handleCreateEvent = () => {
    setIsCreateDialogOpen(true);
  };

  return (
    <div className="flex flex-col h-full">
      <CalendarHeader onCreateEvent={handleCreateEvent} />
      
      <div className="flex-1 overflow-hidden">
        <ViewSelector
          currentView={currentView}
          onEditEvent={handleEditEvent}
          onDeleteEvent={handleDeleteEvent}
          onCreateEvent={handleCreateEvent}
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
      />

      <EventFormDialog
        event={editingEvent}
        open={!!editingEvent}
        onOpenChange={(open) => {
          if (!open) setEditingEvent(null);
        }}
      />

      <DeleteEventDialog
        event={deletingEvent}
        open={!!deletingEvent}
        onOpenChange={(open) => {
          if (!open) setDeletingEvent(null);
        }}
      />
    </div>
  );
};
