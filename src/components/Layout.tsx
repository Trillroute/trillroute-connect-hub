
import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import { useLocation } from 'react-router-dom';
import { SidebarProvider } from './ui/sidebar';

// Removed PanelGroup import as we shouldn't nest things for admin
// If needed elsewhere, re-add only for non-admin paths

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

  // For admin pages, wrap sidebar/content in a single flex container!
  if (isAdminPage) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        {!isAuthPage && <Navbar />}
        <div className="flex-1 flex">
          <SidebarProvider defaultOpen={true}>
            <div className="flex w-full">
              {children}
            </div>
          </SidebarProvider>
        </div>
      </div>
    );
  }

  // Regular pages as before.
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
