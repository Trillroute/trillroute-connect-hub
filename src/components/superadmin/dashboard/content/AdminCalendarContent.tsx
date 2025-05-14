
import React from 'react';
import FilteredCalendar from '@/components/admin/scheduling/FilteredCalendar';

interface AdminCalendarContentProps {
  title?: string;
  description?: string;
}

const AdminCalendarContent: React.FC<AdminCalendarContentProps> = ({ 
  title = 'Admin Calendar', 
  description 
}) => {
  return (
    <div className="h-full flex flex-col space-y-4">
      {description && <p className="text-muted-foreground">{description}</p>}
      
      <div className="flex-grow border rounded-md overflow-hidden">
        <FilteredCalendar 
          hasAdminAccess={true}
          filterType="admin"
          filterValues={['admin', 'superadmin']}
          title={title}
          showAvailability={true}
        />
      </div>
    </div>
  );
};

export default AdminCalendarContent;
