
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
  const isAdminPage = location.pathname.includes('/dashboard/admin') || location.pathname.includes('/dashboard/superadmin');
  
  return (
    <div className="min-h-screen flex flex-col bg-background">
      {!isAuthPage && <Navbar />}
      <main className={`flex-grow ${isAdminPage ? 'p-0' : ''}`}>
        {children}
      </main>
      {!isAuthPage && (
        <div className="relative z-30">
          <Footer />
        </div>
      )}
    </div>
  );
};

export default Layout;
