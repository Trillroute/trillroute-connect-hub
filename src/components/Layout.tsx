
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
    // Expect children to be [<Sidebar />, <MainContent />]
    let sidebar = null;
    let mainContent = null;

    // If children is array, safely destructure
    if (Array.isArray(children)) {
      [sidebar, mainContent] = children;
    } else {
      // fallback: everything in main content if only 1 child
      mainContent = children;
    }

    return (
      <div className="min-h-screen flex flex-col w-full bg-background">
        {/* Header: always on top, full width */}
        <div className="w-full flex-shrink-0">
          <Navbar />
        </div>
        <SidebarProvider defaultOpen={true}>
          {/* Flex row below header: sidebar left, main content right */}
          <div className="flex flex-1 min-h-0 w-full">
            {/* Sidebar left */}
            <div className="h-full">
              {sidebar}
            </div>
            {/* Main content right, flex-grow */}
            <div className="flex-1 h-full overflow-auto">
              {mainContent}
            </div>
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
