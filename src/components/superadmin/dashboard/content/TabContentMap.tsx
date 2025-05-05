
import React from 'react';
import { ActiveTab } from '@/components/admin/SuperAdminSidebar';
import TodayContent from './TodayContent';
import LeadsKanbanContent from './LeadsKanbanContent';
import TeacherContent from './TeacherContent';
import PlaceholderContent from './PlaceholderContent';
import SchedulingContent from './SchedulingContent';
import UserAvailabilityContent from './UserAvailabilityContent';

interface TabContentMapProps {
  activeTab: ActiveTab;
}

const TabContentMap: React.FC<TabContentMapProps> = ({ activeTab }) => {
  switch (activeTab) {
    case 'today':
      return <TodayContent />;
    case 'leads-cards':
      return <LeadsKanbanContent />;
    case 'teachers':
      return <TeacherContent />;
    case 'scheduling':
      return <SchedulingContent />;
    case 'user-availability':
      return <UserAvailabilityContent />;
    default:
      return <PlaceholderContent tab={activeTab} />;
  }
};

export default TabContentMap;
