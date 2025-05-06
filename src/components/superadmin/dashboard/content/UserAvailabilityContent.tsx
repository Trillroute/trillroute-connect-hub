
import React, { useState, useEffect, useCallback } from 'react';
import ContentWrapper from './ContentWrapper';
import { useAuth } from '@/hooks/useAuth';
import { Badge } from "@/components/ui/badge";
import UserAvailabilitySchedule from '@/components/admin/scheduling/user-availability/UserAvailabilitySchedule';
import { useUserAvailability } from '@/hooks/useUserAvailability';
import { useStaffAvailability } from '@/hooks/useStaffAvailability';
import StaffUserSelector from '@/components/admin/scheduling/user-availability/StaffUserSelector';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';

const UserAvailabilityContent: React.FC = () => {
  const { role, user } = useAuth();
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const { staffMembers, loading: isLoadingStaff } = useStaffAvailability();
  const { toast } = useToast();
  
  console.log('UserAvailabilityContent rendering', { 
    staffCount: staffMembers.length, 
    isLoadingStaff,
    selectedUserId,
    currentUser: user?.id
  });
  
  // Set the initial selected user to the current user - only once when user info is available
  useEffect(() => {
    if (user && !selectedUserId && user.id) {
      console.log('Setting initial selectedUserId to current user:', user.id);
      setSelectedUserId(user.id);
    }
  }, [user, selectedUserId]);
  
  const { 
    loading: isLoadingAvailability,
    dailyAvailability,
    refreshAvailability,
    addSlot,
    updateSlot,
    deleteSlot,
    copyDaySlots
  } = useUserAvailability(selectedUserId || undefined);

  const handleUserChange = useCallback((userId: string) => {
    console.log('User changed to:', userId);
    // When user changes, we reset everything
    setSelectedUserId(userId);
  }, []);

  const handleRefresh = useCallback(async () => {
    if (isLoadingAvailability) {
      console.log('Already refreshing, skipping request');
      return;
    }
    
    try {
      await refreshAvailability();
      toast({
        title: "Availability refreshed",
        description: "Your availability schedule has been updated.",
      });
    } catch (error) {
      console.error("Error refreshing availability:", error);
      toast({
        title: "Refresh failed",
        description: "Could not refresh availability schedule.",
        variant: "destructive"
      });
    }
  }, [refreshAvailability, isLoadingAvailability, toast]);

  // Find selected user details
  const selectedUser = staffMembers.find(member => member.id === selectedUserId);
  const isOwnAvailability = selectedUserId === user?.id;
  
  const showLoading = isLoadingAvailability || !selectedUserId || isLoadingStaff;
  
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
            <StaffUserSelector
              staffMembers={staffMembers}
              selectedUserId={selectedUserId}
              isLoading={isLoadingStaff}
              onUserChange={handleUserChange}
            />
          </div>
        )}
      </div>

      <div className="w-full border rounded-md bg-white shadow-sm h-[calc(100vh-280px)] overflow-auto">
        {isLoadingStaff && !selectedUserId ? (
          <div className="p-6 space-y-4">
            <Skeleton className="h-8 w-1/3" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
          </div>
        ) : selectedUserId ? (
          <>
            {!isOwnAvailability && selectedUser && (
              <div className="p-4 bg-blue-50 border-b border-blue-100 text-blue-700 font-medium">
                You are managing availability for: {selectedUser.name} ({selectedUser.role})
              </div>
            )}
            <UserAvailabilitySchedule 
              dailyAvailability={dailyAvailability}
              loading={showLoading}
              onAddSlot={addSlot}
              onUpdateSlot={updateSlot}
              onDeleteSlot={deleteSlot}
              onCopyDay={copyDaySlots}
              onRefresh={handleRefresh}
              userId={selectedUserId}
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
