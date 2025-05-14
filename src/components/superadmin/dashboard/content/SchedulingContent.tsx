
import React from 'react';
import FilteredCalendar from '@/components/admin/scheduling/FilteredCalendar';

interface SchedulingContentProps {
  title?: string;
  description?: string;
}

const SchedulingContent: React.FC<SchedulingContentProps> = ({
  title = 'Scheduling Calendar',
  description
}) => {
  return (
    <div className="h-full flex flex-col space-y-4">
      {description && (
        <p className="text-muted-foreground">{description}</p>
      )}
      
      <div className="flex-grow border rounded-md overflow-hidden">
        <FilteredCalendar
          title={title}
          hasAdminAccess={true}
          filterType="staff"
          filterValues={['teacher', 'admin', 'superadmin']}
          showAvailability={true}
        />
      </div>
    </div>
  );
};

export default SchedulingContent;
