
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@/components/ui/resizable';
import AdminSidebar from '@/components/admin/AdminSidebar';
import { useAdminDashboardPermissions } from '@/hooks/useAdminDashboardPermissions';
import DashboardContent from '@/components/admin/dashboard/DashboardContent';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const {
    activeTab,
    setActiveTab,
    permissionMap,
    isLoadingRoles,
    debugInfo,
    hasAnyAccess
  } = useAdminDashboardPermissions();

  useEffect(() => {
    if (user) {
      console.log('[AdminDashboard] User data:', user);
      console.log('[AdminDashboard] User role:', user.role);
      console.log('[AdminDashboard] User adminRoleName:', user.adminRoleName);
    }
  }, [user]);

  const handleSidebarToggle = () => {
    setSidebarCollapsed(prev => !prev);
  };

  return (
    <ResizablePanelGroup direction="horizontal" className="min-h-screen bg-background flex w-full" style={{ height: "100vh" }}>
      <ResizablePanel defaultSize={sidebarCollapsed ? 8 : 22} minSize={8} maxSize={28} collapsible={true} collapsedSize={5}>
        <AdminSidebar 
          collapsed={sidebarCollapsed}
          onToggleCollapse={handleSidebarToggle}
          activeTab={activeTab}
          onTabChange={(tab) => setActiveTab(tab as typeof activeTab)}
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
          </div>
          
          <DashboardContent
            activeTab={activeTab}
            permissionMap={permissionMap}
            isLoadingRoles={isLoadingRoles}
            debugInfo={debugInfo}
            hasAnyAccess={hasAnyAccess}
          />
        </div>
      </ResizablePanel>
    </ResizablePanelGroup>
  );
};

export default AdminDashboard;
