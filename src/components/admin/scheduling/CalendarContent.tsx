
import React from 'react';
import CalendarMainContent from './components/CalendarMainContent';

interface CalendarContentProps {
  hasAdminAccess?: boolean;
  userId?: string;
  roleFilter?: string[];
  title?: string;
  description?: string;
  initialFilterType?: 'role' | 'course' | 'skill' | 'teacher' | 'student' | 'admin' | 'staff' | null;
  showFilterTabs?: boolean; // Added prop to control filter tabs visibility
}

const CalendarContent: React.FC<CalendarContentProps> = ({
  hasAdminAccess = false,
  userId,
  roleFilter,
  title,
  description,
  initialFilterType = null,
  showFilterTabs = true // Default to true for backward compatibility
}) => {
  return (
    <div className="flex flex-col h-full">
      <CalendarMainContent 
        hasAdminAccess={hasAdminAccess}
        userId={userId}
        roleFilter={roleFilter}
        title={title}
        description={description}
        initialFilterType={initialFilterType}
        showFilterTabs={showFilterTabs} // Pass down the control prop
      />
    </div>
  );
};

export default CalendarContent;
