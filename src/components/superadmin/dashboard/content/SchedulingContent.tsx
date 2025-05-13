
import React from 'react';
import { CalendarProvider } from '@/components/admin/scheduling/context/CalendarContext';
import CalendarMainContent from '@/components/admin/scheduling/components/CalendarMainContent';
import { CalendarViewMode } from '@/components/admin/scheduling/context/calendarTypes';

interface SchedulingContentProps {
  initialViewMode?: CalendarViewMode;
}

const SchedulingContent: React.FC<SchedulingContentProps> = ({ 
  initialViewMode = "week" 
}) => {
  console.log("SchedulingContent: initializing with view mode", initialViewMode);
  
  return (
    <div className="w-full">
      <div className="flex flex-col space-y-4">
        <div className="bg-white shadow-sm rounded-md p-4">
          <CalendarProvider>
            <CalendarMainContent 
              hasAdminAccess={true}
              title="Class Calendar"
              initialViewMode={initialViewMode}
            />
          </CalendarProvider>
        </div>
      </div>
    </div>
  );
};

export default SchedulingContent;
