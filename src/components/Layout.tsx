
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

  // Navbar always at top except auth pages
  return (
    <div className="min-h-screen flex flex-col bg-background">
      {!isAuthPage && <Navbar />}
      {isAdminPage ? (
        // sidebar/content as row under Navbar for admin/superadmin
        <div className="flex flex-1 min-h-0">
          <SidebarProvider defaultOpen={true}>
            <div className="flex w-full">
              {children}
            </div>
          </SidebarProvider>
        </div>
      ) : (
        // standard flow for regular, non-admin pages
        <>
          <main className="flex-grow">
            {children}
          </main>
          {!isAuthPage && !isAdminPage && (
            <div className="relative z-50">
              <Footer />
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Layout;
