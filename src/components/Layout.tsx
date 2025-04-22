
import React, { useState } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
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

  // For admin pages, we just render the children because AdminSidebar is included within the dashboard components
  if (isAdminPage) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        {!isAuthPage && <Navbar />}
        <SidebarProvider defaultOpen={true}>
          <main className="flex-1">
            {children}
          </main>
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
