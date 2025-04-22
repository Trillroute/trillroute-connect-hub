
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

  // For admin pages, ensure header is above and sidebar/content share space below
  if (isAdminPage) {
    return (
      <div className="min-h-screen flex flex-col bg-background w-full">
        {/* Header on top */}
        <Navbar />
        {/* Flex row: sidebar + main content, full height below header */}
        <SidebarProvider defaultOpen={true}>
          <div className="flex flex-1 min-h-0">
            {/* Sidebar and children must be rendered together for proper layout */}
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

