
import React from 'react';
import { CalendarProvider } from './CalendarContext';
import CalendarContent from './CalendarContent';

const SchedulingCalendar: React.FC = () => {
  return (
    <CalendarProvider>
      <CalendarContent />
    </CalendarProvider>
  );
};

export default SchedulingCalendar;
