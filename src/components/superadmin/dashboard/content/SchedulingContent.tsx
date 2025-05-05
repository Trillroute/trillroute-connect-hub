
import React from 'react';
import SchedulingCalendar from '@/components/admin/scheduling/Calendar';
import ContentWrapper from './ContentWrapper';
import { useAuth } from '@/hooks/useAuth';
import { Badge } from "@/components/ui/badge";

const SchedulingContent: React.FC = () => {
  const { role, isAdmin, isSuperAdmin } = useAuth();
  const hasAdminAccess = isAdmin() || isSuperAdmin();
  
  return (
    <ContentWrapper
      title="Scheduling"
      description="Manage your class and event scheduling"
    >
      <div className="flex justify-between items-center mb-4">
        <Badge variant="outline" className="bg-gray-100">
          Viewing as: {role?.toUpperCase()}
        </Badge>
      </div>
      <div className="w-full border rounded-md bg-white shadow-sm h-[calc(100vh-220px)]">
        <SchedulingCalendar hasAdminAccess={hasAdminAccess} />
      </div>
    </ContentWrapper>
  );
};

export default SchedulingContent;
