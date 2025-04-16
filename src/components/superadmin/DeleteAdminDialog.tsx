
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { UserManagementUser } from '@/types/student';
import { AlertTriangle } from 'lucide-react';

interface DeleteAdminDialogProps {
  admin: UserManagementUser | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onDelete: () => Promise<void>;
  isLoading: boolean;
}

const DeleteAdminDialog = ({
  admin,
  isOpen,
  onOpenChange,
  onDelete,
  isLoading,
}: DeleteAdminDialogProps) => {
  if (!admin) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-destructive" />
            Delete Administrator
          </DialogTitle>
          <DialogDescription>
            Are you sure you want to remove {admin.firstName} {admin.lastName} as an administrator?
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <p className="text-muted-foreground">
            This action will remove administrator privileges from this user. You can change their role to teacher instead if you want to keep them in the system.
          </p>
        </div>
        <DialogFooter>
          <Button onClick={() => onOpenChange(false)} variant="outline">
            Cancel
          </Button>
          <Button
            onClick={onDelete}
            disabled={isLoading}
            variant="destructive"
          >
            {isLoading ? 'Deleting...' : 'Delete Administrator'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteAdminDialog;
