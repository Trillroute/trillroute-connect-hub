
import React from 'react';
import { CalendarEvent } from './context/calendarTypes';
import WeekView from './WeekView';
import DayView from './DayView';
import MonthView from './MonthView';
import EventListView from './EventListView';
import { useAuth } from '@/hooks/useAuth';
import { useEffect } from 'react';
import { useCalendar } from './context/CalendarContext';

interface CalendarViewRendererProps {
  viewMode: 'day' | 'week' | 'month';
  showEventList: boolean;
  onCreateEvent: () => void;
  onEditEvent: (event: CalendarEvent) => void;
  onDeleteEvent: (event: CalendarEvent) => void;
  onDateClick: (date: Date) => void;
  filterType?: 'course' | 'skill' | 'teacher' | 'student' | null;
  filterId?: string | null;
}

const CalendarViewRenderer: React.FC<CalendarViewRendererProps> = ({
  viewMode,
  showEventList,
  onCreateEvent,
  onEditEvent,
  onDeleteEvent,
  onDateClick,
  filterType,
  filterId
}) => {
  const { role } = useAuth();
  const { refreshEvents, setEvents } = useCalendar();
  const isAdminOrHigher = role === 'admin' || role === 'superadmin';
  
  // Apply filters when filter type or ID changes
  useEffect(() => {
    if (!filterType || !filterId) {
      refreshEvents();
      return;
    }

    // Import and use the event filtering utility
    const { fetchFilteredEvents } = require('./utils/eventProcessing');
    
    // Apply the appropriate filter
    const applyFilter = async () => {
      switch (filterType) {
        case 'course':
          await fetchFilteredEvents({ courseId: filterId, setEvents });
          break;
        case 'skill':
          await fetchFilteredEvents({ skillId: filterId, setEvents });
          break;
        case 'teacher':
          await fetchFilteredEvents({ 
            roleFilter: ['teacher'],
            userId: filterId,
            setEvents 
          });
          break;
        case 'student':
          await fetchFilteredEvents({ 
            roleFilter: ['student'],
            userId: filterId,
            setEvents 
          });
          break;
        default:
          refreshEvents();
      }
    };

    applyFilter();
  }, [filterType, filterId, refreshEvents, setEvents]);
  
  // Always show the event list if showEventList is true, regardless of view mode
  if (showEventList) {
    return (
      <div className="h-full overflow-auto">
        <EventListView 
          onEditEvent={onEditEvent}
          onDeleteEvent={onDeleteEvent}
        />
      </div>
    );
  }
  
  // Otherwise, show the regular calendar view based on viewMode
  switch (viewMode) {
    case 'week':
      return (
        <div className="h-full overflow-auto">
          <WeekView 
            onCreateEvent={isAdminOrHigher ? onCreateEvent : undefined}
          />
        </div>
      );
    case 'day':
      return (
        <div className="h-full overflow-auto">
          <DayView 
            onCreateEvent={isAdminOrHigher ? onCreateEvent : undefined}
            onEditEvent={isAdminOrHigher ? onEditEvent : undefined}
            onDeleteEvent={isAdminOrHigher ? onDeleteEvent : undefined}
          />
        </div>
      );
    case 'month':
      return (
        <div className="h-full overflow-auto">
          <MonthView 
            onDateClick={onDateClick}
          />
        </div>
      );
    default:
      return null;
  }
};

export default CalendarViewRenderer;
