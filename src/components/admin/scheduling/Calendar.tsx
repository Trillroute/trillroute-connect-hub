
import React from 'react';
import { CalendarProvider } from './context/CalendarContext';
import CalendarContent from './CalendarContent';

interface SchedulingCalendarProps {
  hasAdminAccess?: boolean;
  userId?: string;
  roleFilter?: string[];
}

const SchedulingCalendar: React.FC<SchedulingCalendarProps> = ({ 
  hasAdminAccess = false,
  userId,
  roleFilter 
}) => {
  return (
    <CalendarProvider>
      <CalendarContent 
        hasAdminAccess={hasAdminAccess} 
        userId={userId}
        roleFilter={roleFilter}
      />
    </CalendarProvider>
  );
};

export default SchedulingCalendar;
