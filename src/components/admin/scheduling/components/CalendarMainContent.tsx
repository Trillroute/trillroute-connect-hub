
import React, { useState, useEffect } from 'react';
import CalendarHeader from '../CalendarHeader';
import CalendarViewRenderer from '../CalendarViewRenderer';
import EventFormDialog from '../EventFormDialog';
import FilterTypeTabs from './FilterTypeTabs';
import { useFilterPersistence } from '../hooks/useFilterPersistence';

interface CalendarMainContentProps {
  hasAdminAccess?: boolean;
  userId?: string;
  roleFilter?: string[];
  title?: string;
  description?: string;
  initialFilterType?: 'role' | 'course' | 'skill' | 'teacher' | 'student' | 'admin' | 'staff' | null;
}

const CalendarMainContent: React.FC<CalendarMainContentProps> = ({
  hasAdminAccess = false,
  userId,
  roleFilter,
  title,
  description,
  initialFilterType = null
}) => {
  const [isCreateEventDialogOpen, setIsCreateEventDialogOpen] = useState(false);
  
  // Use the persistence hook with initialFilterType as the starting value
  const { filterState, updateFilterState } = useFilterPersistence({
    filterType: initialFilterType as 'course' | 'skill' | 'teacher' | 'student' | 'admin' | 'staff' | null
  });
  
  // Initialize from props (only on component mount)
  useEffect(() => {
    if (initialFilterType) {
      updateFilterState({ filterType: initialFilterType as 'course' | 'skill' | 'teacher' | 'student' | 'admin' | 'staff' | null });
    }
  }, []);

  const handleCreateEvent = () => {
    setIsCreateEventDialogOpen(true);
  };

  const handleEventEdit = () => {
    // Implement event edit logic here
  };

  const handleEventDelete = () => {
    // Implement event delete logic here
  };

  const handleDateClick = () => {
    // Implement date click logic here
  };
  
  // Handle filter type change with correct type casting
  const handleFilterTypeChange = (type: string | null) => {
    updateFilterState({ 
      filterType: type as 'course' | 'skill' | 'teacher' | 'student' | 'admin' | 'staff' | null 
    });
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
    
    // If we have roleFilter, it's a role-based filter
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
    
    // Use the filter set via UI
    return {
      filterType: filterState.filterType,
      filterIds: filterState.selectedFilters
    };
  };
  
  const { filterType: effectiveFilterType, filterIds } = getFilterParams();

  return (
    <div className="flex flex-col h-full">
      <CalendarHeader onCreateEvent={handleCreateEvent} />
      <FilterTypeTabs 
        filterType={filterState.filterType} 
        setFilterType={handleFilterTypeChange}
      />
      <div className="flex-grow overflow-auto">
        <CalendarViewRenderer 
          viewMode="week" 
          onCreateEvent={handleCreateEvent}
          onEditEvent={handleEventEdit}
          onDeleteEvent={handleEventDelete}
          onDateClick={handleDateClick}
          filterType={effectiveFilterType}
          filterIds={filterIds}
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
