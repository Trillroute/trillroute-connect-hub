
import React, { useState, useEffect } from 'react';
import ContentWrapper from './ContentWrapper';
import { useAuth } from '@/hooks/useAuth';
import { Badge } from "@/components/ui/badge";
import UserAvailabilitySchedule from '@/components/admin/scheduling/user-availability/UserAvailabilitySchedule';
import { useUserAvailability } from '@/hooks/useUserAvailability';
import { useStaffMembers } from '@/hooks/useStaffMembers';
import UserSelector from '@/components/admin/scheduling/user-availability/UserSelector';

const UserAvailabilityContent: React.FC = () => {
  const { role, user } = useAuth();
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const { staffMembers, loading: isLoadingStaff } = useStaffMembers();
  
  console.log('UserAvailabilityContent rendering', { 
    staffCount: staffMembers.length, 
    isLoadingStaff,
    selectedUserId,
    currentUser: user?.id
  });
  
  const { 
    loading,
    dailyAvailability,
    refreshAvailability,
    addSlot,
    updateSlot,
    deleteSlot,
    copyDaySlots
  } = useUserAvailability(selectedUserId || undefined);

  // Set the initial selected user to the current user
  useEffect(() => {
    if (user && !selectedUserId) {
      console.log('Setting initial selectedUserId to current user:', user.id);
      setSelectedUserId(user.id);
    }
  }, [user, selectedUserId]);

  const handleUserChange = (userId: string) => {
    console.log('User changed to:', userId);
    setSelectedUserId(userId);
  };

  // Find selected user details
  const selectedUser = staffMembers.find(member => member.id === selectedUserId);
  const isOwnAvailability = selectedUserId === user?.id;
  
  return (
    <ContentWrapper
      title="User Availability"
      description="Define when users are available throughout the week"
    >
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-4">
        <Badge variant="outline" className="bg-gray-100">
          Viewing as: {role?.toUpperCase()}
        </Badge>

        {/* Show user selector for admins and superadmins */}
        {(role === 'admin' || role === 'superadmin') && (
          <div className="w-full md:w-64">
            <UserSelector
              staffMembers={staffMembers}
              selectedUserId={selectedUserId}
              isLoading={isLoadingStaff}
              onUserChange={handleUserChange}
            />
          </div>
        )}
      </div>

      <div className="w-full border rounded-md bg-white shadow-sm h-[calc(100vh-280px)] overflow-auto">
        {selectedUserId ? (
          <>
            {!isOwnAvailability && selectedUser && (
              <div className="p-4 bg-blue-50 border-b border-blue-100 text-blue-700 font-medium">
                You are managing availability for: {selectedUser.name} ({selectedUser.role})
              </div>
            )}
            <UserAvailabilitySchedule 
              dailyAvailability={dailyAvailability}
              loading={loading}
              onAddSlot={addSlot}
              onUpdateSlot={updateSlot}
              onDeleteSlot={deleteSlot}
              onCopyDay={copyDaySlots}
              onRefresh={refreshAvailability}
            />
          </>
        ) : (
          <div className="flex justify-center items-center h-full">
            <p className="text-gray-500">Please select a user to manage their availability</p>
          </div>
        )}
      </div>
    </ContentWrapper>
  );
};

export default UserAvailabilityContent;
