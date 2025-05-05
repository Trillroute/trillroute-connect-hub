
import React, { useState, useEffect } from 'react';
import CalendarHeader from './CalendarHeader';
import CalendarSidebar from './CalendarSidebar';
import EventListView from './EventListView';
import CalendarViewRenderer from './CalendarViewRenderer';
import CreateEventDialog from './CreateEventDialog';
import { useCalendar } from './CalendarContext';
import { supabase } from '@/integrations/supabase/client';

interface CalendarContentProps {
  hasAdminAccess?: boolean;
  userId?: string;
  roleFilter?: string[];
}

const CalendarContent: React.FC<CalendarContentProps> = ({ 
  hasAdminAccess = false,
  userId,
  roleFilter
}) => {
  const [showEventList, setShowEventList] = useState(false);
  const { 
    currentDate, 
    viewMode, 
    isCreateEventOpen, 
    setIsCreateEventOpen, 
    handleCreateEvent,
    events,
    setEvents,
    refreshEvents
  } = useCalendar();

  // Apply filters based on userId and roleFilter
  useEffect(() => {
    if (userId || (roleFilter && roleFilter.length > 0)) {
      const fetchFilteredEvents = async () => {
        try {
          // Start building the query
          let query = supabase.from('user_events').select(`
            *,
            custom_users!user_id (first_name, last_name, role)
          `);
          
          // Filter by specific user if provided
          if (userId) {
            query = query.eq('user_id', userId);
          }
          
          // Fetch events
          const { data, error } = await query;
          
          if (error) {
            console.error("Error fetching filtered events:", error);
            return;
          }
          
          // Filter by role if needed
          let filteredData = data;
          if (roleFilter && roleFilter.length > 0) {
            filteredData = data.filter(event => {
              const userRole = event.custom_users?.role;
              return userRole && roleFilter.includes(userRole);
            });
          }
          
          // Map to calendar events format
          const mappedEvents = filteredData.map(event => ({
            id: event.id,
            title: event.title,
            start: new Date(event.start_time),
            end: new Date(event.end_time),
            description: event.description,
            color: event.custom_users?.role === 'teacher' ? '#4f46e5' : 
                   event.custom_users?.role === 'admin' ? '#0891b2' : 
                   event.custom_users?.role === 'student' ? '#16a34a' : 
                   event.custom_users?.role === 'superadmin' ? '#9333ea' : '#6b7280',
          }));
          
          // Update events in context
          setEvents(mappedEvents);
        } catch (err) {
          console.error("Failed to fetch filtered events:", err);
        }
      };
      
      fetchFilteredEvents();
    } else {
      // If no filters are applied, use the regular refresh
      refreshEvents();
    }
  }, [userId, roleFilter, setEvents, refreshEvents]);

  // Format title based on view mode and current date
  let title;
  const options = { month: 'long' as const, year: 'numeric' as const };
  
  switch (viewMode) {
    case 'day':
      title = currentDate.toLocaleDateString('en-US', {
        ...options,
        day: 'numeric' as const,
      });
      break;
    case 'week':
      title = `Week of ${currentDate.toLocaleDateString('en-US', {
        month: 'short' as const,
        day: 'numeric' as const,
      })}`;
      break;
    default:
      title = currentDate.toLocaleDateString('en-US', options);
  }

  // Handle event operations
  const handleCreateEventClick = () => {
    setIsCreateEventOpen(true);
  };

  const handleEditEvent = (event) => {
    console.log('Edit event:', event);
    // Will be implemented in a future feature
  };

  const handleDeleteEvent = (event) => {
    console.log('Delete event:', event);
    // Will be implemented in a future feature
  };

  const handleDateClick = (date) => {
    console.log('Date clicked:', date);
    // Will be implemented in a future feature
  };

  // Handle dialog close
  const handleCloseCreateDialog = () => {
    setIsCreateEventOpen(false);
  };

  // Handle save event
  const handleSaveEvent = (eventData) => {
    handleCreateEvent(eventData);
    setIsCreateEventOpen(false);
  };

  return (
    <div className="flex flex-col h-full">
      <CalendarHeader 
        title={title}
        showEventListToggle={true}
        onToggleEventList={() => setShowEventList(!showEventList)}
        isEventListShown={showEventList}
        hasAdminAccess={hasAdminAccess}
      />
      
      <div className="flex flex-1 overflow-hidden">
        <CalendarSidebar />
        
        <div className="flex-1 overflow-auto">
          {showEventList ? (
            <EventListView 
              onEditEvent={handleEditEvent}
              onDeleteEvent={handleDeleteEvent}
            />
          ) : (
            <CalendarViewRenderer 
              viewMode={viewMode}
              showEventList={showEventList}
              onCreateEvent={handleCreateEventClick}
              onEditEvent={handleEditEvent}
              onDeleteEvent={handleDeleteEvent}
              onDateClick={handleDateClick}
            />
          )}
        </div>
      </div>
      
      {isCreateEventOpen && (
        <CreateEventDialog
          open={isCreateEventOpen}
          onOpenChange={handleCloseCreateDialog}
          onSave={handleSaveEvent}
          startDate={currentDate}
        />
      )}
    </div>
  );
};

export default CalendarContent;
