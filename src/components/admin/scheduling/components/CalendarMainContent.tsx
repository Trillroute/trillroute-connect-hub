
import React, { useState } from 'react';
import CalendarHeader from '../CalendarHeader';
import CalendarViewRenderer from '../CalendarViewRenderer';
import EventFormDialog from '../EventFormDialog';
import FilterTypeTabs from './FilterTypeTabs';
import { useCalendar } from '../context/CalendarContext';

interface CalendarMainContentProps {
  hasAdminAccess?: boolean;
  userId?: string;
  roleFilter?: string[];
  title?: string;
  description?: string;
  initialFilterType?: 'role' | 'course' | 'skill' | 'teacher' | 'student' | 'admin' | 'staff' | null;
  showFilterTabs?: boolean;
  showAvailability?: boolean;
  allowEventCreation?: boolean;
}

const CalendarMainContent: React.FC<CalendarMainContentProps> = ({
  hasAdminAccess = false,
  userId,
  roleFilter,
  title,
  description,
  initialFilterType = null,
  showFilterTabs = true,
  showAvailability = true,
  allowEventCreation = true
}) => {
  const { viewMode } = useCalendar();
  const [isCreateEventDialogOpen, setIsCreateEventDialogOpen] = useState(false);
  const [filterType, setFilterType] = useState<'course' | 'skill' | 'teacher' | 'student' | 'admin' | 'staff' | null>(
    initialFilterType as 'course' | 'skill' | 'teacher' | 'student' | 'admin' | 'staff' | null
  );

  // Use both hasAdminAccess and allowEventCreation to determine if events can be created
  const canCreateEvents = hasAdminAccess && allowEventCreation;

  const handleCreateEvent = () => {
    if (canCreateEvents) {
      setIsCreateEventDialogOpen(true);
    }
  };

  const handleEventEdit = () => {
    // Implement event edit logic here
  };

  const handleEventDelete = () => {
    // Implement event delete logic here
  };

  const handleDateClick = (date: Date) => {
    // Handle date click only if we can create events
    if (canCreateEvents) {
      setIsCreateEventDialogOpen(true);
    }
  };
  
  // Handle filter type change with correct type casting
  const handleFilterTypeChange = (type: string | null) => {
    setFilterType(type as 'course' | 'skill' | 'teacher' | 'student' | 'admin' | 'staff' | null);
  };

  // Determine filter type and IDs based on props
  const getFilterParams = () => {
    // If we have a userId, it's a user-specific filter
    if (userId) {
      return {
        filterType: 'teacher' as const,
        filterIds: [userId]
      };
    }
    
    if (roleFilter && roleFilter.length > 0) {
      let type: 'teacher' | 'student' | 'admin' | 'staff' | null = null;
      
      if (roleFilter.includes('teacher')) {
        type = 'teacher';
      } else if (roleFilter.includes('admin') || roleFilter.includes('superadmin')) {
        type = 'admin';
      } else if (roleFilter.includes('student')) {
        type = 'student';
      }
      
      if (roleFilter.includes('teacher') && (roleFilter.includes('admin') || roleFilter.includes('superadmin'))) {
        type = 'staff';
      }
      
      return {
        filterType: type,
        filterIds: [] // No specific IDs, just filter by role
      };
    }
    
    return {
      filterType,
      filterIds: []
    };
  };
  
  const { filterType: effectiveFilterType, filterIds } = getFilterParams();

  return (
    <div className="flex flex-col h-full">
      <CalendarHeader onCreateEvent={handleCreateEvent} />
      
      {/* Only render FilterTypeTabs if showFilterTabs is true */}
      {showFilterTabs && (
        <FilterTypeTabs 
          filterType={filterType} 
          setFilterType={handleFilterTypeChange}
        />
      )}
      
      <div className="flex-grow overflow-auto">
        <CalendarViewRenderer 
          viewMode={viewMode}
          onCreateEvent={handleCreateEvent}
          onEditEvent={handleEventEdit}
          onDeleteEvent={handleEventDelete}
          onDateClick={handleDateClick}
          filterType={effectiveFilterType}
          filterIds={filterIds}
          showAvailability={showAvailability}
          allowEventCreation={canCreateEvents}
        />
      </div>
      <EventFormDialog 
        open={isCreateEventDialogOpen} 
        onOpenChange={setIsCreateEventDialogOpen} 
        mode="create"
        onSave={() => {
          // Handle event creation
          setIsCreateEventDialogOpen(false);
        }} 
      />
    </div>
  );
};

export default CalendarMainContent;
