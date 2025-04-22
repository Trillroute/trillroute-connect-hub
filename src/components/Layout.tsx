
import React, { useState } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import AdminSidebar from './admin/AdminSidebar';
import { useLocation } from 'react-router-dom';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from './ui/resizable';
import { SidebarProvider } from './ui/sidebar';

interface LayoutProps {
  children: React.ReactNode;
  activeTab?: string;
  onTabChange?: (tab: string) => void;
  permissionMap?: any;
}

const Layout = ({ children }: LayoutProps) => {
  const location = useLocation();
  const isAuthPage = location.pathname.includes('/auth');
  const isAdminPage = 
    location.pathname.includes('/dashboard/admin') || 
    location.pathname.includes('/dashboard/superadmin') ||
    location.pathname.includes('/admin');

  // Sidebar collapsed state
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Keep sidebar open by default
  const handleSidebarToggle = () => setSidebarCollapsed((prev) => !prev);

  // Only use sidebar for admin pages
  if (isAdminPage) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        {!isAuthPage && <Navbar />}
        <SidebarProvider defaultOpen={!sidebarCollapsed}>
          <div className="flex flex-1 w-full">
            <ResizablePanelGroup direction="horizontal" className="flex w-full">
              <ResizablePanel
                // Min width ~60px when collapsed, otherwise fits content best
                minSize={sidebarCollapsed ? 8 : 18}
                defaultSize={sidebarCollapsed ? 8 : 18}
                maxSize={30}
                collapsible={true}
                onCollapse={() => setSidebarCollapsed(true)}
                onExpand={() => setSidebarCollapsed(false)}
                className="transition-all duration-200 bg-sidebar"
              >
                <AdminSidebar
                  collapsed={sidebarCollapsed}
                  onToggleCollapse={handleSidebarToggle}
                />
              </ResizablePanel>
              <ResizableHandle withHandle />
              <ResizablePanel>
                <main className="flex-grow min-h-screen ml-0 transition-all duration-300">
                  {children}
                </main>
              </ResizablePanel>
            </ResizablePanelGroup>
          </div>
        </SidebarProvider>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {!isAuthPage && <Navbar />}
      <main className={`flex-grow`}>
        {children}
      </main>
      {!isAuthPage && !isAdminPage && (
        <div className="relative z-50">
          <Footer />
        </div>
      )}
    </div>
  );
};

export default Layout;
