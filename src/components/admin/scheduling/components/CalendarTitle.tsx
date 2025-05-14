
import React from 'react';
import { useCalendar } from '../context/CalendarContext';

// Define the CalendarViewMode type since it's missing
type CalendarViewMode = 'day' | 'week' | 'month' | 'list';

interface CalendarTitleProps {
  title?: string;
  description?: string;
}

const CalendarTitle: React.FC<CalendarTitleProps> = ({
  title = "Calendar",
  description
}) => {
  const { viewMode } = useCalendar();
  
  // Map view modes to display text
  const getViewModeText = (mode: CalendarViewMode): string => {
    switch (mode) {
      case 'day': return 'Daily View';
      case 'week': return 'Weekly View';
      case 'month': return 'Monthly View';
      case 'list': return 'List View';
      default: return 'Calendar View';
    }
  };
  
  return (
    <div className="mb-4">
      <h2 className="text-2xl font-semibold">{title}</h2>
      {description && (
        <p className="text-gray-500 mt-1">{description}</p>
      )}
      <p className="text-sm text-gray-500 mt-1">
        {getViewModeText(viewMode as CalendarViewMode)}
      </p>
    </div>
  );
};

export default CalendarTitle;
