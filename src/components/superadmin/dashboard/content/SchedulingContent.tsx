
import React from 'react';
import SchedulingCalendar from '@/components/admin/scheduling/Calendar';
import ContentWrapper from './ContentWrapper';
import { useAuth } from '@/hooks/useAuth';
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

const SchedulingContent: React.FC = () => {
  const { role } = useAuth();
  
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
      <div className="w-full border rounded-md bg-white shadow-sm">
        <ScrollArea className="h-[calc(100vh-220px)]">
          <SchedulingCalendar />
        </ScrollArea>
      </div>
    </ContentWrapper>
  );
};

export default SchedulingContent;
