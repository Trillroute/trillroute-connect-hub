
import React from 'react';
import ContentWrapper from './ContentWrapper';
import { Badge } from "@/components/ui/badge";
import UserAvailabilitySchedule from '@/components/admin/scheduling/user-availability/UserAvailabilitySchedule';
import StaffUserSelector from '@/components/admin/scheduling/user-availability/StaffUserSelector';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';
import { useUserAvailabilityContent } from '@/hooks/admin/useUserAvailabilityContent';

const UserAvailabilityContent: React.FC = () => {
  const {
    // User and permissions
    role,
    
    // Staff data
    staffMembers,
    isLoadingStaff,
    handleRefreshStaff,
    
    // Selected user
    selectedUserId,
    selectedUser,
    isOwnAvailability,
    handleUserChange,
    
    // Availability data
    isLoadingAvailability,
    dailyAvailability,
    showLoading,
    
    // Availability actions
    handleRefresh,
    addSlot,
    updateSlot,
    deleteSlot,
    copyDaySlots,
  } = useUserAvailabilityContent();
  
  return (
    <ContentWrapper
      title="Staff Availability"
      description="View and manage when staff members are available throughout the week"
    >
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-4">
        <div className="flex flex-wrap gap-2 items-center">
          <Badge variant="outline" className="bg-gray-100">
            Viewing as: {role?.toUpperCase()}
          </Badge>
          
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleRefreshStaff}
            disabled={isLoadingStaff}
          >
            <RefreshCw className="h-4 w-4 mr-1" />
            Refresh Staff
          </Button>
        </div>

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
