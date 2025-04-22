
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

  // For admin pages, use a layout with sidebar
  if (isAdminPage) {
    return (
      <div className="min-h-screen bg-background">
        <SidebarProvider defaultOpen={true}>
          {children}
        </SidebarProvider>
      </div>
    );
  }

  // Regular pages as before
  return (
    <div className="min-h-screen flex flex-col bg-background">
      {!isAuthPage && <Navbar />}
      <main className="flex-grow">
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
