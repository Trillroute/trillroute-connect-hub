
import React from 'react';
import { CalendarProvider } from './CalendarContext';
import CalendarContent from './CalendarContent';

interface SchedulingCalendarProps {
  hasAdminAccess?: boolean;
}

const SchedulingCalendar: React.FC<SchedulingCalendarProps> = ({ 
  hasAdminAccess = false 
}) => {
  return (
    <CalendarProvider>
      <CalendarContent hasAdminAccess={hasAdminAccess} />
    </CalendarProvider>
  );
};

export default SchedulingCalendar;
