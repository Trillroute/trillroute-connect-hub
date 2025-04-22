
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

  // For admin pages: Header on top, sidebar/content below sharing space horizontally
  if (isAdminPage) {
    return (
      <div className="min-h-screen flex flex-col w-full bg-background">
        {/* Header at the top, not overlapped */}
        <div className="w-full flex-shrink-0">
          <Navbar />
        </div>
        {/* Horizontal layout for sidebar + content below header */}
        <SidebarProvider defaultOpen={true}>
          <div className="flex flex-1 min-h-0 w-full">
            {/* Sidebar and main content should be rendered together */}
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

