
import React, { useState } from 'react';
import ContentWrapper from './ContentWrapper';
import { useAuth } from '@/hooks/useAuth';
import { Badge } from "@/components/ui/badge";
import UserAvailabilitySchedule from '@/components/admin/scheduling/user-availability/UserAvailabilitySchedule';
import { useUserAvailability } from '@/hooks/useUserAvailability';

const UserAvailabilityContent: React.FC = () => {
  const { role, user } = useAuth();
  const { 
    loading,
    dailyAvailability,
    refreshAvailability,
    addSlot,
    updateSlot,
    deleteSlot,
    copyDaySlots
  } = useUserAvailability();
  
  return (
    <ContentWrapper
      title="User Availability"
      description="Define when you are available throughout the week"
    >
      <div className="flex justify-between items-center mb-4">
        <Badge variant="outline" className="bg-gray-100">
          Viewing as: {role?.toUpperCase()}
        </Badge>
      </div>

      <div className="w-full border rounded-md bg-white shadow-sm h-[calc(100vh-220px)] overflow-auto">
        <UserAvailabilitySchedule 
          dailyAvailability={dailyAvailability}
          loading={loading}
          onAddSlot={addSlot}
          onUpdateSlot={updateSlot}
          onDeleteSlot={deleteSlot}
          onCopyDay={copyDaySlots}
          onRefresh={refreshAvailability}
        />
      </div>
    </ContentWrapper>
  );
};

export default UserAvailabilityContent;
