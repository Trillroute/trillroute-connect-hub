
import React from 'react';
import CalendarMainContent from './components/CalendarMainContent';

interface CalendarContentProps {
  hasAdminAccess?: boolean;
  userId?: string;
  roleFilter?: string[];
  title?: string;
  description?: string;
  initialFilterType?: 'role' | 'course' | 'skill' | 'teacher' | 'student' | 'admin' | 'staff' | null;
  showFilterTabs?: boolean;
  showAvailability?: boolean;
}

const CalendarContent: React.FC<CalendarContentProps> = ({
  hasAdminAccess = false,
  userId,
  roleFilter,
  title,
  description,
  initialFilterType = null,
  showFilterTabs = true,
  showAvailability = true
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
        showFilterTabs={showFilterTabs}
        showAvailability={showAvailability}
      />
    </div>
  );
};

export default CalendarContent;
