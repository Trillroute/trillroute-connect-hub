
import React from 'react';
import FilteredCalendar from '@/components/admin/scheduling/FilteredCalendar';

interface StaffCalendarContentProps {
  title?: string;
  description?: string;
}

const StaffCalendarContent: React.FC<StaffCalendarContentProps> = ({ 
  title = 'Staff Calendar', 
  description 
}) => {
  return (
    <div className="h-full flex flex-col space-y-4">
      {description && <p className="text-muted-foreground">{description}</p>}
      
      <div className="flex-grow border rounded-md overflow-hidden">
        <FilteredCalendar 
          hasAdminAccess={true}
          filterType="staff"
          filterValues={['teacher', 'admin', 'superadmin']}
          title={title}
          showAvailability={true}
        />
      </div>
    </div>
  );
};

export default StaffCalendarContent;
