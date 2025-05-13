
import React, { useState, useEffect } from 'react';
import { useCalendar } from '../context/CalendarContext';
import FilterSelector from './FilterSelector';
import { CalendarEvent, CalendarViewMode } from '../context/calendarTypes';
import ViewModeSelector from './ViewModeSelector';
import { ViewSelector } from '../view-components/ViewSelector';
import EventFormDialog from '../EventFormDialog';
import { useCreateEvent } from '../hooks/useCreateEvent';
import { useUpdateEvent } from '../hooks/useUpdateEvent';
import { useDeleteEvent } from '../hooks/useDeleteEvent';

interface CalendarMainContentProps {
  hasAdminAccess?: boolean;
  userId?: string;
  roleFilter?: string[];
  title?: string;
  description?: string;
  initialFilterType?: 'role' | 'course' | 'skill' | 'teacher' | 'student' | 'admin' | 'staff' | null;
  showFilterTabs?: boolean;
  initialViewMode?: CalendarViewMode;
}

const CalendarMainContent: React.FC<CalendarMainContentProps> = ({
  userId,
  roleFilter,
  title,
  description,
  initialFilterType = null,
  showFilterTabs = true,
  hasAdminAccess = false,
  initialViewMode = 'week'
}) => {
  const { viewMode, setViewMode, currentDate, setCurrentDate, refreshEvents } = useCalendar();
  const [filterType, setFilterType] = useState<string | null>(initialFilterType);
  const [selectedFilter, setSelectedFilter] = useState<string | null>(null);
  const [selectedFilters, setSelectedFilters] = useState<string[]>(roleFilter || []);
  const [isCreateEventOpen, setIsCreateEventOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<CalendarEvent | null>(null);
  
  // Use the hooks for event operations
  const { createEvent } = useCreateEvent();
  const { updateEvent } = useUpdateEvent();
  const { deleteEvent } = useDeleteEvent();

  // Set initial view mode when component mounts
  useEffect(() => {
    console.log('CalendarMainContent: Setting initial viewMode to:', initialViewMode);
    setViewMode(initialViewMode);
  }, [initialViewMode, setViewMode]);

  // Force data refresh when component mounts or view changes
  useEffect(() => {
    console.log('CalendarMainContent: Refreshing data on viewMode change:', viewMode);
    refreshEvents();
  }, [viewMode, refreshEvents]);

  // Initialize event handlers
  const handleCreateEvent = () => {
    setIsCreateEventOpen(true);
  };

  const handleEditEvent = (event: CalendarEvent) => {
    setEditingEvent(event);
  };

  const handleDeleteEvent = (event: CalendarEvent) => {
    if (confirm(`Are you sure you want to delete "${event.title}"?`)) {
      deleteEvent(event.id);
    }
  };

  const handleDateClick = (date: Date) => {
    setCurrentDate(date);
    if (viewMode === 'month') {
      setViewMode('day');
    }
  };

  // Handler for view mode changes
  const handleViewModeChange = (mode: CalendarViewMode) => {
    console.log('Changing view mode to:', mode);
    setViewMode(mode);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Top controls */}
      <div className="flex justify-between items-center mb-4 px-2 gap-3">
        {showFilterTabs && (
          <FilterSelector
            filterType={filterType}
            setFilterType={setFilterType}
            selectedFilter={selectedFilter}
            setSelectedFilter={setSelectedFilter}
            selectedFilters={selectedFilters}
            setSelectedFilters={setSelectedFilters}
          />
        )}
        <ViewModeSelector
          viewMode={viewMode}
          onViewModeChange={handleViewModeChange}
        />
      </div>

      {/* Calendar view content */}
      <div className="flex-1 overflow-hidden border rounded-md">
        <ViewSelector
          viewMode={viewMode}
          onCreateEvent={handleCreateEvent}
          onEditEvent={handleEditEvent}
          onDeleteEvent={handleDeleteEvent}
          onDateClick={handleDateClick}
        />
      </div>

      {/* Event dialogs */}
      {isCreateEventOpen && (
        <EventFormDialog
          open={isCreateEventOpen}
          onOpenChange={setIsCreateEventOpen}
          onSave={(eventData) => {
            return createEvent(eventData);
          }}
          mode="create"
        />
      )}

      {editingEvent && (
        <EventFormDialog
          open={!!editingEvent}
          onOpenChange={(open) => !open && setEditingEvent(null)}
          initialEvent={editingEvent}
          onSave={(eventData) => {
            return updateEvent(editingEvent.id, eventData).then(
              success => success ? editingEvent.id : null
            );
          }}
          mode="edit"
        />
      )}
    </div>
  );
};

export default CalendarMainContent;
