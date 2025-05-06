
import React from 'react';
import { ActiveTab } from '@/components/admin/SuperAdminSidebar';
import TodayContent from './TodayContent';
import LeadsKanbanContent from './LeadsKanbanContent';
import TeacherContent from './TeacherContent';
import PlaceholderContent from './PlaceholderContent';
import SchedulingContent from './SchedulingContent';
import UserAvailabilityContent from './UserAvailabilityContent';
import LevelManagement from '@/components/admin/levels/LevelManagement';
import StudentManagement from '@/components/admin/StudentManagement';
import AdminManagement from '@/components/superadmin/AdminManagement';
import CourseManagement from '@/components/admin/CourseManagement';
import LeadManagement from '@/components/admin/LeadManagement';
import ClassTypeManagement from '@/components/admin/class-types/ClassTypeManagement';
import { DashboardStats, UserActivityData } from '@/components/superadmin/hooks/useDashboardData';
import { Lead } from '@/types/lead';

interface TabContentMapProps {
  activeTab: ActiveTab;
  stats?: DashboardStats;
  userActivityData?: UserActivityData[];
  currentYear?: number;
  handleYearChange?: (change: number) => void;
  leads?: Lead[];
  leadsLoading?: boolean;
  onEditLead?: (lead: Lead) => void;
  onDeleteLead?: (lead: Lead) => void;
}

const TabContentMap: React.FC<TabContentMapProps> = ({ 
  activeTab,
  stats,
  userActivityData,
  currentYear,
  handleYearChange,
  leads,
  leadsLoading,
  onEditLead,
  onDeleteLead
}) => {
  switch (activeTab) {
    case 'today':
      return stats && userActivityData && currentYear && handleYearChange ? (
        <TodayContent 
          stats={stats}
          userActivityData={userActivityData}
          currentYear={currentYear}
          handleYearChange={handleYearChange}
        />
      ) : null;
    
    case 'students':
      return <StudentManagement />;
      
    case 'courses':
      return <CourseManagement />;
    
    case 'classTypes':
      return <ClassTypeManagement />;
      
    case 'leads':
      return <LeadManagement />;
      
    case 'leads-cards':
      return leads && onEditLead && onDeleteLead ? (
        <LeadsKanbanContent
          leads={leads}
          loading={leadsLoading || false}
          onEdit={onEditLead}
          onDelete={onDeleteLead}
        />
      ) : null;
      
    case 'admins':
      return <AdminManagement />;
      
    case 'levels':
      return <LevelManagement />;
      
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
