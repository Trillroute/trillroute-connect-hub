
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
import { AdminLevelDetailed } from '@/types/adminLevel';

interface DeleteLevelDialogProps {
  level: AdminLevelDetailed | null;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onDelete: () => void;
  isLoading: boolean;
}

const DeleteLevelDialog = ({
  level,
  isOpen,
  onOpenChange,
  onDelete,
  isLoading,
}: DeleteLevelDialogProps) => {
  if (!level) return null;

  return (
    <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Admin Level</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete the admin level "{level.name}"?
            This action cannot be undone.
            <br />
            <br />
            Note: You cannot delete an admin level that is assigned to users.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={onDelete}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            disabled={isLoading}
          >
            {isLoading ? 'Deleting...' : 'Delete'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteLevelDialog;
