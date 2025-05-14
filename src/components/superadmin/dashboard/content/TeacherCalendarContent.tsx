
import React from 'react';
import FilteredCalendar from '@/components/admin/scheduling/FilteredCalendar';

interface TeacherCalendarContentProps {
  title?: string;
  description?: string;
}

const TeacherCalendarContent: React.FC<TeacherCalendarContentProps> = ({ 
  title = 'Teacher Calendar', 
  description 
}) => {
  return (
    <div className="h-full flex flex-col space-y-4">
      {description && <p className="text-muted-foreground">{description}</p>}
      
      <div className="flex-grow border rounded-md overflow-hidden">
        <FilteredCalendar 
          hasAdminAccess={true}
          filterType="teacher"
          filterValues={['teacher']}
          title={title}
          showAvailability={true}
        />
      </div>
    </div>
  );
};

export default TeacherCalendarContent;
