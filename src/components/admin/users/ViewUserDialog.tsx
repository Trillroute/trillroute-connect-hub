
import React from 'react';
import { format } from 'date-fns';  // Add this import
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { UserManagementUser } from '@/types/student';
import { Trash2 } from 'lucide-react';

interface ViewUserDialogProps {
  user: UserManagementUser | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onEditFromView?: () => void;
  onDeleteUser?: () => void;
  canDeleteUser?: boolean;
}

const ViewUserDialog = ({ 
  user, 
  isOpen, 
  onOpenChange, 
  onEditFromView,
  onDeleteUser,
  canDeleteUser = false
}: ViewUserDialogProps) => {
  if (!user) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>User Details</DialogTitle>
          <DialogDescription>
            View details for {user.firstName} {user.lastName}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div>
            <strong>Full Name:</strong> {user.firstName} {user.lastName}
          </div>
          <div>
            <strong>Email:</strong> {user.email}
          </div>
          <div>
            <strong>Role:</strong> {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
          </div>
          <div>
            <strong>Created:</strong> {format(new Date(user.createdAt), 'MMM d, yyyy')}
          </div>
        </div>
        
        <DialogFooter className="flex justify-between items-center">
          <div className="flex space-x-2">
            {onEditFromView && (
              <Button variant="secondary" onClick={onEditFromView}>
                Edit
              </Button>
            )}
            {onDeleteUser && canDeleteUser && (
              <Button 
                variant="destructive" 
                onClick={onDeleteUser}
              >
                <Trash2 className="mr-2 h-4 w-4" /> Delete
              </Button>
            )}
          </div>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ViewUserDialog;
