
import React from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { UserManagementUser } from '@/types/student';

interface DeleteUserDialogProps {
  user: UserManagementUser | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onDelete: () => void;
  isLoading: boolean;
  userRole?: string;
}

const DeleteUserDialog = ({ 
  user, 
  isOpen, 
  onOpenChange, 
  onDelete, 
  isLoading,
  userRole = 'User'
}: DeleteUserDialogProps) => {
  if (!user) return null;
  
  const displayRole = userRole || (
    user.role === 'superadmin' ? 'Super Admin' :
    user.role.charAt(0).toUpperCase() + user.role.slice(1)
  );
  
  return (
    <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure you want to delete this {displayRole.toLowerCase()}?</AlertDialogTitle>
          <AlertDialogDescription>
            You are about to delete {user.firstName} {user.lastName} ({user.email}).
            This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
          <AlertDialogAction 
            onClick={onDelete} 
            disabled={isLoading}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {isLoading ? 'Deleting...' : `Delete ${displayRole}`}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteUserDialog;
