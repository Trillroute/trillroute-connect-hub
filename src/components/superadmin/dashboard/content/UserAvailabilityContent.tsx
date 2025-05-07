
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
  const { staffMembers, loading: isLoadingStaff, refetch: refetchStaffMembers } = useStaffAvailability();
  const { toast } = useToast();
  const [isUserChanging, setIsUserChanging] = useState(false);
  
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
  
  // Force refetch staff members data on initial render
  useEffect(() => {
    console.log('Initial load: fetching staff members data');
    refetchStaffMembers();
    // Only run this on first render
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  
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
    setIsUserChanging(true);
    setSelectedUserId(userId);
    
    // Reset user changing state after a short delay
    setTimeout(() => {
      setIsUserChanging(false);
    }, 500);
  }, []);

  const handleRefresh = useCallback(async () => {
    if (isLoadingAvailability || isUserChanging) {
      console.log('Already refreshing or changing user, skipping request');
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
  }, [refreshAvailability, isLoadingAvailability, isUserChanging, toast]);

  // Find selected user details
  const selectedUser = staffMembers.find(member => member.id === selectedUserId);
  const isOwnAvailability = selectedUserId === user?.id;
  
  const showLoading = isLoadingStaff || !selectedUserId || isUserChanging;
  
  return (
    <ContentWrapper
      title="Staff Availability"
      description="View and manage when staff members are available throughout the week"
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
        {showLoading ? (
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
              loading={isLoadingAvailability}
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
