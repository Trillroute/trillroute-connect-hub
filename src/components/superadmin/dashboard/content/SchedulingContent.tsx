
import React from 'react';
import SchedulingCalendar from '@/components/admin/scheduling/Calendar';
import ContentWrapper from './ContentWrapper';

const SchedulingContent: React.FC = () => {
  return (
    <ContentWrapper
      title="Scheduling"
      description="Manage your class and event scheduling"
    >
      <div className="w-full h-full overflow-hidden border rounded-md">
        <SchedulingCalendar />
      </div>
    </ContentWrapper>
  );
};

export default SchedulingContent;
