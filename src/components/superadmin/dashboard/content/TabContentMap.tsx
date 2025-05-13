
import React, { memo } from 'react';
import { ActiveTab } from '@/components/admin/SuperAdminSidebar';
import TodayContent from './TodayContent';
import LeadsKanbanContent from './LeadsKanbanContent';
import TeacherContent from './TeacherContent';
import PlaceholderContent from './PlaceholderContent';
import SchedulingContent from './SchedulingContent';
import UserAvailabilityContent from './UserAvailabilityContent';
import { DashboardStats, UserActivityData } from '@/components/superadmin/hooks/useDashboardData';
import { Lead } from "@/types/lead";
import AdminManagement from '@/components/admin/AdminManagement';
import CourseManagement from '@/components/admin/CourseManagement';
import StudentManagement from '@/components/admin/StudentManagement';
import LeadManagement from '@/components/admin/LeadManagement';
import LevelManagement from '@/components/admin/levels/LevelManagement';
import ClassTypeManagement from '@/components/admin/class-types/ClassTypeManagement';
import TeacherManagement from '@/components/admin/TeacherManagement';

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

// Use memo to prevent unnecessary re-renders
const TabContentMap: React.FC<TabContentMapProps> = memo(({ 
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
  console.log("TabContentMap rendering for tab:", activeTab);
  
  // Render content based on active tab
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
      
    case 'leads':
      return <LeadManagement 
        canAddLead={true}
        canEditLead={true}
        canDeleteLead={true}
      />;
      
    case 'leads-cards':
      return leads && onEditLead && onDeleteLead ? (
        <LeadsKanbanContent
          leads={leads}
          loading={leadsLoading || false}
          onEdit={onEditLead}
          onDelete={onDeleteLead}
        />
      ) : null;
      
    case 'teachers':
      return <TeacherManagement 
        canAddUser={true}
        canEditUser={true}
        canDeleteUser={true}
      />;
      
    case 'scheduling':
      // Initialize scheduling component with focus on current date
      return <SchedulingContent key="scheduling" initialViewMode="week" />;
      
    case 'calendar':
      // Use the scheduling content but with different initial view
      return <SchedulingContent key="calendar" initialViewMode="month" />;
      
    case 'legacy-view':
      // Dedicated route for legacy view
      return <SchedulingContent key="legacy-view" initialViewMode="legacy" />;
      
    case 'user-availability':
      return <UserAvailabilityContent />;
      
    case 'classTypes':
      return <ClassTypeManagement />;
      
    case 'courseManagement':
      return <CourseManagement 
        canAddCourse={true}
        canEditCourse={true}
        canDeleteCourse={true}
      />;
      
    case 'admins':
      return <AdminManagement 
        canAddAdmin={true}
        canEditAdmin={true}
        canDeleteAdmin={true}
        canEditAdminLevel={true}
      />;
      
    case 'levels':
      return <LevelManagement 
        canAddLevel={true}
        canEditLevel={true}
        canDeleteLevel={true}
      />;

    case 'students':
      return (
        <StudentManagement 
          canAddUser={true}
          canEditUser={true}
          canDeleteUser={true}
        />
      );
      
    default:
      return <PlaceholderContent tab={activeTab} />;
  }
});

TabContentMap.displayName = 'TabContentMap';

export default TabContentMap;
