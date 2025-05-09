
import React from 'react';
import CalendarMainContent from './components/CalendarMainContent';

interface CalendarContentProps {
  hasAdminAccess?: boolean;
  userId?: string;
  roleFilter?: string[];
  title?: string;
  description?: string;
  initialFilterType?: 'role' | 'course' | 'skill' | 'teacher' | 'student' | 'admin' | 'staff' | null;
}

const CalendarContent: React.FC<CalendarContentProps> = ({
  hasAdminAccess = false,
  userId,
  roleFilter,
  title,
  description,
  initialFilterType = null
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
      />
    </div>
  );
};

export default CalendarContent;
