
import React from 'react';
import SchedulingCalendar from '@/components/admin/scheduling/Calendar';
import ContentWrapper from './ContentWrapper';

const SchedulingContent: React.FC = () => {
  return (
    <ContentWrapper
      title="Scheduling"
      description="Manage your class and event scheduling"
    >
      <div className="w-full border rounded-md bg-white shadow-sm">
        <div className="h-[calc(100vh-220px)]">
          <SchedulingCalendar />
        </div>
      </div>
    </ContentWrapper>
  );
};

export default SchedulingContent;
