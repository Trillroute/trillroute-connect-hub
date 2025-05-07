import React from 'react';
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
  console.log("TabContentMap rendering with activeTab:", activeTab);

  // Force-render StudentManagement for debugging
  if (activeTab === 'students') {
    console.log("ACTIVELY RENDERING StudentManagement component");
    return (
      <StudentManagement 
        canAddUser={true}
        canEditUser={true}
        canDeleteUser={true}
      />
    );
  }

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
      return <SchedulingContent />;
      
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
      
    case 'access':
      return <PlaceholderContent tab={activeTab} />;
      
    default:
      console.log("Default case: Rendering PlaceholderContent for tab:", activeTab);
      return <PlaceholderContent tab={activeTab} />;
  }
};

export default TabContentMap;
