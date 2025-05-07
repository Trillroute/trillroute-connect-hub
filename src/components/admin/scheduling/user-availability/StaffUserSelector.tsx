
import React, { useEffect } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { type StaffMember } from "@/hooks/useStaffAvailability";

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
  // For debugging
  useEffect(() => {
    console.log("StaffUserSelector rendering with:", { 
      staffCount: staffMembers.length, 
      members: staffMembers,
      selectedUserId 
    });
  }, [staffMembers, selectedUserId]);

  if (isLoading) {
    return <Skeleton className="h-10 w-full" />;
  }

  if (staffMembers.length === 0) {
    return (
      <div className="text-sm text-gray-500">
        No staff members available
      </div>
    );
  }

  return (
    <Select
      value={selectedUserId || undefined}
      onValueChange={onUserChange}
    >
      <SelectTrigger className="w-full" aria-label="Select staff member">
        <SelectValue placeholder="Select staff member" />
      </SelectTrigger>
      <SelectContent>
        {staffMembers.map((member) => (
          <SelectItem key={member.id} value={member.id}>
            {member.name} <span className="text-xs text-muted-foreground ml-1">({member.role})</span>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default StaffUserSelector;
