
import React from 'react';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { StaffMember } from '@/hooks/useStaffAvailability';
import { Skeleton } from "@/components/ui/skeleton";

interface StaffUserSelectorProps {
  staffMembers: StaffMember[];
  selectedUserId: string | null;
  isLoading: boolean;
  onUserChange: (userId: string) => void;
}

const StaffUserSelector: React.FC<StaffUserSelectorProps> = ({
  staffMembers,
  selectedUserId,
  isLoading,
  onUserChange
}) => {
  console.log('StaffUserSelector props:', {
    staffCount: staffMembers.length,
    selectedUserId,
    isLoading
  });

  if (isLoading) {
    return <Skeleton className="h-10 w-full" />;
  }

  if (staffMembers.length === 0) {
    return <p className="text-sm text-gray-500">No staff members available</p>;
  }

  return (
    <Select
      value={selectedUserId || undefined}
      onValueChange={onUserChange}
      disabled={isLoading}
    >
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Select a user" />
      </SelectTrigger>
      <SelectContent>
        {staffMembers.map((staff) => (
          <SelectItem key={staff.id} value={staff.id}>
            {staff.name} ({staff.role})
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default StaffUserSelector;
