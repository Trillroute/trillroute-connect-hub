
import React, { useState, useEffect } from 'react';
import CalendarHeader from './CalendarHeader';
import CalendarSidebar from './CalendarSidebar';
import EventListView from './EventListView';
import CalendarViewRenderer from './CalendarViewRenderer';
import CreateEventDialog from './CreateEventDialog';
import { useCalendar } from './context/CalendarContext';
import { supabase } from '@/integrations/supabase/client';

interface CalendarContentProps {
  hasAdminAccess?: boolean;
  userId?: string;
  userIds?: string[];
  roleFilter?: string[];
  courseId?: string;
  skillId?: string;
}

const CalendarContent: React.FC<CalendarContentProps> = ({ 
  hasAdminAccess = false,
  userId,
  userIds,
  roleFilter,
  courseId,
  skillId
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

  // Apply filters based on provided criteria
  useEffect(() => {
    const fetchFilteredEvents = async () => {
      try {
        // Start building the query
        let query = supabase.from('user_events').select(`
          *,
          custom_users!user_id (id, first_name, last_name, role)
        `);
        
        // Filter by specific user ID
        if (userId) {
          query = query.eq('user_id', userId);
        }
        
        // Filter by multiple user IDs
        if (userIds && userIds.length > 0) {
          query = query.in('user_id', userIds);
        }
        
        // Filter by course ID
        if (courseId) {
          query = query.ilike('description', `%course_id:${courseId}%`);
        }
        
        // Filter by skill ID
        if (skillId) {
          // Get users with this skill (using the new skills array column)
          const { data: skillUsers } = await supabase
            .from('custom_users')
            .select('id')
            .contains('skills', [skillId]);
            
          if (skillUsers && skillUsers.length > 0) {
            const skillUserIds = skillUsers.map(item => item.id);
            query = query.in('user_id', skillUserIds);
          } else {
            // No users have this skill, return empty events
            setEvents([]);
            return;
          }
        }
        
        // Fetch events
        const { data, error } = await query;
        
        if (error) {
          console.error("Error fetching filtered events:", error);
          setEvents([]);
          return;
        }
        
        // Further filter by role if needed
        let filteredData = data;
        if (roleFilter && roleFilter.length > 0) {
          filteredData = data.filter(event => {
            const userRole = event.custom_users?.role;
            return userRole && roleFilter.includes(userRole);
          });
        }
        
        // Map to calendar events format
        const mappedEvents = filteredData.map(event => {
          // Extract location from metadata if it's an object with a location property
          let locationValue = '';
          if (event.metadata && typeof event.metadata === 'object') {
            locationValue = event.metadata.location || '';
          }
          
          return {
            id: event.id,
            title: event.title,
            start: new Date(event.start_time),
            end: new Date(event.end_time),
            description: event.description,
            color: getRoleColor(event.custom_users?.role),
            location: locationValue
          };
        });
        
        // Update events in context
        setEvents(mappedEvents);
      } catch (err) {
        console.error("Failed to fetch filtered events:", err);
        setEvents([]);
      }
    };
    
    // Determine if we need to use filters or regular refresh
    if (userId || userIds?.length > 0 || roleFilter?.length > 0 || courseId || skillId) {
      fetchFilteredEvents();
    } else {
      // If no filters are applied, use the regular refresh
      refreshEvents();
    }
  }, [userId, userIds, roleFilter, courseId, skillId, setEvents, refreshEvents]);

  // Get color based on role
  const getRoleColor = (role?: string): string => {
    switch (role) {
      case 'teacher':
        return '#4f46e5'; // Indigo
      case 'admin':
        return '#0891b2'; // Cyan
      case 'student': 
        return '#16a34a'; // Green
      case 'superadmin':
        return '#9333ea'; // Purple
      default:
        return '#6b7280'; // Gray
    }
  };

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
