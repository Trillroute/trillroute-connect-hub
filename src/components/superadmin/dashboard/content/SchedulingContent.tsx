
import React from 'react';
import SchedulingCalendar from '@/components/admin/scheduling/Calendar';

const SchedulingContent: React.FC = () => {
  return (
    <div className="w-full h-full overflow-hidden">
      <SchedulingCalendar />
    </div>
  );
};

export default SchedulingContent;
