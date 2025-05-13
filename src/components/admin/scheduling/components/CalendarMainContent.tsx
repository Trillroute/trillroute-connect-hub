
import React, { useState } from 'react';
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
  showFilterTabs?: boolean; // Added prop to control filter tabs visibility
}

const CalendarMainContent: React.FC<CalendarMainContentProps> = ({
  hasAdminAccess = false,
  userId,
  roleFilter,
  title,
  description,
  initialFilterType = null,
  showFilterTabs = true
}) => {
  const { viewMode, setViewMode, currentDate, setCurrentDate } = useCalendar();
  const [filterType, setFilterType] = useState<string | null>(initialFilterType);
  const [selectedFilter, setSelectedFilter] = useState<string | null>(null);
  const [selectedFilters, setSelectedFilters] = useState<string[]>(roleFilter || []);
  const [isCreateEventOpen, setIsCreateEventOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<CalendarEvent | null>(null);

  // Initialize event handlers
  const handleCreateEvent = () => {
    setIsCreateEventOpen(true);
  };

  const handleEditEvent = (event: CalendarEvent) => {
    setEditingEvent(event);
  };

  const handleDeleteEvent = (event: CalendarEvent) => {
    // Implement delete logic or use a hook
    console.log("Delete event:", event);
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
            // Handle create logic
            setIsCreateEventOpen(false);
            return Promise.resolve("");
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
            // Handle edit logic
            setEditingEvent(null);
            return Promise.resolve("");
          }}
          mode="edit"
        />
      )}
    </div>
  );
};

export default CalendarMainContent;
