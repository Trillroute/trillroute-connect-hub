
import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import { useLocation } from 'react-router-dom';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const location = useLocation();
  const isAuthPage = location.pathname.includes('/auth');
  const isAdminPage = 
    location.pathname.includes('/dashboard/admin') || 
    location.pathname.includes('/dashboard/superadmin') ||
    location.pathname.includes('/admin');
  
  return (
    <div className="min-h-screen flex flex-col bg-background">
      {!isAuthPage && <Navbar />}
      <main className={`flex-grow ${isAdminPage ? 'p-0 md:ml-64' : ''}`}>
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
