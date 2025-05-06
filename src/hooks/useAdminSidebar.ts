
import { useState } from 'react';
import { type ActiveTab } from '@/components/admin/AdminSidebar';

export const useAdminSidebar = (initialTab: ActiveTab = 'courses') => {
  const [activeTab, setActiveTab] = useState<ActiveTab>(initialTab);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const handleSidebarToggle = () => {
    setSidebarCollapsed(prev => !prev);
  };

  return {
    activeTab,
    setActiveTab,
    sidebarCollapsed,
    handleSidebarToggle
  };
};
