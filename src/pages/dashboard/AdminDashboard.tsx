
import React, { useEffect } from 'react';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@/components/ui/resizable';
import AdminSidebar from '@/components/admin/AdminSidebar';
import DashboardContent from '@/components/admin/dashboard/DashboardContent';
import DebugInfoAlert from '@/components/admin/dashboard/DebugInfoAlert';
import { useAdminDashboardPermissions } from '@/hooks/useAdminDashboardPermissions';
import { useAdminSidebar } from '@/hooks/useAdminSidebar';
import { useAuth } from '@/hooks/useAuth';

const AdminDashboard = () => {
  const { user } = useAuth();
  const { 
    permissionMap, 
    isLoadingRoles, 
    debugInfo, 
    hasAnyAccess, 
    availableTabs 
  } = useAdminDashboardPermissions();
  
  const initialTab = (availableTabs.length > 0 ? availableTabs[0] : 'courses') as any;
  const { 
    activeTab, 
    setActiveTab, 
    sidebarCollapsed, 
    handleSidebarToggle 
  } = useAdminSidebar(initialTab);

  // Update active tab when available tabs change
  useEffect(() => {
    if (availableTabs.length > 0 && !availableTabs.includes(activeTab)) {
      setActiveTab(availableTabs[0] as any);
    }
  }, [availableTabs, activeTab, setActiveTab]);

  // Log user data in development
  useEffect(() => {
    if (user) {
      console.log('[AdminDashboard] User data:', user);
      console.log('[AdminDashboard] User role:', user.role);
      console.log('[AdminDashboard] User adminRoleName:', user.adminRoleName);
    }
  }, [user]);
  
  console.log('[AdminDashboard] Available tabs:', availableTabs);
  console.log('[AdminDashboard] Current permission map:', permissionMap);

  return (
    <ResizablePanelGroup direction="horizontal" className="min-h-screen bg-background flex w-full" style={{ height: "100vh" }}>
      <ResizablePanel defaultSize={sidebarCollapsed ? 8 : 22} minSize={8} maxSize={28} collapsible={true} collapsedSize={5}>
        <AdminSidebar 
          collapsed={sidebarCollapsed}
          onToggleCollapse={handleSidebarToggle}
          activeTab={activeTab}
          onTabChange={(tab) => setActiveTab(tab as any)}
          permissionMap={{
            courses: { view: permissionMap.courses.view },
            students: { view: permissionMap.students.view },
            teachers: { view: permissionMap.teachers.view },
            admins: { view: permissionMap.admins.view },
            leads: { view: permissionMap.leads.view },
            levels: { view: permissionMap.levels.view }
          }}
        />
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel minSize={30} defaultSize={78}>
        <div className="p-4 md:p-6 overflow-auto w-full">
          <div className="mb-6">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Admin Dashboard</h1>
            <DebugInfoAlert debugInfo={debugInfo} />
          </div>
          
          {isLoadingRoles ? (
            <div className="flex justify-center items-center h-48">
              <p>Loading permissions...</p>
            </div>
          ) : (
            <DashboardContent 
              activeTab={activeTab} 
              permissionMap={permissionMap}
              hasAnyAccess={hasAnyAccess}
            />
          )}
        </div>
      </ResizablePanel>
    </ResizablePanelGroup>
  );
};

export default AdminDashboard;
