
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
import EnrollmentPage from '@/components/admin/enrollment/EnrollmentPage';
import TrialBookingPage from '@/components/admin/trial-booking/TrialBookingPage';

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

  // Handle both 'students' and 'studentsList' tabs
  if (activeTab === 'students' || activeTab === 'studentsList') {
    console.log("ACTIVELY RENDERING StudentManagement component");
    return (
      <StudentManagement 
        canAddUser={true}
        canEditUser={true}
        canDeleteUser={true}
      />
    );
  }
  
  // Add handling for the new enrollStudents tab
  if (activeTab === 'enrollStudents') {
    console.log("Rendering EnrollmentPage component");
    return <EnrollmentPage />;
  }

  // Add handling for the trialBooking tab
  if (activeTab === 'trialBooking') {
    console.log("Rendering TrialBookingPage component");
    return <TrialBookingPage />;
  }

  if (activeTab === 'today') {
    console.log("Rendering TodayContent");
    return (
      <TodayContent 
        stats={stats}
        userActivityData={userActivityData}
        currentYear={currentYear}
        handleYearChange={handleYearChange}
      />
    );
  }

  if (activeTab === 'leads-cards') {
    console.log("Rendering LeadsKanbanContent");
    return (
      <LeadsKanbanContent 
        leads={leads}
        loading={leadsLoading}
        onEditLead={onEditLead}
        onDeleteLead={onDeleteLead}
      />
    );
  }

  if (activeTab === 'leads') {
    console.log("Rendering LeadManagement");
    return <LeadManagement />;
  }

  if (activeTab === 'teachers') {
    console.log("Rendering TeacherManagement");
    return <TeacherManagement />;
  }

  if (activeTab === 'admins') {
    console.log("Rendering AdminManagement");
    return <AdminManagement />;
  }

  if (activeTab === 'levels') {
    console.log("Rendering LevelManagement");
    return <LevelManagement />;
  }

  if (activeTab === 'courseManagement') {
    console.log("Rendering CourseManagement");
    return <CourseManagement />;
  }

  if (activeTab === 'classTypes') {
    console.log("Rendering ClassTypeManagement");
    return <ClassTypeManagement />;
  }

  if (activeTab === 'scheduling') {
    console.log("Rendering SchedulingContent");
    return <SchedulingContent />;
  }

  if (activeTab === 'user-availability') {
    console.log("Rendering UserAvailabilityContent");
    return <UserAvailabilityContent />;
  }

  if (activeTab === 'calendar') {
    console.log("Rendering Calendar placeholder");
    return <PlaceholderContent tabName="Calendar" />;
  }

  if (activeTab === 'fees') {
    console.log("Rendering Fees placeholder");
    return <PlaceholderContent tabName="Fees" />;
  }

  if (activeTab === 'communication') {
    console.log("Rendering Communication placeholder");
    return <PlaceholderContent tabName="Communication" />;
  }

  if (activeTab === 'intramural') {
    console.log("Rendering Intramural placeholder");
    return <PlaceholderContent tabName="Intramural" />;
  }

  if (activeTab === 'reports') {
    console.log("Rendering Reports placeholder");
    return <PlaceholderContent tabName="Reports" />;
  }

  console.log("Default case: Rendering PlaceholderContent for tab:", activeTab);
  return <PlaceholderContent tabName={activeTab} />;
};

export default TabContentMap;
