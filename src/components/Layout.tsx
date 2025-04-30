
import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import { useLocation } from 'react-router-dom';
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
  const isStudentDashboard = location.pathname.includes('/dashboard/student');

  // For admin pages, header is full width at top, sidebar + content share the below space horizontally
  if (isAdminPage) {
    // No need to destructure children, the SuperAdminDashboard component
    // already includes the SuperAdminSidebar component
    return (
      <div className="min-h-screen flex flex-col w-full bg-background">
        {/* Header: always on top, full width */}
        <div className="w-full flex-shrink-0">
          <Navbar />
        </div>
        <SidebarProvider defaultOpen={true}>
          {/* Main content container */}
          <div className="flex-1 flex flex-col">
            {children}
          </div>
        </SidebarProvider>
      </div>
    );
  }

  // Regular pages as before
  return (
    <div className="min-h-screen flex flex-col bg-background">
      {!isAuthPage && <Navbar />}
      <main className={`flex-grow ${isStudentDashboard ? 'pt-4' : ''}`}>
        {children}
      </main>
      {!isAuthPage && (
        <div className="relative z-50">
          <Footer />
        </div>
      )}
    </div>
  );
};

export default Layout;
